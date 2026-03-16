/**
 * ShieldBox.io - Dictionary Attack Engine
 * [위치] server/engines/attacks/dictionary.js
 *
 * [수정 사항]
 * 1. [BUG-04] data.wordlistSize를 수신하여 calcDictionaryCrackTime에 전달
 *    - 기존: 20,000 하드코딩 → 수정: UI 설정값 사용 (기본값 20,000 유지)
 * 2. 터미널 로그와 리포트 Evidence의 "Wordlist Size" 수치를
 *    실제 사용된 값으로 동기화 (하드코딩 "20,000+" 문자열 제거)
 * 3. [LOGIC FIX] matchFound=false일 때 등급 산정 기준 변경
 *    - 기존: wordlistSize 기반 crackSec으로 등급 산정
 *      → 문제: 사전에 없는 16자 argon2id도 D등급 ("사전 10000개 대입 = 200초")
 *      → 실제로는 사전 전부 실패 후 brute_force로 전환 → 수천억 년 소요
 *    - 수정: matchFound=false이면 brute_force crackSec(pwLen 기반)으로 재산정
 *      → "사전 공격이 실패했을 때 이어지는 공격의 실질 위협"을 등급에 반영
 *    - matchFound=true는 현재 그대로 유지
 *      → 사전에 있는 암호: 사전 대입 시간 = 실제 위협이므로 정확
 */

const { isInWordlist } = require('../../data/wordlist');
const {
  gradeFromSeconds,
  scoreFromSeconds,
  formatSeconds,
  calcDictionaryCrackTime,
  calcCrackTime,
  GRADE_ORDER,
} = require('../../core_logic/attackCore');
const { generateReport } = require('../../data/attackReportTemplates');

const analyze = (data) => {
  const { shieldConfig, pwLen, hardware, password, wordlistSize } = data;
  const algorithm = shieldConfig.algorithm;

  // [BUG-04] UI에서 설정한 wordlistSize를 사용, 미전달 시 기본값 20,000
  const effectiveWordlistSize = wordlistSize || 20000;

  // 1. [Process] Visual Logs for Terminal
  const logs = [
    `[Dictionary Attack] Engine 가동: 지능형 패턴 분석 및 구조적 Entropy 스캔...`,
    `[Dictionary Attack] Wordlist 크기: ${effectiveWordlistSize.toLocaleString()}개 핵심 패턴 로드 완료`,
  ];

  // 2. [Logic] Wordlist 대조를 Physics 계산보다 먼저 수행
  // matchFound 결과에 따라 crackSec 산정 기준이 달라지기 때문
  const matchResult = password ? isInWordlist(password) : { found: false };

  // 3. [Physics] 실질 위협 기준 crackSec 산정
  // [LOGIC FIX]
  // matchFound=true  → 사전 대입 시간 = 실제로 뚫리는 시간 → 현재 방식 유지
  // matchFound=false → 사전 전부 실패 → brute_force 전환 시 소요 시간이 실질 위협
  //                    wordlistSize 기반 200초가 아닌 pwLen 기반 brute_force crackSec 사용
  let crackSec;
  if (matchResult.found) {
    crackSec = calcDictionaryCrackTime(algorithm, shieldConfig, hardware, effectiveWordlistSize);
  } else {
    crackSec = calcCrackTime(pwLen, algorithm, shieldConfig, hardware, 'brute_force');
  }
  const crackLabel = formatSeconds(crackSec);

  // 4. [Judgment] 하이브리드 보안 판정
  let { grade, penalties } = gradeFromSeconds(crackSec, algorithm, pwLen, shieldConfig);

  if (matchResult.found) {
    logs.push(`[Dictionary Attack] ⚠ Pattern 식별: '${matchResult.word}' (Method: ${matchResult.method})`);

    // 패턴 노출 시 물리적 시간과 무관하게 최대 B등급으로 Cap 적용
    const currentIdx = GRADE_ORDER.indexOf(grade);
    if (currentIdx > 3) grade = 'B';

    penalties.push(`치명적 패턴 노출: '${matchResult.word}' 단어가 사전 DB에서 발견되었습니다.`);
    penalties.push(`구조적 결함: 예측 가능한 Plaintext는 알고리즘의 물리적 보호 성능을 무력화합니다.`);
  } else {
    logs.push(`[Dictionary Attack] ✓ 분석 완료: 알려진 Dictionary Pattern이 발견되지 않은 안전한 조합입니다.`);
  }

  logs.push(`[Dictionary Attack] 물리적 저항력: 현재 설정으로 해독까지 약 ${crackLabel} 소요 예상`);

  // 5. [Synthesis] 표준 리포트 데이터 구성
  const score = scoreFromSeconds(grade);

  const engineResult = {
    grade,
    score,
    pwLen,
    algorithm,
    hardware,
    password,
    crackSec,
    gradeLabel:   crackLabel,
    matchFound:   matchResult.found,
    matchWord:    matchResult.word   || 'N/A',
    matchMethod:  matchResult.method || 'N/A',
    attackVector: `Dictionary Attack | ${hardware}`,
    // [BUG-04] Evidence의 Wordlist Size를 실제 사용값으로 표시
    wordlistSize: effectiveWordlistSize,
    cryptoAnalysis: `Pattern Matching: ${matchResult.found ? 'FOUND' : 'CLEAN'} | Algorithm: ${algorithm.toUpperCase()} | Words: ${effectiveWordlistSize.toLocaleString()}`,
    penalties,
    simulationLogs: logs,
  };

  return generateReport('dictionary', engineResult);
};

module.exports = { id: 'dictionary', analyze };