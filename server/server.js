/**
 * ShieldBox.io - Central Orchestration Server
 * [위치] server/server.js
 */

// __dirname = server/ → 루트의 .env 참조 (통합 환경변수)
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const cfg   = require('./config/shield-config');
const guard = require('./guards/memoryGuard');
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const fs     = require('fs');

const attackCore  = require('./core_logic/attackCore');
const inspector   = require('./core_logic/hashInspector');

// 공격 엔진 로드
const attackEngines = {
  brute_force:         require('./engines/attacks/bruteForce'),
  dictionary:          require('./engines/attacks/dictionary'),
  rainbow_table:       require('./engines/attacks/rainbowTable'),
  side_channel:        require('./engines/attacks/sideChannel'),
  mask_attack:         require('./engines/attacks/maskAttack'),
  rule_based:          require('./engines/attacks/ruleBased'),
  credential_stuffing: require('./engines/attacks/credentialStuffing'),
  collision_attack:    require('./engines/attacks/collisionAttack'),
};

const app = express();
app.set('trust proxy', 1);
app.use(cors());

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  const mem = guard.checkMemory();
  res.status(200).json({
    status:  'ok',
    memory:  `RSS ${mem.rssMB}MB / 400MB (${Math.round(mem.ratio * 100)}%)`,
    rss:     `${mem.rssMB}MB`,
    guard:   mem.state,
    uptime:  Math.round(process.uptime()) + 's',
  });
});

// ── 프론트엔드 정적 파일 서빙 ─────────────────────────────────────────────
const distPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*splat', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  console.log('[SYSTEM] Static files served from client/dist/');
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:  process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// ── 세션 저장소 ───────────────────────────────────────────────────────────
const sessionStore = new Map();

// ── 해시 포맷 검증 ────────────────────────────────────────────────────────
const validateHashFormat = (hash, algorithm) => {
  if (!hash || typeof hash !== 'string') return false;
  switch (algorithm) {
    case 'bcrypt':   return hash.startsWith('$2b$') || hash.startsWith('$2a$');
    case 'argon2id': return hash.startsWith('$argon2id$');
    case 'scrypt':   return hash.startsWith('scrypt$') && hash.split('$').length === 6;
    case 'sha256':   return hash.startsWith('sha256$') && hash.split('$').length === 3;
    case 'sha512':   return hash.startsWith('sha512$') && hash.split('$').length === 3;
    case 'md5':      return hash.startsWith('md5$') && hash.split('$').length === 3;
    default:         return false;
  }
};

io.on('connection', (socket) => {
  const clientIp = socket.handshake.headers['x-forwarded-for']?.split(',')[0]?.trim()
                || socket.handshake.address
                || 'unknown';
  console.log(`[SYSTEM] Client Connected: ${socket.id} (${clientIp})`);

  // ── 1. 클라이언트 해싱 결과 수신 및 검증 ─────────────────────────────
  // 해싱은 브라우저(hash-wasm)에서 수행 — 서버는 결과를 검증 후 세션에 저장
  socket.on('submit_hash', (data) => {
    const { hash, algorithm, config, password, isGenerated, warnings } = data;

    try {
      // Rate Limit 체크
      const hashGuard = guard.guardHashing(clientIp, algorithm, config);
      if (!hashGuard.allowed) {
        socket.emit('log', `S: ${hashGuard.message}`);
        return;
      }

      // 포맷 검증
      if (!validateHashFormat(hash, algorithm)) {
        socket.emit('log', 'S: [ERROR] 해시 형식이 올바르지 않습니다.');
        return;
      }

      // Salt 존재 여부 검증
      const { hasSalt } = inspector.parseSaltFromHash(hash, algorithm);
      const saltRequired = ['scrypt', 'argon2id', 'bcrypt'].includes(algorithm);
      if (saltRequired && !hasSalt) {
        socket.emit('log', 'S: [ERROR] Salt가 포함되지 않은 해시입니다.');
        return;
      }

      // 세션 저장
      sessionStore.set(socket.id, {
        password,
        hash,
        config,
        algorithm,
        isGenerated,
        lastAnalysis: null,
      });

      if (warnings?.length) {
        socket.emit('log', `S: [INFO] 기기 사양에 맞게 파라미터 조정: ${warnings.join(', ')}`);
      }

      console.log(`[SHIELD-STORE] Session Ready | Algo: ${algorithm} | ID: ${socket.id}`);
      socket.emit('hash_result', hash);
      socket.emit('log', 'S: [SUCCESS] 방어막 생성됨. 새로운 분석 준비 완료.');
    } catch (error) {
      socket.emit('log', `S: [ERROR] ${error.message}`);
    }
  });

  // ── 2. 공격 시뮬레이션 ────────────────────────────────────────────────
  socket.on('start_attack', async (data) => {
    // Rate Limit + Circuit Breaker
    const attackGuard = guard.guardAttack(clientIp);
    if (!attackGuard.allowed) {
      socket.emit('log', `A: ${attackGuard.message}`);
      return;
    }

    const {
      method, hardware, threads, intensity,
      wordlistSize, ruleSet,
    } = data;

    const session = sessionStore.get(socket.id);
    if (!session) {
      socket.emit('log', 'A: [ERROR] 세션이 없습니다. 먼저 암호를 입력하고 방어막을 생성하세요.');
      return;
    }

    try {
      const engine = attackEngines[method];
      if (!engine) throw new Error(`지원하지 않는 공격 기법입니다: ${method}`);

      console.log(`[ATTACK-START] Method: ${method}, Hardware: ${hardware}`);

      const result = engine.analyze({
        shieldConfig: session.config,
        pwLen:        session.password.length,
        hardware,
        threads,
        intensity,
        wordlistSize,
        ruleSet,
        targetHash:   session.hash,
        password:     session.password,
        isGenerated:  session.isGenerated,
      });

      for (const log of result.simulationLogs) {
        socket.emit('log', `A: ${log}`);
        await new Promise((r) => setTimeout(r, cfg.simulation.logDelayMs));
      }

      socket.emit('attack_analysis_result', result);
      session.lastAnalysis = method;
    } catch (error) {
      console.error('[ATTACK-CRITICAL]', error);
      socket.emit('log', `A: [CRITICAL] 분석 중단: ${error.message}`);
    }
  });

  // ── 3. 세션 초기화 ────────────────────────────────────────────────────
  socket.on('reset_session', () => {
    sessionStore.delete(socket.id);
    console.log(`[SYSTEM] Session Cleared for ID: ${socket.id}`);
    socket.emit('log', 'S: [RESET] 모든 정보가 초기화되었습니다.');
  });

  socket.on('disconnect', () => {
    sessionStore.delete(socket.id);
    console.log(`[SYSTEM] Client Disconnected: ${socket.id}`);
    if (global.gc && sessionStore.size === 0) global.gc();
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, cfg.server.host, () => {
  console.log(`[SYSTEM] ShieldBox.io Core Running on ${cfg.server.host}:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('[CRITICAL] Unhandled Promise Rejection:', reason);
});