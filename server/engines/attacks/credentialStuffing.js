/**
 * ShieldBox.io - Credential Stuffing Engine
 * [위치] server/engines/attacks/credentialStuffing.js
 *
 * [수정 사항]
 * prob 계산 모델 보강 — 4가지 독립 신호를 합산하여 정확도 향상
 *
 * 기존: prob = max(5, 50 - pwLen*2) + suffix_bonus
 *       → 길이 하나만 봄. 반복문자/전화번호/전형구조 등 위험 패턴 미반영
 *
 * 수정: 아래 신호들을 누적 합산
 *   [신호A] 문자 다양성    : 1종류+30, 2종류+15, 3종류이상 패널티없음
 *   [신호B] 반복/순차 패턴 : 동일문자반복+25, 숫자순차+20, 알파벳순차+15 (max 40)
 *   [신호C] 개인정보 패턴  : 전화번호+35, 생년월일+30, 연도포함+10, 순수숫자8자+25 (max 50)
 *   [신호D] 구조 예측성    : maskIntensity 재활용, 18자이상 면제 (max 20)
 *   [suffix] 단어+suffix 패턴: suffix 제거 후 알파벳 3자이상일 때만 +20
 *            (기존: 끝에 숫자/!만 있어도 가산 → 무작위 암호도 페널티받는 오류 수정)
 */

const { isInWordlist, RULES } = require('../../data/wordlist');
const cfg = require('../../config/shield-config');
const {
  calcCrackTime,
  scoreFromSeconds,
  formatSeconds,
} = require('../../core_logic/attackCore');
const { generateReport } = require('../../data/attackReportTemplates');

// ─────────────────────────────────────────────────────────────
// [신호A] 문자 다양성 페널티
// 사용 문자 종류가 적을수록 해커 DB에 있을 가능성이 높음
// ─────────────────────────────────────────────────────────────
const diversityPenalty = (pw) => {
  const kinds = [
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^a-zA-Z0-9]/.test(pw),
  ].filter(Boolean).length;

  if (kinds === 1) return { score: cfg.attacks.credentialStuffing.diversityPenalty.oneKind, label: `단일문자종류(${kinds}종)` };
  if (kinds === 2) return { score: cfg.attacks.credentialStuffing.diversityPenalty.twoKind, label: `2종류문자(${kinds}종)` };
  return { score: 0, label: null };
};

// ─────────────────────────────────────────────────────────────
// [신호B] 반복/순차 패턴 페널티
// aaa, 123, abc 등 예측 가능한 패턴은 DB 상위권에 집중됨
// ─────────────────────────────────────────────────────────────
const repetitionPenalty = (pw) => {
  const p = pw.toLowerCase();
  let score = 0;
  const labels = [];

  if (/(.)\1{2,}/.test(p)) {
    score += cfg.attacks.credentialStuffing.repetitionPenalty.sameChar;
    labels.push('동일문자반복');
  }
  if (/(012|123|234|345|456|567|678|789|890)/.test(p)) {
    score += cfg.attacks.credentialStuffing.repetitionPenalty.numSequence;
    labels.push('숫자순차');
  }
  if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(p)) {
    score += cfg.attacks.credentialStuffing.repetitionPenalty.alphaSeq;
    labels.push('알파벳순차');
  }

  return { score: Math.min(score, cfg.attacks.credentialStuffing.repetitionPenalty.max), label: labels.join('+') || null };
};

// ─────────────────────────────────────────────────────────────
// [신호C] 개인정보 패턴 페널티
// 전화번호·생년월일은 개인 유출 시 그대로 노출 가능성 높음
// ─────────────────────────────────────────────────────────────
const personalInfoPenalty = (pw) => {
  let score = 0;
  const labels = [];

  // 한국 전화번호형 (010-XXXX-XXXX 등)
  if (/^01[016789][0-9]{7,8}$/.test(pw)) {
    score += cfg.attacks.credentialStuffing.personalInfoPenalty.phoneNumber;
    labels.push('전화번호형');
  }
  // 생년월일형 YYYYMMDD
  if (/(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/.test(pw)) {
    score += cfg.attacks.credentialStuffing.personalInfoPenalty.birthdate;
    labels.push('생년월일형');
  }
  // 연도 포함 (1950~2029)
  if (/(19[5-9]\d|20[0-2]\d)/.test(pw)) {
    score += cfg.attacks.credentialStuffing.personalInfoPenalty.yearInclude;
    labels.push('연도포함');
  }
  // 8자리 이상 순수 숫자
  if (/^\d{8,}$/.test(pw)) {
    score += cfg.attacks.credentialStuffing.personalInfoPenalty.pureDigit8;
    labels.push('순수숫자8자+');
  }

  return { score: Math.min(score, cfg.attacks.credentialStuffing.personalInfoPenalty.max), label: labels.join('+') || null };
};

// ─────────────────────────────────────────────────────────────
// [신호D] 구조 예측성 페널티 (maskIntensity 재활용)
// 전형적인 암호 생성 패턴일수록 해커 룰셋으로 재현 가능
// 18자 이상은 길이 자체가 충분한 보호 — 구조 패널티 면제
// ─────────────────────────────────────────────────────────────
const structurePenalty = (pw) => {
  if (pw.length >= cfg.attacks.credentialStuffing.structurePenalty.lengthExempt) return { score: 0, label: null };

  let intensity = 0;
  if (/^[A-Z]/.test(pw))                                          intensity += 2;
  if (/[0-9!@#$%^&*()]$/.test(pw))                               intensity += 2;
  if (/[0-9]{2,}/.test(pw))                                       intensity += 2;
  const upperCount = (pw.match(/[A-Z]/g) || []).length;
  if (upperCount === 1 && /^[A-Z]/.test(pw))                     intensity += 2;
  const symbolCount = (pw.match(/[^a-zA-Z0-9]/g) || []).length;
  if (symbolCount === 1)                                           intensity += 2;
  intensity = Math.min(10, intensity);

  if (intensity >= 8) return { score: cfg.attacks.credentialStuffing.structurePenalty.max, label: `매우전형적구조(L${intensity})` };
  if (intensity >= 6) return { score: 10, label: `전형적구조(L${intensity})` };
  if (intensity >= 4) return { score: 5,  label: `약한구조(L${intensity})` };
  return { score: 0, label: null };
};

// ─────────────────────────────────────────────────────────────
// [suffix] 단어+suffix 패턴 탐지 (강화)
// 기존: 끝에 숫자/!만 있어도 +20 → 무작위 암호도 페널티
// 수정: suffix 제거 후 남은 부분이 순수 알파벳 3자+ 일 때만 적용
//       → "xK9#mP2$nL5@qR8!" 같은 무작위 암호는 페널티 없음
// ─────────────────────────────────────────────────────────────
const SUFFIX_LIST = RULES.suffix;

const hasWordSuffix = (pw) => {
  const lower = pw.toLowerCase();
  for (const s of SUFFIX_LIST) {
    if (lower.endsWith(s)) {
      const core = pw.slice(0, -s.length);
      // 핵심: suffix 제거 후 순수 알파벳 3자 이상이어야 "단어+suffix" 패턴
      if (core.length >= 3 && /^[a-zA-Z]+$/.test(core)) {
        return { has: true, core, suffix: s };
      }
    }
  }
  return { has: false };
};

// ─────────────────────────────────────────────────────────────
// 통합 prob 계산
// ─────────────────────────────────────────────────────────────
const calcReuseProb = (pw) => {
  const signals = [];

  // 기저: 길이 기반 기초값
  const pb = cfg.attacks.credentialStuffing.probBase;
  let prob = Math.max(pb.baseMin, pb.baseMax - (pw.length * pb.lenWeight));
  signals.push(`기저=${prob}`);

  // 신호 누적
  const sA = diversityPenalty(pw);
  if (sA.score > 0) { prob += sA.score; signals.push(sA.label); }

  const sB = repetitionPenalty(pw);
  if (sB.score > 0) { prob += sB.score; signals.push(sB.label); }

  const sC = personalInfoPenalty(pw);
  if (sC.score > 0) { prob += sC.score; signals.push(sC.label); }

  const sD = structurePenalty(pw);
  if (sD.score > 0) { prob += sD.score; signals.push(sD.label); }

  const sufResult = hasWordSuffix(pw);
  if (sufResult.has) {
    prob += cfg.attacks.credentialStuffing.suffixBonus;
    signals.push(`단어+suffix(${sufResult.core}+${sufResult.suffix})`);
  }

  return {
    prob:     Math.min(99, prob),
    hasSuf:   sufResult.has,
    signals,  // 터미널 로그용
  };
};

// ─────────────────────────────────────────────────────────────
// 재사용 위험도 → 등급 매핑
// ─────────────────────────────────────────────────────────────
const reuseRiskGrade = (prob, pwLen, hasSuf) => {
  if (hasSuf || prob >= cfg.attacks.credentialStuffing.gradeThreshold.D) return 'D';
  if (prob >= cfg.attacks.credentialStuffing.gradeThreshold.C)           return 'C';
  if (pwLen >= cfg.attacks.credentialStuffing.gradeThreshold.A_minLen && prob < cfg.attacks.credentialStuffing.gradeThreshold.A_maxProb) return 'A';
  return 'B';
};

// ─────────────────────────────────────────────────────────────
const analyze = (data) => {
  const { shieldConfig, pwLen, hardware, isGenerated, password } = data;
  const algorithm = shieldConfig.algorithm;

  const logs = [
    `[Wordlist Engine] 글로벌 Credential Leakage DB 동기화 및 패턴 매칭 가동...`,
    `[Wordlist Engine] 분석 모드: ${isGenerated ? '시스템 고유 패턴' : '사용자 정의 습관 분석'}`,
  ];

  const matchResult = password ? isInWordlist(password) : { found: false };
  const crackSec    = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'credential_stuffing');
  const crackLabel  = formatSeconds(crackSec);

  let prob     = 0;
  let grade    = 'S';
  let penalties = [];

  if (matchResult.found) {
    // ── Case A: 사전 직접 매칭 → 확정적 위험 ──────────────────
    const rankPercentile = 100 - (matchResult.rank / matchResult.totalSize) * 100;
    let multiplier = 0.5;
    if      (matchResult.method === 'Direct')            multiplier = 1.0;
    else if (matchResult.method.includes('Pattern'))     multiplier = 0.8;
    else if (matchResult.method.includes('Suffix'))      multiplier = 0.6;

    prob  = (rankPercentile * multiplier).toFixed(1);
    grade = 'F';
    logs.push(`[Wordlist Engine] 🎯 Match 성공: 사전 내 상위 ${matchResult.rank}위 위험 패턴 식별`);
    penalties.push(`데이터 매칭: '${matchResult.word}' 패턴이 유출 데이터셋의 핵심 순위에 포함됨`);

  } else if (!isGenerated) {
    // ── Case B: 수동 입력 암호, 사전 미검출 ───────────────────
    const { prob: p, hasSuf, signals } = calcReuseProb(password || '');
    prob = p;

    logs.push(`[Wordlist Engine] 재사용 위험 신호 분석: ${signals.join(' → ')}`);

    grade = reuseRiskGrade(prob, pwLen, hasSuf);

    logs.push(`[Wordlist Engine] ✓ 통계 분석: 잠재적 재사용 확률 ${prob}%`);
    logs.push(`[Wordlist Engine] 알고리즘 물리 저항력(참고): ${crackLabel}`);
    penalties.push(`재사용 리스크: 수동 생성 암호는 타 서비스 유출 시 공격의 직접적인 통로가 됩니다.`);

  } else {
    // ── Case C: 시스템 생성 암호 ──────────────────────────────
    prob  = 0.01;
    grade = 'S';
    logs.push(`[Wordlist Engine] ✓ 검증 완료: 무작위 생성 패턴 확인. 유출 DB와의 상관관계 없음`);
  }

  const score = scoreFromSeconds(grade);

  const engineResult = {
    grade,
    score,
    prob,
    rank:         matchResult.rank,
    isGenerated,
    matchFound:   matchResult.found,  // 템플릿 Reuse Risk 분기용 (수정)
    pwLen,
    algorithm,
    hardware,
    crackSec,
    gradeLabel:   crackLabel,
    attackVector: `Credential Stuffing | Multi-Signal Risk Analysis`,
    cryptoAnalysis: `Matching: ${matchResult.found ? 'FOUND' : 'CLEAN'} | ReuseProb: ${prob}% | Resistance: ${crackLabel}`,
    penalties,
    simulationLogs: logs,
  };

  return generateReport('credential_stuffing', engineResult);
};

module.exports = { id: 'credential_stuffing', analyze };