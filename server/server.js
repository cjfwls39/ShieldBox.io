/**
 * ShieldBox.io - Central Orchestration Server
 * [위치] server/server.js
 *
 * [수정 사항]
 * 1. [BUG-04] start_attack 핸들러 구조분해에 wordlistSize, ruleSet 추가
 * 2. [BUG-04] engine.analyze() 호출 인자에 wordlistSize, ruleSet 포함
 *    - 클라이언트(useShieldEngine.js) → 서버 → 엔진으로 이어지는
 *      전체 파이프라인에서 attackConfig 값이 유실되지 않도록 수정
 */

require('dotenv').config();
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');

const attackCore = require('./core_logic/attackCore');

// 공격 엔진 로드
const attackEngines = {
  brute_force:        require('./engines/attacks/bruteForce'),
  dictionary:         require('./engines/attacks/dictionary'),
  rainbow_table:      require('./engines/attacks/rainbowTable'),
  side_channel:       require('./engines/attacks/sideChannel'),
  mask_attack:        require('./engines/attacks/maskAttack'),
  rule_based:         require('./engines/attacks/ruleBased'),
  credential_stuffing:require('./engines/attacks/credentialStuffing'),
};

// 해싱 엔진 로드
const hashingEngines = {
  md5:     require('./engines/hashing/md5'),
  sha256:  require('./engines/hashing/sha256'),
  sha512:  require('./engines/hashing/sha512'),
  bcrypt:  require('./engines/hashing/bcrypt'),
  scrypt:  require('./engines/hashing/scrypt'),
  argon2id:require('./engines/hashing/argon2'),
};

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// 세션 저장소 (메모리)
const sessionStore = new Map();

io.on('connection', (socket) => {
  console.log(`[SYSTEM] Client Connected: ${socket.id}`);

  // ── 1. 해싱 및 세션 초기화 (방어막 생성) ──────────────────────────────
  socket.on('start_hashing', async (data) => {
    const { password, algorithm, config, isGenerated } = data;

    try {
      console.log(`[SHIELD-IN] Attempting Hashing | Algo: ${algorithm}`);

      const engine = hashingEngines[algorithm];
      if (!engine) throw new Error('지원하지 않는 알고리즘입니다.');

      const finalConfig = { ...config, systemPepper: process.env.SYSTEM_SECRET_PEPPER || '' };
      const hashedPassword = await engine.run(password, finalConfig);

      // 기존 세션이 있다면 초기화 후 새 데이터 저장 (Fresh Start)
      sessionStore.set(socket.id, {
        password,
        hash: hashedPassword,
        config: finalConfig,
        algorithm,
        isGenerated,
        lastAnalysis: null,
      });

      console.log(`[SHIELD-STORE] Session Ready for ID: ${socket.id}`);
      socket.emit('hash_result', hashedPassword);
      socket.emit('log', 'S: [SUCCESS] 방어막 생성됨. 새로운 분석 준비 완료.');
    } catch (error) {
      socket.emit('log', `S: [ERROR] 엔진 오류: ${error.message}`);
    }
  });

  // ── 2. 공격 시뮬레이션 및 결과 전송 ───────────────────────────────────
  socket.on('start_attack', async (data) => {
    // [BUG-04] 기존: { method, hardware, threads, intensity }만 구조분해
    //          수정: wordlistSize, ruleSet까지 함께 추출
    const {
      method,
      hardware,
      threads,
      intensity,
      wordlistSize, // [BUG-04] dictionary / rainbow_table UI 설정값
      ruleSet,      // [BUG-04] rule_based UI 설정값 (미래 확장 대비 포함)
    } = data;

    const session = sessionStore.get(socket.id);

    if (!session) {
      socket.emit('log', 'A: [ERROR] 세션이 없습니다. 먼저 암호를 입력하고 방어막을 생성하세요.');
      return;
    }

    try {
      const engine = attackEngines[method];
      if (!engine) throw new Error(`지원하지 않는 공격 기법입니다: ${method}`);

      console.log(`[ATTACK-START] Method: ${method}, Hardware: ${hardware}, WordlistSize: ${wordlistSize ?? 'default'}`);

      // [BUG-04] engine.analyze()에 wordlistSize, ruleSet을 함께 전달
      const result = engine.analyze({
        shieldConfig: session.config,
        pwLen:        session.password.length,
        hardware,
        threads,
        intensity,
        wordlistSize, // [BUG-04] 엔진이 직접 data.wordlistSize로 읽을 수 있도록 전달
        ruleSet,      // [BUG-04] 동일 이유
        targetHash:   session.hash,
        password:     session.password,
        isGenerated:  session.isGenerated,
      });

      // 시나리오 기반 로그 순차 전송
      for (const log of result.simulationLogs) {
        socket.emit('log', `A: ${log}`);
        await new Promise((r) => setTimeout(r, 200));
      }

      // 최종 결과 전송
      socket.emit('attack_analysis_result', result);

      session.lastAnalysis = method;
    } catch (error) {
      console.error('[ATTACK-CRITICAL]', error);
      socket.emit('log', `A: [CRITICAL] 분석 중단: ${error.message}`);
    }
  });

  // ── 3. 세션 완전 수동 초기화 (Reset 버튼용) ───────────────────────────
  socket.on('reset_session', () => {
    sessionStore.delete(socket.id);
    console.log(`[SYSTEM] Session Cleared for ID: ${socket.id}`);
    socket.emit('log', 'S: [RESET] 모든 정보가 초기화되었습니다.');
  });

  socket.on('disconnect', () => {
    sessionStore.delete(socket.id);
    console.log(`[SYSTEM] Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`ShieldBox.io Core Running on Port ${PORT}`);
});