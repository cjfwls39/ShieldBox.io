/**
 * ShieldBox.io - Brute Force Attack Engine (Standard Schema Applied)
 * [위치] server/engines/attacks/bruteForce.js
 * [수정 사항]
 * 1. 표준 리포트 스키마에 맞춘 결과 객체 생성 및 generateReport 연동
 * 2. Search Space(94^L) 및 Entropy 수치를 정밀하게 계산하여 Evidence로 전달
 * 3. 6자 이하 실시간 파훼 성공 시 Narrative를 '즉시 침투' 시나리오로 변경
 */

const {
  calcCrackTime,
  gradeFromSeconds,
  scoreFromSeconds,
  verifyHash,
  canActuallyVerify,
  formatSeconds,
  GRADE_ORDER
} = require('../../core_logic/attackCore'); 
const { generateReport } = require('../../data/attackReportTemplates');

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

/**
 * 실시간 해시 대입 시뮬레이션 (짧은 암호 전용 - 시각적 증명용)
 */
const actualBruteForce = (targetHash, algorithm, config, maxAttempts = 500_000) => {
  let attempts = 0;
  for (let len = 1; len <= 6; len++) {
    const indices = new Array(len).fill(0);
    while (true) {
      const candidate = indices.map(i => CHARSET[i]).join('');
      attempts++;
      
      if (verifyHash(candidate, targetHash, algorithm, config)) {
        return { found: true, password: candidate, attempts };
      }
      
      if (attempts >= maxAttempts) return { found: false, attempts, reason: 'limit_reached' };
      
      let pos = len - 1;
      while (pos >= 0) {
        indices[pos]++;
        if (indices[pos] < CHARSET.length) break;
        indices[pos] = 0;
        pos--;
      }
      if (pos < 0) break;
    }
  }
  return { found: false, attempts, exhausted: true };
};

/**
 * 메인 분석 로직
 */
const analyze = (data) => {
  const { shieldConfig, pwLen, hardware, threads, targetHash } = data;
  const algorithm = shieldConfig.algorithm;

  // 1. [Process] Visual Logs for Terminal
  const logs = [
    `[Brute Force] Vector 가동: ${hardware} 기반 전수 조사 시뮬레이션 시작`,
    `[Brute Force] Search Space 분석: 94^${pwLen} 조합 (Entropy 측정 중...)`
  ];

  // 2. [Physics] 알고리즘의 Work Factor를 반영한 Crack Time 계산
  const crackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'brute_force');
  const crackLabel = formatSeconds(crackSec);

  // 3. [Simulation] 6자 이하 실시간 충돌 테스트
  const doActual = canActuallyVerify(algorithm, pwLen) && targetHash;
  let actualResult = null;
  if (doActual) {
    logs.push(`[Brute Force] 실시간 충돌 테스트: ${pwLen}자 Short Password에 대한 고속 루프 가동...`);
    actualResult = actualBruteForce(targetHash, algorithm, shieldConfig);
  }

  // 4. [Judgment] 하이브리드 보안 판정 및 패널티 부여
  let { grade, penalties } = gradeFromSeconds(crackSec, algorithm, pwLen, shieldConfig);

  if (doActual && actualResult?.found) {
    grade = 'F';
    logs.push(`[Brute Force] 🚨 Simulation 성공: ${actualResult.attempts.toLocaleString()}회 시도 후 Plaintext 식별`);
    penalties.push(`실시간 파훼 성공: 현대적 하드웨어로 즉시 해독 가능한 초단문 구조입니다.`);
  } else {
    // 8자 미만은 Entropy Deficiency로 인해 최대 D등급으로 Cap 적용
    if (pwLen < 8) {
      const currentIdx = GRADE_ORDER.indexOf(grade);
      if (currentIdx > 1) grade = 'D'; // D(1) 이상 등급은 D로 하향
      logs.push(`[Brute Force] ⚠ Entropy 경고: 길이 부족으로 인한 보안 등급 강제 하향`);
      penalties.push(`Entropy Deficiency: 8자 미만의 암호는 지수적 장벽을 형성하기 어렵습니다.`);
    }
    logs.push(`[Brute Force] 분석 완료: 예상 해독 소요 시간 - ${crackLabel}`);
  }

  // 5. [Synthesis] 표준 리포트 데이터 구성 및 팩토리 호출
  const score = scoreFromSeconds(grade);
  
  const engineResult = {
    grade,
    score,
    pwLen,
    algorithm,
    hardware,
    crackSec,
    gradeLabel: crackLabel, // 템플릿의 narrative와 evidence에서 사용
    cryptoAnalysis: `Algorithm: ${algorithm.toUpperCase()} | Hash Rate: ${threads} Threads Analysis`,
    penalties,
    simulationLogs: logs
  };

  // 팩토리를 통해 인과관계와 비유가 담긴 리포트 생성
  const finalReport = generateReport('brute_force', engineResult);

  return finalReport;
};

module.exports = { id: 'brute_force', analyze };