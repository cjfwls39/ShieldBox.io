/**
 * ShieldBox.io - Side-Channel Attack Engine
 * [위치] server/engines/attacks/sideChannel.js
 *
 * [수정 사항]
 * 1. [BUG-05] score 계산을 연속값((1-pSuccess)×100)에서
 *    scoreFromSeconds(grade) 고정값으로 변경하여 타 엔진과 통일
 *    - 동일 D등급: 기존 0~29점 → 수정 후 30점 고정
 * 2. [외부검수] Argon2id 전용 서사 분기 추가
 *    - Constant-Time 설계로 측정 자체가 불가능한 이유를
 *      터미널 로그와 패널티 메시지에 명확히 표현
 */

const cfg             = require('../../config/shield-config');
const { scoreFromSeconds } = require('../../core_logic/attackCore');
const { generateReport }   = require('../../data/attackReportTemplates');

// ─── Abramowitz & Stegun 정밀 오차 함수(erf) ─────────────────────────────
const erf = (x) => {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741,
        a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t
            * Math.exp(-absX * absX);
  return sign * y;
};

const normalCDF = (z) => 0.5 * (1 + erf(z / Math.sqrt(2)));

// ─── 메인 분석 로직 ──────────────────────────────────────────────────────
const analyze = (data) => {
  const { shieldConfig, hardware, intensity = 5 } = data;
  const algorithm = shieldConfig.algorithm;

  // 1. [Data Fetching] 외부 벤치마크 데이터셋 연동
  const algoProfile = cfg.timingProfiles.algorithms[algorithm]
                   || cfg.timingProfiles.algorithms['default'];
  const hwProfile   = cfg.timingProfiles.hardware[hardware]
                   || cfg.timingProfiles.hardware['pc'];

  const deltaT     = algoProfile.baseDeltaT;
  const sigmaNoise = hwProfile.sigmaNoise;
  const N          = Math.pow(10, (intensity / 2) + cfg.attacks.sideChannel.sampleExponentBase); // 샘플 수

  // 2. [Mathematics] 가우시안 통계 확률 모델링
  const SNR      = deltaT / sigmaNoise;
  const Z        = SNR * Math.sqrt(N);
  const pSuccess = normalCDF(Z);
  const probPercent = parseFloat((pSuccess * 100).toFixed(2)); // 숫자 타입 (수정: 문자열→숫자, templates의 < 10 비교 정상 작동)

  // ── [외부검수] Argon2id 전용 분기 ────────────────────────────────────
  // Argon2id는 데이터 독립적 메모리 접근(DIAM) 설계로 Δt ≈ 0.0001ns.
  // SNR이 사실상 0에 수렴하여 아무리 많은 샘플을 측정해도 유효 신호를
  // 추출할 수 없습니다. 이 경우 수학적 분석보다 설계 원리 설명이 중요합니다.
  const isArgon2id      = algorithm === 'argon2id';
  const isConstantTime  = algoProfile.vulnerability_type === 'Constant-Time Enforced';

  // 3. [Process] Visual Logs for Terminal
  const logs = [
    `[Signal Analysis] 데이터 로드: ${algoProfile.vulnerability_type} 프로파일 적용`,
    `[Signal Analysis] Δt: ${deltaT}ns, Noise Floor: ${sigmaNoise}ns, Samples: ${Math.floor(N).toLocaleString()}`,
  ];

  if (isArgon2id) {
    // [외부검수] Argon2id 전용 설명 서사
    logs.push(`[Signal Analysis] Argon2id 탐지: Data-Independent Memory Access(DIAM) 설계 확인`);
    logs.push(`[Signal Analysis] 측정 불가 판정: Δt(${deltaT}ns) ≪ Noise Floor(${sigmaNoise}ns) → SNR=${SNR.toExponential(2)}`);
    logs.push(`[Signal Analysis] 결론: 상수 시간 연산으로 유효 타이밍 신호 추출 수학적 불가능`);
  } else {
    logs.push(`[Signal Analysis] 가우시안 확률 밀도 분석: SNR(${SNR.toFixed(3)}) 기반 Bit 추론 중...`);
  }

  // 4. [Judgment] 확률 기반 등급 판정
  let grade, penalties = [];

  const gt = cfg.attacks.sideChannel.gradeThreshold;
  if (pSuccess < gt.S)       grade = 'S';
  else if (pSuccess < gt.A)  grade = 'A';
  else if (pSuccess < gt.B)  grade = 'B';
  else if (pSuccess < gt.C)  grade = 'C';
  else                       grade = 'D';

  if (isConstantTime) {
    // [외부검수] Constant-Time 알고리즘은 S등급 확정 + 안전 근거 명시
    grade = 'S';
    // 패널티 없음 — 대신 강점 설명을 로그에 포함 (위 logs에 이미 추가됨)
  } else if (grade !== 'S') {
    penalties.push(
      `Implementation Leak: 입력값에 따라 실행 시간이 변하는 Non-Constant Time 특성 식별`
    );
    penalties.push(`Side-Channel Vulnerability: ${algoProfile.description}`);
  }

  // 5. [Synthesis] 표준 리포트 데이터 구성 및 팩토리 호출
  // [BUG-05] 기존: Math.floor((1 - pSuccess) * 100) — 연속 계산값 (불일치)
  //          수정: scoreFromSeconds(grade) — 타 엔진과 동일한 고정 매핑값 사용
  const score = scoreFromSeconds(grade);

  const engineResult = {
    grade,
    score,           // [BUG-05] 수정된 점수
    isConstantTime,  // 템플릿 이 판단용
    pSuccess,        // 0~1 소수값
    vulnType:        algoProfile.vulnerability_type, // 템플릿 분기용 별도 필드 (vulnerability는 generateReport가 덮어씀)
    deltaT,
    SNR:             SNR.toFixed(3),
    N:               Math.floor(N),
    probPercent,
    algorithm,
    vulnerability:   algoProfile.vulnerability_type,
    attackVector:    `Side-Channel | Statistical Hypothesis Testing | ${hardware}`,
    cryptoAnalysis:  `Δt: ${deltaT}ns | SNR: ${SNR.toFixed(3)} | Samples: ${Math.floor(N).toLocaleString()}`,
    penalties,
    simulationLogs:  logs,
  };

  return generateReport('side_channel', engineResult);
};

module.exports = { id: 'side_channel', analyze };