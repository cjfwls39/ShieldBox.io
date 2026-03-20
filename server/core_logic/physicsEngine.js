/**
 * ShieldBox.io - Unified Physics Calculation Engine
 * [위치] server/core_logic/physicsEngine.js
 *
 * [수정 사항]
 * 1. [BUG-03] Scrypt 워크 팩터 계산 시 memoryCost를
 *    scrypt.js 해싱 엔진과 동일한 2^n 내림 로직으로 처리
 *    - 기존: (config.memoryCost / 32) 그대로 사용 → 최대 1.5배 과대 추정
 *    - 수정: scryptEffectiveMB() 헬퍼로 실제 N에서 역산한 MB값을 사용
 *
 * [기존 수정 사항 — 변경 없음]
 * 2. Argon2id 병렬성(Parallelism) 수식 교정
 * 3. Credential Stuffing 공격 모델 수정
 */

const { HASH_RATES, ATTACK_MULTIPLIERS } = require('./cryptoRegistry');
const cfg = require('../config/shield-config');

// ─────────────────────────────────────────────────────────────────────────
// [BUG-03] Scrypt 실효 메모리(MB) 계산 헬퍼
//
// scrypt.js의 N 산출 공식: N = 2^floor(log2(targetMB × 1024))
// physicsEngine도 동일한 내림 처리를 해야 수치가 일치합니다.
//
// 예시:
//   UI 32MB  → N = 2^floor(log2(32768))  = 2^15 = 32768 → 32MB   (오차 없음)
//   UI 48MB  → N = 2^floor(log2(49152))  = 2^15 = 32768 → 32MB   (48→32 내림)
//   UI 64MB  → N = 2^floor(log2(65536))  = 2^16 = 65536 → 64MB   (오차 없음)
//   UI 96MB  → N = 2^floor(log2(98304))  = 2^16 = 65536 → 64MB   (96→64 내림)
//   UI 128MB → N = 2^floor(log2(131072)) = 2^17 = 131072 → 128MB (오차 없음)
// ─────────────────────────────────────────────────────────────────────────
const scryptEffectiveMB = (targetMB) => {
  const N = Math.pow(2, Math.floor(Math.log2(targetMB * 1024)));
  return N / 1024; // N → MB 역산
};

/**
 * 알고리즘별 워크 팩터(Work Factor) 계산
 * 공격자 입장에서 해시 한 번을 계산하는 데 드는 상대적 비용 배율을 반환합니다.
 * 기준값(bcrypt CF=12, argon2id mem=64MB/iter=3/parallel=4, scrypt mem=32MB)에서
 * 설정이 강해질수록 1보다 커지고, 약해질수록 1보다 작아집니다.
 */
const getParamPenalty = (algorithm, config) => {
  switch (algorithm) {
    case 'bcrypt':
      return Math.pow(2, (config.costFactor || cfg.physics.baseline.bcrypt.costFactor) - cfg.physics.baseline.bcrypt.costFactor);

    case 'argon2id': {
      // 병렬성이 높을수록 공격자가 점유해야 할 총 자원이 늘어나므로 곱셈 처리
      const memPenalty   = (config.memoryCost || cfg.physics.baseline.argon2id.memoryCostMB) / cfg.physics.baseline.argon2id.memoryCostMB;
      const iterPenalty  = (config.timeCost   || cfg.physics.baseline.argon2id.timeCost) / cfg.physics.baseline.argon2id.timeCost;
      const parallelGain = (config.parallelism || cfg.physics.baseline.argon2id.parallelism) / cfg.physics.baseline.argon2id.parallelism;
      return memPenalty * iterPenalty * parallelGain;
    }

    case 'scrypt': {
      // [BUG-03] 기존: (config.memoryCost || 32) / 32  ← UI 설정값 그대로 사용
      //          수정: scryptEffectiveMB(targetMB) / 32 ← 실제 N 기반 값으로 계산
      const targetMB      = config.memoryCost || cfg.physics.baseline.scrypt.memoryCostMB;
      const effectiveMB   = scryptEffectiveMB(targetMB);
      const memPenalty    = effectiveMB / cfg.physics.baseline.scrypt.memoryCostMB;
      const blockPenalty  = (config.blockSize  || 8) / 8;
      const parallelCost  = config.parallelism || 1;
      return memPenalty * blockPenalty * parallelCost;
    }

    case 'sha256':
    case 'sha512':
      return Math.max((config.iterations || cfg.physics.baseline.sha.iterations) / cfg.physics.baseline.sha.iterations, 1e-6);

    default:
      return 1;
  }
};

/**
 * 범용 물리적 크랙 시간 계산
 * 탐색 공간, 하드웨어 성능, 워크 팩터, Salt 유무, 공격 기법 승수를
 * 종합하여 예상 소요 시간(초)을 반환합니다.
 */
const calcCrackTime = (
  pwLenOrSpace,
  algorithm,
  config     = {},
  hardware   = 'gpu_cluster',
  attackType = 'brute_force'
) => {
  // A. 탐색 공간 결정
  const isDictionary = attackType === 'dictionary';
  const isStuffing   = attackType === 'credential_stuffing';

  let searchSpace;
  if (isStuffing) {
    searchSpace = cfg.physics.credentialStuffingDbSize; // 다크웹 유출 DB 평균 규모
  } else if (typeof pwLenOrSpace === 'object' && pwLenOrSpace.wordlistSize) {
    searchSpace = pwLenOrSpace.wordlistSize;
  } else {
    searchSpace = Math.pow(94, pwLenOrSpace);
  }

  // B. 하드웨어 성능 데이터 추출
  const rates  = HASH_RATES[algorithm] || HASH_RATES.bcrypt;
  const hwRate =
    hardware === 'quantum'                                                    ? rates.quantum :
    (hardware.includes('gpu') || hardware === 'asic' || hardware === 'cloud_farm') ? rates.gpu :
    rates.pc;

  // C. 알고리즘 고유 부하(Work Factor) 적용
  const workFactor = getParamPenalty(algorithm, config);

  // D. Salt 유무에 따른 공격 가속 성능 반영
  const isInternalSalt  = ['bcrypt', 'scrypt', 'argon2id'].includes(algorithm);
  const effectiveSalt   = config.useSalt !== false || isInternalSalt;
  const attackerAdvantage = effectiveSalt ? 1 : 10_000_000;

  // E. 실질 초당 연산 속도
  const effectiveRate = (hwRate / workFactor) * attackerAdvantage;

  // F. 공격 기법별 탐색 효율 승수
  const rawAttackMul = ATTACK_MULTIPLIERS[attackType] || 1.0;
  const attackMul    = (attackType === 'rainbow_table' && effectiveSalt)
    ? 1.0          // Salt 있으면 레인보우 테이블 승수 무효화
    : rawAttackMul;

  // G. 확률적 기대치 (사전/스터핑은 리스트 전체 대조 기준이므로 나누지 않음)
  const expectationDivider = (isDictionary || isStuffing) ? 1 : 2;

  return (searchSpace * attackMul) / effectiveRate / expectationDivider;
};

/**
 * 사전 공격 전용 크랙 시간 계산 헬퍼
 */
const calcDictionaryCrackTime = (
  algorithm,
  config      = {},
  hardware    = 'gpu_cluster',
  wordlistSize = 2000
) => calcCrackTime({ wordlistSize }, algorithm, config, hardware, 'dictionary');

module.exports = {
  getParamPenalty,
  calcCrackTime,
  calcDictionaryCrackTime,
  scryptEffectiveMB, // 테스트 및 useShieldEngine 프런트 동기화 용도로 노출
};