/**
 * Side-Channel Attack Report Module
 * [위치] server/data/reportTemplates/sideChannelTemplate.js
 *
 * [분기 설계]
 * 사이드 채널 공격의 취약점은 암호 내용이 아닌 "알고리즘의 설계 특성"으로 결정.
 * pSuccess는 argon2id 외 모든 알고리즘에서 1.0으로 수렴하여 분기 불가.
 * vulnType(algoProfile.vulnerability_type)이 알고리즘별 고유 특성을 정확히 담고 있어 분기에 적합.
 *
 * CASE 1: isConstantTime                                → Constant-Time 완벽 방어 (argon2id)
 * CASE 2: vulnType === 'Internal State Leak'            → 내부 상태 유출 (bcrypt, scrypt)
 * CASE 3: vulnType?.includes('Early Return')            → Early Return 취약 (md5, sha256, sha512)
 * CASE 4: else                                          → 기타 타이밍 취약
 */

module.exports = (res) => {
  const { isConstantTime, vulnType, pSuccess, algorithm, deltaT, SNR, N, grade } = res;

  const pSuccessPercent = pSuccess != null ? (pSuccess * 100).toFixed(1) : '—';
  const snrDisplay      = SNR || '—';
  const deltaTDisplay   = deltaT || '—';
  const samplesDisplay  = N ? N.toLocaleString() : '—';

  // ─── [CASE 1] Constant-Time 완벽 방어 (argon2id 등) ─────────────────
  if (isConstantTime) {
    return {
      summary: "물리적 신호 차단 완료: 설계 단계부터 타이밍 공격이 원천적으로 봉쇄되었습니다.",
      attackVector: "Side-Channel | Constant-Time Verification",
      cryptoAnalysis: `Exempt from timing attacks. ${algorithm.toUpperCase()} implements data-independent execution flow. Delta-t approaches 0ns regardless of input. Timing analysis yields no exploitable signal.`,
      metaphor: {
        title: "🔇 진공실 속에 설치된 무음 금고",
        description: "이 알고리즘은 연산 중에 어떤 신호도 외부로 누출하지 않습니다. 해커가 아무리 정밀한 측정 장비를 들이대도 내부에서 무슨 작업이 일어나는지 전혀 유추할 수 없는 완전한 침묵의 보안입니다."
      },
      vulnerability: {
        type: "Physical Signal Integrity",
        reason: "입력값에 상관없이 연산 시간이 항상 일정하여, 물리적 측정을 통한 정보 유추가 이론적으로 불가능합니다."
      },
      evidence: [
        { label: 'TIMING PROFILE', value: 'CONSTANT',            unit: '' },
        { label: 'LEAKAGE PROB',   value: '< 0.01',              unit: '%' },
        { label: 'TIME VARIANCE',  value: '≈ 0',                 unit: 'ns' },
        { label: 'SECURITY TIER',  value: 'Hardware-Resistant',  unit: '' },
      ],
      narrative: [
        { step: "01", title: "알고리즘 설계 검수", desc: `${algorithm.toUpperCase()}은 데이터 독립적 메모리 접근(DIAM) 방식으로 설계되어, 어떤 입력값이 들어와도 연산 흐름이 동일합니다.` },
        { step: "02", title: "신호 측정 무력화", desc: `해커가 ${samplesDisplay}회의 반복 측정을 수행했으나, 유의미한 시간 편차(Δt)가 감지되지 않아 통계적 분석이 불가능합니다.` },
        { step: "03", title: "물리 계층 완전 방어", desc: "암호의 복잡도와 무관하게, 알고리즘 자체의 설계적 특성이 모든 사이드 채널 공격을 근본적으로 차단합니다." }
      ],
      mitigation: [
        { step: "01", title: "알고리즘 설정 유지", desc: "물리 계층 보안의 정점에 도달해 있습니다. 현재의 알고리즘 설정을 그대로 유지하십시오." },
        { step: "02", title: "하드웨어 환경 관리", desc: `${algorithm.toUpperCase()}은 물리적 접근이 가능한 하드웨어 환경에서도 강력한 저항력을 발휘합니다.` },
        { step: "03", title: "표준으로 채택", desc: "이 수준의 사이드 채널 내성을 가진 알고리즘 선택 기준을 서비스 전반의 보안 표준으로 채택하십시오." }
      ]
    };
  }

  // ─── [CASE 2] Internal State Leak (bcrypt, scrypt) ───────────────────
  if (vulnType === 'Internal State Leak') {
    return {
      summary: "내부 상태 유출 감지: 알고리즘의 내부 연산 과정에서 미세한 신호가 새어나옵니다.",
      attackVector: "Side-Channel | Internal State Leakage Analysis",
      cryptoAnalysis: `${algorithm.toUpperCase()} exhibits Internal State Leak pattern. Delta-t: ${deltaTDisplay}ns. SNR: ${snrDisplay}. Statistical bit-recovery probability: ${pSuccessPercent}% after ${samplesDisplay} measurements.`,
      metaphor: {
        title: "🩺 내부 진동을 감지하는 청진기",
        description: "알고리즘이 동작하는 동안 내부 상태 전환에서 발생하는 미세한 진동이 외부로 새어나오고 있습니다. 전문 장비로 이 진동을 오래 측정하면 내부 구조의 단서를 얻을 수 있습니다."
      },
      vulnerability: {
        type: "Internal State Timing Leak",
        reason: `${algorithm.toUpperCase()}의 내부 연산 과정에서 입력값에 따라 미세한 실행 시간 차이가 발생합니다. 반복적인 통계 분석을 통해 암호의 내부 구조를 부분적으로 추론할 수 있습니다.`
      },
      evidence: [
        { label: 'TIMING PROFILE', value: 'INTERNAL LEAK',       unit: '' },
        { label: 'DELTA-T',        value: deltaTDisplay,          unit: 'ns' },
        { label: 'SNR',            value: snrDisplay,             unit: 'ratio' },
        { label: 'SUCCESS PROB',   value: pSuccessPercent,        unit: '%' },
      ],
      narrative: [
        { step: "01", title: "신호 패턴 식별", desc: `${algorithm.toUpperCase()}의 내부 상태 전환 메커니즘에서 ${deltaTDisplay}ns 단위의 시간 편차가 일관되게 발생하고 있습니다.` },
        { step: "02", title: "통계 분석 수행", desc: `${samplesDisplay}회의 반복 측정을 통해 노이즈를 제거한 결과, SNR ${snrDisplay} 수준의 유효 신호가 확보되어 ${pSuccessPercent}% 확률로 비트 추론이 가능합니다.` },
        { step: "03", title: "공격 시나리오 평가", desc: "Internal State Leak은 직접적인 암호 복구보다는 알고리즘의 내부 구조를 파악하는 데 활용됩니다. 장기적으로 반복 측정이 가능한 환경에서 위험이 증가합니다." }
      ],
      mitigation: [
        { step: "01", title: "Argon2id로 전환", desc: "Constant-Time 설계가 보장된 Argon2id로 전환하면 이 취약점을 근본적으로 제거할 수 있습니다." },
        { step: "02", title: "무작위 지연 추가", desc: "연산 단계에 무작위 지연(Jitter)을 삽입하면 공격자의 통계 분석을 방해하여 실용적인 공격 성공률을 크게 낮출 수 있습니다." },
        { step: "03", title: "물리 접근 제어", desc: "내부 상태 유출 공격은 반복적인 측정이 필요합니다. 서버에 대한 물리적 접근을 제한하고 이상 접근 패턴을 모니터링하십시오." }
      ]
    };
  }

  // ─── [CASE 3] Early Return 취약 (md5, sha256, sha512 등) ─────────────
  if (vulnType && vulnType.includes('Early Return')) {
    const isByteByByte = vulnType.includes('Byte-by-byte');
    return {
      summary: "Early Return 취약점: 비교 연산의 조기 종료가 암호 정보를 외부로 유출합니다.",
      attackVector: "Side-Channel | Early Return Timing Analysis",
      cryptoAnalysis: `${algorithm.toUpperCase()} exhibits '${vulnType}' vulnerability. Comparison terminates early on mismatch, causing measurable timing differences. Delta-t: ${deltaTDisplay}ns, SNR: ${snrDisplay}.`,
      metaphor: {
        title: "🔢 정답에 가까울수록 반응이 빨라지는 다이얼 자물쇠",
        description: `${isByteByByte ? '비교 연산이 첫 번째 불일치 바이트에서 즉시 종료되어' : '문자열 비교가 조기에 종료되어'} 맞는 글자 수에 따라 응답 시간이 달라집니다. 마치 다이얼 자물쇠가 정확한 숫자에서 멈추는 느낌을 주는 것과 같습니다.`
      },
      vulnerability: {
        type: `Early Return Timing Leak (${isByteByByte ? 'Byte-by-byte' : 'Standard'})`,
        reason: `${algorithm.toUpperCase()}의 해시 비교 로직이 불일치 발견 즉시 종료됩니다. 이로 인해 일치하는 바이트 수에 따라 ${deltaTDisplay}ns의 시간 차이가 발생하여 통계적 분석이 가능합니다.`
      },
      evidence: [
        { label: 'VULN TYPE',      value: 'Early Return',         unit: '' },
        { label: 'DELTA-T',        value: deltaTDisplay,          unit: 'ns' },
        { label: 'SNR',            value: snrDisplay,             unit: 'ratio' },
        { label: 'SUCCESS PROB',   value: pSuccessPercent,        unit: '%' },
      ],
      narrative: [
        { step: "01", title: "Early Return 패턴 감지", desc: `${algorithm.toUpperCase()}의 비교 연산이 ${isByteByByte ? '첫 번째 불일치 바이트에서 즉시 종료됩니다' : '불일치 발견 시 조기 종료됩니다'}. 이로 인해 ${deltaTDisplay}ns 단위의 일관된 시간 차이가 발생합니다.` },
        { step: "02", title: "통계적 신호 추출", desc: `${samplesDisplay}회 반복 측정을 통해 SNR ${snrDisplay} 수준의 신호를 확보했습니다. 이를 분석하면 ${pSuccessPercent}% 확률로 비트 단위 추론이 가능합니다.` },
        { step: "03", title: "공격 현실성 평가", desc: `Early Return 취약점은 ${algorithm.toUpperCase()}과 같은 빠른 해시 알고리즘에서 특히 위험합니다. 초당 수십억 번의 시도가 가능한 환경에서 신호 수집이 매우 용이합니다.` }
      ],
      mitigation: [
        { step: "01", title: "Argon2id로 즉시 전환", desc: "Constant-Time 비교를 보장하는 Argon2id로 전환하면 Early Return 취약점이 완전히 제거됩니다." },
        { step: "02", title: "Constant-Time 비교 라이브러리 사용", desc: "암호화 전용 라이브러리의 Constant-Time 비교 함수를 사용하여 구현 수준에서 취약점을 차단하십시오." },
        { step: "03", title: "고부하 알고리즘 선택", desc: "느린 해시 알고리즘(Bcrypt, scrypt 등)은 측정 신호 수집 속도를 늦춰 Early Return 공격의 실용성을 크게 낮출 수 있습니다." }
      ]
    };
  }

  // ─── [CASE 4] 기타 타이밍 취약 ───────────────────────────────────────
  return {
    summary: "타이밍 신호 유출 감지: 알고리즘 연산 과정에서 측정 가능한 시간 편차가 발생합니다.",
    attackVector: "Side-Channel | Generic Timing Leak Analysis",
    cryptoAnalysis: `${algorithm.toUpperCase()} exhibits timing variance. Delta-t: ${deltaTDisplay}ns, SNR: ${snrDisplay}. Statistical analysis over ${samplesDisplay} samples yields ${pSuccessPercent}% bit-recovery probability.`,
    metaphor: {
      title: "📡 신호를 흘리는 안테나",
      description: "알고리즘이 동작하는 동안 의도치 않게 정보를 담은 신호를 외부로 방출하고 있습니다. 이 신호를 오래 수집하고 분석하면 암호의 내부 구조를 파악할 수 있습니다."
    },
    vulnerability: {
      type: "Generic Timing Leakage",
      reason: `${algorithm.toUpperCase()}의 실행 과정에서 입력값에 따른 시간 편차(${deltaTDisplay}ns)가 발생합니다. 충분한 측정 샘플이 확보되면 통계적 비트 추론이 가능합니다.`
    },
    evidence: [
      { label: 'TIMING PROFILE', value: 'VARIABLE',              unit: '' },
      { label: 'DELTA-T',        value: deltaTDisplay,            unit: 'ns' },
      { label: 'SNR',            value: snrDisplay,               unit: 'ratio' },
      { label: 'SUCCESS PROB',   value: pSuccessPercent,          unit: '%' },
    ],
    narrative: [
      { step: "01", title: "타이밍 신호 감지", desc: `${algorithm.toUpperCase()}의 연산 과정에서 ${deltaTDisplay}ns 단위의 일관된 시간 편차가 감지되었습니다.` },
      { step: "02", title: "통계 분석", desc: `${samplesDisplay}회 반복 측정 결과, SNR ${snrDisplay} 수준에서 ${pSuccessPercent}%의 비트 추론 확률이 확인됩니다.` },
      { step: "03", title: "위험 평가", desc: "Non-Constant Time 알고리즘은 장기적으로 물리적 측정 공격에 노출될 위험이 있습니다. 보안이 중요한 환경에서는 Constant-Time 알고리즘 도입을 권장합니다." }
    ],
    mitigation: [
      { step: "01", title: "Constant-Time 알고리즘 도입", desc: "Argon2id와 같이 설계 단계부터 Constant-Time을 보장하는 알고리즘으로 전환하십시오." },
      { step: "02", title: "무작위 지연 삽입", desc: "연산 단계에 무작위 지연(Jitter)을 추가하면 타이밍 신호의 통계적 패턴을 교란할 수 있습니다." },
      { step: "03", title: "보안 라이브러리 업데이트", desc: "최신 보안 패치가 적용된 암호화 라이브러리를 사용하여 구현 수준의 타이밍 취약점을 최소화하십시오." }
    ]
  };
};