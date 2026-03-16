/**
 * ShieldBox.io - Unified Security Policy Engine (Judge)
 * [위치] server/core_logic/securityJudge.js
 */

const { ALGO_CEILING } = require('./cryptoRegistry'); 
const policy = require('../data/configs/security_policy.json');

const GRADE_THRESHOLDS = policy.grade_thresholds;
const GRADE_ORDER = policy.grade_order;
const SCORE_MAPPING = policy.score_mapping;

const minGrade = (g1, g2) => {
  const idx1 = GRADE_ORDER.indexOf(g1);
  const idx2 = GRADE_ORDER.indexOf(g2);
  return idx1 <= idx2 ? g1 : g2;
};

const getRawGradeFromSeconds = (seconds) => {
  if (!isFinite(seconds) || seconds > GRADE_THRESHOLDS.S) return 'S';
  if (seconds > GRADE_THRESHOLDS.A) return 'A';
  if (seconds > GRADE_THRESHOLDS.B) return 'B';
  if (seconds > GRADE_THRESHOLDS.C) return 'C';
  if (seconds > GRADE_THRESHOLDS.D) return 'D';
  return 'F';
};

/**
 * 🚨 [Fix] attackCore.js에서 호출할 함수 이름을 scoreFromSeconds로 정의
 */
const scoreFromSeconds = (grade) => {
  if (!grade) return 5;
  // 'F — 즉시 해독' 등의 문자열에서 순수 등급 'F'만 추출
  const pureGrade = grade.split(' ')[0];
  return SCORE_MAPPING[pureGrade] || 5;
};

const finalizeGrade = (seconds, algorithm, pwLen, config = {}) => {
  let rawGrade = getRawGradeFromSeconds(seconds);
  const ceiling = ALGO_CEILING[algorithm] || 'S';
  let finalGrade = minGrade(rawGrade, ceiling);

  const penalties = [];

  if (pwLen < 8) {
    finalGrade = 'F';
    penalties.push("치명적인 키 공간(Entropy) 부족 (8자 미만)");
  } else if (pwLen < 10) {
    const currentIdx = GRADE_ORDER.indexOf(finalGrade);
    finalGrade = GRADE_ORDER[Math.max(0, currentIdx - 1)];
    penalties.push("권장 보안 기준 미달의 암호 길이 (10자 미만)");
  }

  const isInternalSaltAlgo = ['bcrypt', 'scrypt', 'argon2id'].includes(algorithm);
  if (config.useSalt === false && !isInternalSaltAlgo) {
    finalGrade = 'F';
    penalties.push("치명적 보안 결함: Salt 부재로 인해 Rainbow Table 공격에 무방비함");
  }

  return { grade: finalGrade, penalties };
};

module.exports = {
  getRawGradeFromSeconds,
  finalizeGrade,
  scoreFromSeconds, // 🚨 내보내기 이름 확정
  GRADE_ORDER
};