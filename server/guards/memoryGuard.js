/**
 * ShieldBox.io — Shield Guard System
 * [위치] server/guards/memoryGuard.js
 *
 * 역할: 서버 자원을 보호하는 3단계 방어 시스템
 *
 *   1. MemorySafeguard  — 메모리 70% 이상: 해싱 파라미터 자동 하향
 *   2. CircuitBreaker   — 메모리 85% 이상: 분석 요청 일시 차단
 *   3. RateLimiter      — IP별 요청 횟수 제한
 *
 * 모든 임계치는 shield-config.js의 guard 섹션에서 관리합니다.
 */

'use strict';

const cfg = require('../config/shield-config');

const { memory: MEM, rateLimit: RL } = cfg.guard;
const { hashing } = cfg;

/* ══════════════════════════════════════════════════════════
   1. MEMORY STATE — 현재 메모리 상태 판단
══════════════════════════════════════════════════════════ */

const MEMORY_STATE = {
  OK:              'OK',              // 정상
  SAFEGUARD:       'SAFEGUARD',       // 70%+ → 파라미터 하향
  CIRCUIT_BREAKER: 'CIRCUIT_BREAKER', // 85%+ → 요청 차단
};

/**
 * 현재 힙 사용률을 측정하고 상태를 반환합니다.
 * @returns {{ state: string, usedMB: number, totalMB: number, ratio: number }}
 */
// GC 마지막 호출 시각 추적 (너무 자주 호출 방지)
let lastGcAt = 0;

// RSS 기반 최대 메모리 (--max-old-space-size와 동일)
const MAX_RSS_MB = 400;

function checkMemory() {
  const { heapUsed, heapTotal, rss } = process.memoryUsage();
  const usedMB  = Math.round(heapUsed / 1024 / 1024);
  const totalMB = Math.round(heapTotal / 1024 / 1024);
  const rssMB   = Math.round(rss / 1024 / 1024);

  // heapTotal은 초기에 너무 작게 잡혀 비율이 왜곡됨
  // → RSS / MAX_RSS_MB 기준으로 실제 메모리 압박 판단
  const ratio = rssMB / MAX_RSS_MB;

  let state;
  if      (ratio >= MEM.circuitBreakerThreshold) state = MEMORY_STATE.CIRCUIT_BREAKER;
  else if (ratio >= MEM.safeguardThreshold)      state = MEMORY_STATE.SAFEGUARD;
  else                                           state = MEMORY_STATE.OK;

  // SAFEGUARD 이상일 때 GC 적극 호출 (30초에 한 번으로 제한)
  if (state !== MEMORY_STATE.OK && global.gc) {
    const now = Date.now();
    if (now - lastGcAt > 30_000) {
      global.gc();
      lastGcAt = now;
      console.log(`[GUARD] GC 강제 실행 — 메모리 ${Math.round(ratio * 100)}% (RSS: ${rssMB}MB)`);
    }
  }

  return { state, usedMB, totalMB, rssMB, ratio: parseFloat(ratio.toFixed(3)) };
}

/* ══════════════════════════════════════════════════════════
   2. PARAM CLAMP — 메모리 세이프가드 발동 시 파라미터 하향
   shield-config의 안전 기본값 이하로 강제 조정합니다.
══════════════════════════════════════════════════════════ */

/**
 * SAFEGUARD 모드에서 해싱 파라미터를 안전한 수준으로 하향합니다.
 * 원본 config를 변경하지 않고 새 객체를 반환합니다.
 *
 * @param {string} algorithm
 * @param {object} config — 사용자 요청 파라미터
 * @returns {{ clamped: object, wasAdjusted: boolean, adjustments: string[] }}
 */
function clampHashingParams(algorithm, config) {
  // 세이프가드 기준:
  //   "기본값"이 아닌 "서버 환경 안전 상한(max)"으로 clamp
  //   → 사용자가 의도적으로 높게 설정해도 max까지는 허용
  //   → max 초과분만 하향 조정
  const clamped     = { ...config };
  const adjustments = [];

  switch (algorithm) {
    case 'scrypt': {
      const safeMax = hashing.scrypt.maxMemoryCostMB; // 128MB
      if ((clamped.memoryCost || 0) > safeMax) {
        clamped.memoryCost = safeMax;
        adjustments.push(`memoryCost ${config.memoryCost}MB → ${safeMax}MB (서버 상한)`);
      }
      break;
    }
    case 'argon2id': {
      const safeMaxMem  = hashing.argon2.maxMemoryCostMB; // 128MB
      const safeMaxTime = hashing.argon2.maxTimeCost;     // 5
      if ((clamped.memoryCost || 0) > safeMaxMem) {
        clamped.memoryCost = safeMaxMem;
        adjustments.push(`memoryCost ${config.memoryCost}MB → ${safeMaxMem}MB`);
      }
      if ((clamped.timeCost || 0) > safeMaxTime) {
        clamped.timeCost = safeMaxTime;
        adjustments.push(`timeCost ${config.timeCost} → ${safeMaxTime}`);
      }
      break;
    }
    case 'bcrypt': {
      const safeMaxCF = hashing.bcrypt.maxCostFactor; // 14
      if ((clamped.costFactor || 0) > safeMaxCF) {
        clamped.costFactor = safeMaxCF;
        adjustments.push(`costFactor ${config.costFactor} → ${safeMaxCF}`);
      }
      break;
    }
    // md5, sha256, sha512는 메모리 사용이 미미하여 clamp 불필요
  }

  return {
    clamped,
    wasAdjusted: adjustments.length > 0,
    adjustments,
  };
}

/* ══════════════════════════════════════════════════════════
   3. CIRCUIT BREAKER — 서킷 브레이커 상태 관리
   85% 초과 시 차단, cooldownMs 후 자동 해제
══════════════════════════════════════════════════════════ */

let circuitOpenAt = null; // 서킷이 열린 시각 (null = 닫힘)

/**
 * 서킷 브레이커가 현재 열려있는지(차단 중인지) 확인합니다.
 * cooldown 시간이 지나면 자동으로 닫힙니다.
 * @returns {boolean}
 */
function isCircuitOpen() {
  if (!circuitOpenAt) return false;

  const elapsed = Date.now() - circuitOpenAt;
  if (elapsed >= MEM.cooldownMs) {
    circuitOpenAt = null; // 자동 해제
    console.log(`[GUARD] 서킷 브레이커 해제 — ${MEM.cooldownMs / 1000}초 쿨다운 완료`);
    return false;
  }

  return true;
}

/**
 * 서킷을 강제로 엽니다 (차단 시작).
 */
function openCircuit() {
  if (!circuitOpenAt) {
    circuitOpenAt = Date.now();
    console.warn(`[GUARD] 🔴 서킷 브레이커 발동 — 메모리 ${Math.round(MEM.circuitBreakerThreshold * 100)}% 초과. ${MEM.cooldownMs / 1000}초 후 자동 해제`);
  }
}

/* ══════════════════════════════════════════════════════════
   4. RATE LIMITER — IP별 요청 횟수 제한
   외부 라이브러리 없이 Map 기반으로 구현합니다.
══════════════════════════════════════════════════════════ */

/**
 * Rate Limiter 인스턴스를 생성합니다.
 *
 * @param {number} maxRequests — 윈도우 내 최대 허용 요청 수
 * @param {number} windowMs    — 윈도우 크기 (ms)
 * @returns {{ isAllowed: (ip: string) => boolean, clear: () => void }}
 */
function createRateLimiter(maxRequests, windowMs) {
  // ip → { count: number, windowStart: number }
  const store = new Map();

  // 만료된 항목 주기적 정리 (메모리 누수 방지)
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      if (now - record.windowStart >= windowMs) store.delete(ip);
    }
  }, windowMs);

  // 프로세스 종료 시 interval 정리
  cleanupInterval.unref?.();

  return {
    /**
     * 요청 허용 여부를 판단하고 카운터를 증가시킵니다.
     * @param {string} ip
     * @returns {boolean} true = 허용, false = 차단
     */
    isAllowed(ip) {
      const now    = Date.now();
      const record = store.get(ip);

      if (!record || now - record.windowStart >= windowMs) {
        // 새 윈도우 시작
        store.set(ip, { count: 1, windowStart: now });
        return true;
      }

      if (record.count >= maxRequests) {
        return false; // 한도 초과
      }

      record.count++;
      return true;
    },

    /** 남은 시도 횟수 조회 */
    remaining(ip) {
      const record = store.get(ip);
      if (!record || Date.now() - record.windowStart >= windowMs) return maxRequests;
      return Math.max(0, maxRequests - record.count);
    },

    /** 스토어 초기화 (테스트용) */
    clear() { store.clear(); },
  };
}

/* ══════════════════════════════════════════════════════════
   5. INTEGRATED GUARD — server.js에서 호출하는 통합 인터페이스
══════════════════════════════════════════════════════════ */

// 싱글턴 Rate Limiter 인스턴스
const attackLimiter = createRateLimiter(RL.attackMaxPerWindow, RL.attackWindowMs);
const hashLimiter   = createRateLimiter(RL.hashMaxPerWindow,   RL.hashWindowMs);

/**
 * start_hashing 이벤트 전 가드 실행
 *
 * @param {string} ip
 * @param {string} algorithm
 * @param {object} config
 * @returns {{ allowed: boolean, config: object, message?: string, adjustments?: string[] }}
 */
function guardHashing(ip, algorithm, config) {
  // 1. Rate Limit
  if (!hashLimiter.isAllowed(ip)) {
    return {
      allowed: false,
      config,
      message: `[GUARD] 요청 한도 초과. ${RL.hashWindowMs / 1000}초 후 다시 시도하세요. (${RL.hashMaxPerWindow}회/${RL.hashWindowMs / 1000}초)`,
    };
  }

  // 2. Circuit Breaker
  const memStatus = checkMemory();
  if (memStatus.state === MEMORY_STATE.CIRCUIT_BREAKER) {
    openCircuit();
    return {
      allowed: false,
      config,
      message: `[GUARD] 서버 부하가 높아 잠시 후 이용 가능합니다. (메모리 ${Math.round(memStatus.ratio * 100)}% 사용 중)`,
    };
  }
  if (isCircuitOpen()) {
    return {
      allowed: false,
      config,
      message: `[GUARD] 서버 안정화 중입니다. 잠시 후 다시 시도해 주세요.`,
    };
  }

  // 3. Safeguard — 파라미터 하향
  if (memStatus.state === MEMORY_STATE.SAFEGUARD) {
    const { clamped, wasAdjusted, adjustments } = clampHashingParams(algorithm, config);
    if (wasAdjusted) {
      console.warn(`[GUARD] 🟡 세이프가드 발동 (메모리 ${Math.round(memStatus.ratio * 100)}%) — ${adjustments.join(', ')}`);
    }
    return { allowed: true, config: clamped, adjustments: wasAdjusted ? adjustments : [] };
  }

  return { allowed: true, config };
}

/**
 * start_attack 이벤트 전 가드 실행
 *
 * @param {string} ip
 * @returns {{ allowed: boolean, message?: string }}
 */
function guardAttack(ip) {
  // 1. Rate Limit
  if (!attackLimiter.isAllowed(ip)) {
    const remaining = RL.attackWindowMs / 1000;
    return {
      allowed: false,
      message: `[GUARD] 공격 시뮬레이션 한도 초과. ${remaining}초 후 다시 시도하세요. (${RL.attackMaxPerWindow}회/${remaining}초 제한)`,
    };
  }

  // 2. Circuit Breaker
  const memStatus = checkMemory();
  if (memStatus.state === MEMORY_STATE.CIRCUIT_BREAKER) {
    openCircuit();
    return {
      allowed: false,
      message: `[GUARD] 현재 서버 부하가 높아 분석이 일시 중단되었습니다. (메모리 ${Math.round(memStatus.ratio * 100)}% 사용 중)`,
    };
  }
  if (isCircuitOpen()) {
    return {
      allowed: false,
      message: `[GUARD] 서버 안정화 중입니다. 잠시 후 다시 시도해 주세요.`,
    };
  }

  return { allowed: true };
}

/* ══════════════════════════════════════════════════════════
   Export
══════════════════════════════════════════════════════════ */
// ── 주기적 메모리 정리 스케줄러 ──────────────────────────────────────────
// 5분마다 GC 실행 + 세션 스토어 외부에서 관리 못하는 메모리 정리
const PERIODIC_GC_INTERVAL = 5 * 60 * 1000; // 5분
setInterval(() => {
  if (global.gc) {
    global.gc();
    const { heapUsed, heapTotal, rss } = process.memoryUsage();
    const ratio = Math.round((heapUsed / heapTotal) * 100);
    const rssMB = Math.round(rss / 1024 / 1024);
    console.log(`[GUARD] 주기적 GC 완료 — 힙 ${ratio}% | RSS ${rssMB}MB`);
  }
}, PERIODIC_GC_INTERVAL).unref(); // unref: GC 타이머가 프로세스 종료를 막지 않음

module.exports = {
  guardHashing,
  guardAttack,
  checkMemory,        // 헬스체크 엔드포인트에서 직접 사용
  MEMORY_STATE,
  // 테스트 및 디버깅용
  _attackLimiter: attackLimiter,
  _hashLimiter:   hashLimiter,
};