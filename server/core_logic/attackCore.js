/**
 * ShieldBox.io - Unified Attack Core (Korean Numeral & High-Precision)
 * [위치] server/core_logic/attackCore.js
 * [수정 사항] 
 * 1. 🚨 [TypeError Fix] judge.calculateSecurityScore 호출을 judge.scoreFromSeconds로 변경
 */

const registry  = require('./cryptoRegistry');
const physics   = require('./physicsEngine');
const judge     = require('./securityJudge');
const inspector = require('./hashInspector');

/**
 * 2. 공통 유틸리티: 고정밀 시간 포맷팅 (Korean Numeral System)
 */
const formatSeconds = (seconds) => {
  if (!isFinite(seconds) || seconds > 1e25) return '∞ (물리적 한계)';
  if (seconds < 1) return '즉시 (< 1초)';

  const years = seconds / 31536000;
  
  if (years < 1) {
    if (seconds < 60) return `${seconds.toFixed(1)}초`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(0)}분`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(0)}시간`;
    return `${(seconds / 86400).toFixed(0)}일`;
  }

  if (years < 10000) return `${years.toFixed(1)}년`;
  if (years < 1e8) return `${(years / 1e4).toFixed(1)}만년`;
  if (years < 1e12) return `${(years / 1e8).toFixed(1)}억년`;
  if (years < 1e16) return `${(years / 1e12).toFixed(1)}조년`;
  if (years < 1e20) return `${(years / 1e16).toFixed(1)}경년`;
  if (years < 1e24) return `${(years / 1e20).toFixed(1)}해년`;
  
  return '∞ (우주적 스케일)';
};

/**
 * 3. 통합 인터페이스 수출 (Unified API Export)
 */
module.exports = {
  HASH_RATES:           registry.HASH_RATES,
  ATTACK_MULTIPLIERS:   registry.ATTACK_MULTIPLIERS,
  ALGO_CEILING:         registry.ALGO_CEILING,

  calcCrackTime:           physics.calcCrackTime,
  calcDictionaryCrackTime: physics.calcDictionaryCrackTime,
  getParamPenalty:         physics.getParamPenalty,

  // 🚨 [Fix] finalizeGrade는 그대로 유지하고, 점수 계산 함수 이름을 scoreFromSeconds로 통일
  gradeFromSeconds: (seconds, algorithm, pwLen, config) => 
    judge.finalizeGrade(seconds, algorithm, pwLen, config),
    
  scoreFromSeconds: (grade) => 
    judge.scoreFromSeconds(grade), // calculateSecurityScore에서 수정

  ALWAYS_HAS_SALT:   inspector.ALWAYS_HAS_SALT,
  parseSaltFromHash: inspector.parseSaltFromHash,
  verifyHash:        inspector.verifyHash,
  canActuallyVerify: inspector.canActuallyVerify,

  formatSeconds,
  TIMING_SIMULATE_ONLY: new Set(['bcrypt', 'scrypt', 'argon2id']),

  // 엔진들이 등급 Cap 연산에 사용하는 순서 배열 — securityJudge에서 re-export
  GRADE_ORDER: judge.GRADE_ORDER,
};