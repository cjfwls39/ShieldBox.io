/**
 * ShieldBox.io - Rainbow Table Attack Engine (Standard Schema Applied)
 * [위치] server/engines/attacks/rainbow_table.js
 * [수정 사항]
 * 1. 표준 리포트 스키마에 맞춘 결과 객체 생성 및 generateReport 연동
 * 2. Salt의 유무에 따른 TMTO(Time-Memory Trade-Off) 리스크 정밀 진단
 * 3. 결정론적 해싱(Deterministic Hashing)의 위험성을 설명하는 Forensic 데이터 구성
 */

const {
  ALWAYS_HAS_SALT,
  parseSaltFromHash,
  calcCrackTime,
  gradeFromSeconds,
  scoreFromSeconds,
  formatSeconds,
  GRADE_ORDER
} = require('../../core_logic/attackCore'); 
const { generateReport } = require('../../data/attackReportTemplates');

const analyze = (data) => {
  const { shieldConfig, hardware, targetHash, pwLen = 8 } = data;
  const algorithm = shieldConfig.algorithm;

  // 1. [Process] Visual Logs for Terminal
  const logs = [
    `[Rainbow Table] 해시 아키텍처 스캔: ${algorithm.toUpperCase()} 데이터 구조 분석...`,
    `[Rainbow Table] Salt 엔트로피 검사: 해시 데이터 내 무작위성(Salt) 식별 시도...`
  ];

  // 2. [Logic] Salt 존재 여부 정밀 판독
  const { hasSalt } = parseSaltFromHash(targetHash, algorithm);
  const alwaysSalt    = ALWAYS_HAS_SALT.has(algorithm);
  // targetHash가 없어도 shieldConfig.useSalt 설정값을 추가 참조 (수정)
  const configSalt    = shieldConfig.useSalt !== false;
  const effectiveSalt = alwaysSalt || hasSalt || configSalt;

  let grade, crackLabel, penalties = [];

  if (!effectiveSalt) {
    // [Case A] Salt가 없는 취약한 상태 (Deterministic Hashing)
    logs.push(`[Rainbow Table] ⚠ 보안 결함: Salt 미검출. Precomputed Table 대조 모드 가동`);

    // Salt가 없어도 알고리즘의 연산 부하가 높으면 대조 시간이 소요됨 (TMTO 분석)
    const crackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'rainbow_table');
    crackLabel = formatSeconds(crackSec);
    
    const judge = gradeFromSeconds(crackSec, algorithm, pwLen, shieldConfig);
    grade = judge.grade;
    
    // Salt 부재라는 치명적 결함으로 인해 아무리 시간이 걸려도 최대 D등급으로 Cap 적용
    const currentIdx = GRADE_ORDER.indexOf(grade);
    if (currentIdx > 1) grade = 'D';

    logs.push(`[Rainbow Table] 분석 결과: 구조적 결함으로 인해 약 ${crackLabel} 내 노출 가능성 식별`);
    penalties.push("치명적 보안 결함: Salt 부재로 인해 사전 계산된 Rainbow Table 공격에 무방비함");
    penalties.push("설계적 취약점: 결정론적 해싱은 테이블 조회 한 번으로 Plaintext가 노출될 수 있습니다.");

  } else {
    // [Case B] Salt가 존재하여 공격이 차단된 상태
    logs.push(`[Rainbow Table] ✓ 방어선 확인: 고유 Salt 식별됨. 레인보우 테이블 조회가 불가능합니다.`);
    
    // Salt가 있으면 실시간 Brute Force로 전환하여 해독 시간 산출
    const crackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'brute_force');
    const judgeResult = gradeFromSeconds(crackSec, algorithm, pwLen, shieldConfig);
    
    grade = judgeResult.grade;
    penalties = judgeResult.penalties;
    crackLabel = formatSeconds(crackSec);
    
    logs.push(`[Rainbow Table] 전략 변경: Precomputed 공격 실패로 인해 전수 조사 시나리오로 전환`);
  }

  // 3. [Synthesis] 표준 리포트 데이터 구성 및 팩토리 호출
  const score = scoreFromSeconds(grade);
  
  const engineResult = {
    grade,
    score,
    pwLen,
    algorithm,
    hardware,
    hasSalt:    effectiveSalt,          // [불일치1] 템플릿이 res.hasSalt로 직접 참조
    crackLabel,                          // 템플릿에서 결과 표시용
    gradeLabel: crackLabel,              // [불일치4] 템플릿이 res.gradeLabel로 참조하는 케이스 대응
    cryptoAnalysis: `Salt Protection: ${effectiveSalt ? 'YES' : 'NO'} | Algorithm: ${algorithm.toUpperCase()}`,
    penalties,
    simulationLogs: logs
  };

  // 팩토리를 통해 인과관계와 비유가 담긴 표준 리포트 생성
  const finalReport = generateReport('rainbow_table', engineResult);

  return finalReport;
};

module.exports = { id: 'rainbow_table', analyze };