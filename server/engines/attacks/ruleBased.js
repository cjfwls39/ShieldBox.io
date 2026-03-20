/**
 * ShieldBox.io - Rule-Based Attack Engine (Standard Schema Applied)
 * [위치] server/engines/attacks/rule_based.js
 */

const { isInWordlist } = require('../../data/wordlist');
const {
  calcCrackTime,
  gradeFromSeconds,
  scoreFromSeconds,
  formatSeconds,
  GRADE_ORDER
} = require('../../core_logic/attackCore'); 
const { generateReport } = require('../../data/attackReportTemplates');
const cfg = require('../../config/shield-config');

const analyze = (data) => {
  const { shieldConfig, pwLen, hardware, password } = data;
  const algorithm = shieldConfig.algorithm;

  // 1. [Process] Visual Logs for Terminal
  const logs = [
    `[Rule-Based Attack] Heuristics 엔진 가동: 50,000개 이상의 변형 규칙 로드 중...`,
    `[Rule-Based Attack] Reverse Mapping: Leet Speak 및 Common Suffix 역추적 시작...`
  ];

  // 2. [Logic] Wordlist 엔진을 통한 규칙 분석 (Pattern Recovery)
  // wordlist.js의 isInWordlist는 내부적으로 leet restore와 suffix peeling을 수행함
  const matchResult = password ? isInWordlist(password) : { found: false };
  
  // 규칙 기반 공격은 일반 전수 조사보다 훨씬 효율적임
  const baseCrackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'brute_force');
  const mul = cfg.attacks.ruleBased.crackTimeMultiplier;
  const ruleCrackSec = matchResult.found ? baseCrackSec * mul.match : baseCrackSec * mul.noMatch;
  const crackLabel = formatSeconds(ruleCrackSec);

  // 3. [Judgment] 하이브리드 보안 판정
  let { grade, penalties } = gradeFromSeconds(ruleCrackSec, algorithm, pwLen, shieldConfig);

  if (matchResult.found && matchResult.method !== 'Direct') {
    logs.push(`[Rule-Based Attack] ⚠ 규칙 탐지: '${matchResult.word}'의 변형 패턴('${matchResult.method}') 식별`);
    
    // 단순 변형으로 길이를 늘린 경우 보안 등급을 최대 B등급으로 제한
    const currentIdx = GRADE_ORDER.indexOf(grade);
    if (currentIdx > 3) grade = 'B';
    
    penalties.push(`Security Illusion: 복잡해 보이는 기호들은 해커의 Rule-Based 엔진에 의해 무력화되었습니다.`);
    penalties.push(`Pattern Recovery: 암호의 원형인 '${matchResult.word}' 단어가 성공적으로 복구되었습니다.`);
  } else {
    logs.push(`[Rule-Based Attack] ✓ 분석 완료: 전형적인 심리적 변형 규칙이 발견되지 않았습니다.`);
  }

  // 4. [Synthesis] 표준 리포트 데이터 구성 및 팩토리 호출
  const score = scoreFromSeconds(grade);
  
  const engineResult = {
    grade,
    score,
    pwLen,
    algorithm,
    hardware,
    crackSec: ruleCrackSec,
    gradeLabel: crackLabel,
    matchFound:   matchResult.found,           // 템플릿 서사 분기용 (수정)
    matchWord:    matchResult.word   || 'N/A', // 탐지된 원형 단어
    matchMethod:  matchResult.method || 'N/A', // 탐지 방법
    recoveryRate: matchResult.found ? cfg.attacks.ruleBased.recoveryRate.found : cfg.attacks.ruleBased.recoveryRate.notFound,
    cryptoAnalysis: `Method: ${matchResult.method || 'None'} | Recovery: ${matchResult.found ? 'SUCCESS' : 'FAILED'}`,
    penalties,
    simulationLogs: logs
  };

  return generateReport('rule_based', engineResult);
};

module.exports = { id: 'rule_based', analyze };