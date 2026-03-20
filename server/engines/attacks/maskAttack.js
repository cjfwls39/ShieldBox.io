/**
 * ShieldBox.io - Mask Attack Engine (Standard Schema Applied)
 * [위치] server/engines/attacks/mask_attack.js
 * [수정 사항]
 * 1. 표준 리포트 스키마에 맞춘 결과 객체 생성 및 generateReport 연동
 * 2. Password Structure 분석을 통한 Mask Intensity(패턴 강도) 산출
 * 3. Search Space Compression(탐색 범위 압축률)을 계산하여 Evidence 데이터로 구성
 */

const {
  calcCrackTime,
  gradeFromSeconds,
  scoreFromSeconds,
  formatSeconds,
  GRADE_ORDER
} = require('../../core_logic/attackCore'); 
const { generateReport } = require('../../data/attackReportTemplates');
const cfg = require('../../config/shield-config');

/**
 * 암호의 Mask(구조)를 분석하여 정형화 점수 산출
 */
const analyzeMaskIntensity = (password) => {
  if (!password) return 0;
  
  let score = 0;
  // Rule 1: 첫 글자가 대문자인가? (+2)
  if (/^[A-Z]/.test(password)) score += 2;
  // Rule 2: 마지막이 숫자나 특수문자인가? (+2)
  if (/[0-9!@#$%^&*()]$/.test(password)) score += 2;
  // Rule 3: 숫자가 연속되거나 특정 위치에 고정되어 있는가? (+2)
  if (/[0-9]{2,}/.test(password)) score += 2;
  // Rule 4: 대문자가 오직 첫 글자에만 존재하는가? (+2)
  const upperCount = (password.match(/[A-Z]/g) || []).length;
  if (upperCount === 1 && /^[A-Z]/.test(password)) score += 2;
  // Rule 5: 특수문자가 1개뿐이며 특정 위치인가? (+2)
  const symbolCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
  if (symbolCount === 1) score += 2;

  return Math.min(10, score);
};

const analyze = (data) => {
  const { shieldConfig, pwLen, hardware, password } = data;
  const algorithm = shieldConfig.algorithm;

  // 1. [Process] Visual Logs for Terminal
  const logs = [
    `[Mask Attack] 암호 Structure 분석 시작: 정형화된 패턴 탐색 중...`,
    `[Mask Attack] Character Placement 분석: 대문자/숫자/특수문자 고정 위치 스캔...`
  ];

  // 2. [Logic] Mask Intensity 및 Space Reduction 계산
  const intensity = analyzeMaskIntensity(password);
  
  // 정형화 점수가 높을수록 탐색 공간이 기하급수적으로 압축됨을 시뮬레이션
  const rr = cfg.attacks.maskAttack.reductionRate;
  const reductionRate = intensity > cfg.attacks.maskAttack.gradeCap.threshold ? rr.high : (intensity > 4 ? rr.medium : rr.low);
  
  // Mask 공격은 일반 Brute Force보다 훨씬 효율적임 (압축률 반영)
  const baseCrackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'brute_force');
  const maskCrackSec = baseCrackSec * (1 - (reductionRate / 100));
  const crackLabel = formatSeconds(maskCrackSec);

  // 3. [Judgment] 하이브리드 보안 판정
  let { grade, penalties } = gradeFromSeconds(maskCrackSec, algorithm, pwLen, shieldConfig);

  if (intensity >= cfg.attacks.maskAttack.gradeCap.threshold) {
    logs.push(`[Mask Attack] ⚠ 취약점 감지: 매우 정형화된 Mask Structure 식별 (Intensity: ${intensity})`);
    
    // 구조적 취약성이 높으면 알고리즘 성능과 무관하게 최대 C등급으로 Cap 적용
    const currentIdx = GRADE_ORDER.indexOf(grade);
    if (currentIdx > 2) grade = 'C';
    
    penalties.push(`Structural Risk: 전형적인 암호 생성 규칙(첫 글자 대문자 등)이 공격자에 의해 간파되었습니다.`);
    penalties.push(`Search Space Compression: Mask 적용 시 탐색 범위가 약 ${reductionRate}% 압축됩니다.`);
  } else {
    logs.push(`[Mask Attack] ✓ 분석 완료: 무작위성이 높은 구조로 식별되어 Mask 공격 효율이 낮습니다.`);
  }

  // 4. [Synthesis] 표준 리포트 데이터 구성 및 팩토리 호출
  const score = scoreFromSeconds(grade);
  
  const engineResult = {
    grade,
    score,
    pwLen,
    algorithm,
    hardware,
    intensity,                           // [불일치3] 템플릿이 res.intensity로 직접 참조
    reductionRate,                       // [불일치3] 템플릿이 res.reductionRate로 직접 참조
    crackSec: maskCrackSec,
    gradeLabel: crackLabel,
    cryptoAnalysis: `Pattern Intensity: Level ${intensity} | Reduction: ${reductionRate}%`,
    penalties,
    simulationLogs: logs
  };

  // 팩토리를 통해 인과관계와 비유가 담긴 표준 리포트 생성
  const finalReport = generateReport('mask_attack', engineResult);

  return finalReport;
};

module.exports = { id: 'mask_attack', analyze };