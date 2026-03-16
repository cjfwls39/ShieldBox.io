/**
 * Credential Stuffing Attack Report Module
 * [위치] server/data/reportTemplates/credentialStuffingTemplate.js
 *
 * [분기 설계]
 * 크리덴셜 스터핑은 유출 DB를 이용한 재사용 암호 대입 공격.
 * 암호 자체의 재사용 가능성(prob)과 출처(isGenerated)가 핵심 분기 기준.
 * isGenerated는 matchFound 다음으로 우선 확인하여 시스템 생성 암호는 즉시 안전 서사로.
 *
 * CASE 1: matchFound                                      → 유출 DB 직접 매칭 (확정 위험)
 * CASE 2: !matchFound && isGenerated                      → 시스템 생성 (완전 안전)
 * CASE 3: !matchFound && !isGenerated && prob >= 50       → 높은 재사용 확률
 * CASE 4: !matchFound && !isGenerated && prob >= 20       → 중간 재사용 확률
 * CASE 5: !matchFound && !isGenerated (else)              → 낮은 재사용 확률 (안전)
 */

module.exports = (res) => {
  const { matchFound, prob, isGenerated, rank, grade, pwLen, algorithm } = res;

  // ─── [CASE 1] 유출 DB 직접 매칭 — 확정 위험 ──────────────────────────
  if (matchFound) {
    return {
      summary: "보안 비상: 이미 유출된 데이터베이스에 등재된 암호입니다.",
      attackVector: "Credential Stuffing | Public Breach Database Match",
      cryptoAnalysis: `Critical: Direct match confirmed in global breach dataset. Rank #${rank || 'N/A'}. Attackers in automated stuffing loops will attempt this credential across all major services.`,
      metaphor: {
        title: "📑 수배 전단에 올라간 인상착의",
        description: "귀하의 암호는 이미 전 세계 해커들이 공유하는 유출 데이터셋의 핵심 목록에 포함되어 있습니다. 공격자는 시도조차 하기 전에 정답을 이미 알고 있는 상태입니다."
      },
      vulnerability: {
        type: "Known Breach Correlation",
        reason: `유출 데이터베이스에 직접 등재된 암호입니다. 공격자의 자동화 스터핑 도구가 최우선으로 시도하는 목록에 포함되며, 다른 서비스에서 이미 대규모로 탈취된 기록이 있습니다.`
      },
      evidence: [
        { label: 'BREACH STATUS', value: 'DIRECT MATCH',            unit: '' },
        { label: 'DANGER RANK',   value: rank ? `#${rank}` : 'HIGH', unit: '' },
        { label: 'MATCH PROB',    value: prob,                       unit: '%' },
        { label: 'SEARCH ORIGIN', value: 'DARKWEB DB',              unit: '' },
      ],
      narrative: [
        { step: "01", title: "데이터 대조 결과", desc: `다크웹 및 대규모 유출 사고에서 수집된 실제 데이터셋과 귀하의 암호가 완전히 일치함을 확인했습니다.${rank ? ` 위험 순위 ${rank}위에 해당합니다.` : ''}` },
        { step: "02", title: "크리덴셜 스터핑 시나리오", desc: "해커는 다른 서비스에서 유출된 아이디와 이 암호를 조합하여 귀하가 사용하는 모든 서비스에 자동 로그인을 시도할 것입니다." },
        { step: "03", title: "파급 범위 분석", desc: "이 암호를 여러 서비스에서 사용하고 있다면, 한 번의 유출로 모든 계정이 동시에 위험에 처합니다. 지금 즉시 전수 조사가 필요합니다." }
      ],
      mitigation: [
        { step: "01", title: "전 서비스 암호 즉시 변경", desc: "이 암호를 사용하는 모든 서비스의 비밀번호를 지금 당장, 각각 다르게 변경하십시오." },
        { step: "02", title: "2단계 인증 즉시 활성화", desc: "암호가 유출되더라도 로그인을 차단할 수 있도록 OTP나 생체 인증을 모든 서비스에 반드시 설정하십시오." },
        { step: "03", title: "유출 모니터링", desc: "'Have I Been Pwned' 등의 서비스를 통해 추가적인 계정 정보 유출 여부를 즉시 확인하십시오." }
      ]
    };
  }

  // ─── [CASE 2] 시스템 생성 — 완전 안전 ───────────────────────────────
  if (!matchFound && isGenerated) {
    return {
      summary: "완벽한 무작위성: 인간의 심리적 편향이 배제된 최고 수준의 보안 상태입니다.",
      attackVector: "Credential Stuffing | Non-Human Pattern Validation",
      cryptoAnalysis: `System-generated password confirmed. Zero correlation with human behavioral patterns or breach databases. Automated stuffing attacks have near-zero probability of success.`,
      metaphor: {
        title: "🎲 우주의 확률이 만들어낸 암호",
        description: "이 암호는 인간의 뇌가 만들어낼 수 없는 순수한 무작위성의 산물입니다. 해커의 통계적 모델이나 심리 분석이 적용될 수 있는 어떤 패턴도 존재하지 않습니다."
      },
      vulnerability: {
        type: "Absolute Pattern Immunity",
        reason: "시스템 생성 방식으로 만들어져 인간의 심리적 유추가 원천적으로 차단됩니다. 모든 크리덴셜 스터핑 시나리오에서 완벽한 면역력을 가집니다."
      },
      evidence: [
        { label: 'ORIGIN TYPE',    value: 'SYSTEM',                 unit: '' },
        { label: 'PREDICTABILITY', value: '< 0.01',                 unit: '%' },
        { label: 'BREACH MATCH',   value: 'NONE',                  unit: '' },
        { label: 'SECURITY TIER',  value: 'IMMUNE',                unit: '' },
      ],
      narrative: [
        { step: "01", title: "무작위성 검증", desc: "엔트로피 분석 결과, 인간의 습관이나 규칙성이 전혀 발견되지 않은 순수 무작위 데이터임을 확인했습니다." },
        { step: "02", title: "행동 패턴 분석 실패", desc: "해커가 보유한 모든 행동 패턴 데이터베이스와 비교했으나 유의미한 상관관계를 찾을 수 없었습니다. 통계적 추론이 불가능합니다." },
        { step: "03", title: "크리덴셜 스터핑 면역", desc: "유출된 목록과의 일치 가능성이 사실상 제로에 수렴하여, 자동화된 대입 공격이 어떤 효과도 발휘하지 못합니다." }
      ],
      mitigation: [
        { step: "01", title: "생성 방식 유지", desc: "암호 관리자(Password Manager)를 통한 무작위 생성 방식은 현대 보안의 정석입니다. 계속 유지하십시오." },
        { step: "02", title: "전 서비스 적용", desc: "이 방식으로 생성된 암호를 모든 서비스에 적용하여 일관된 보안 수준을 유지하십시오." },
        { step: "03", title: "암호 관리자 백업", desc: "생성된 암호를 안전하게 관리하기 위해 암호 관리자의 마스터 암호와 백업 코드를 별도로 안전한 장소에 보관하십시오." }
      ]
    };
  }

  // ─── [CASE 3] !matchFound + 수동 생성 + prob >= 50 (고위험) ──────────
  if (!matchFound && !isGenerated && prob >= 50) {
    return {
      summary: `행동 패턴 고위험: 재사용 추정 확률 ${prob}%로, 자동화 공격의 표적이 될 가능성이 높습니다.`,
      attackVector: "Credential Stuffing | High Behavioral Probability Analysis",
      cryptoAnalysis: `No direct breach match, but high predictability score (${prob}%). Strong human behavioral signatures detected — repeated sequences, common structures, or personal info patterns found.`,
      metaphor: {
        title: "📖 많은 사람이 같은 결말을 예측하는 책",
        description: "직접 유출된 기록은 없지만, 암호의 구조가 너무 전형적입니다. 해커는 통계 분석만으로도 많은 사람이 이와 유사한 패턴을 사용함을 알고 있어, 이 범위를 집중 공략합니다."
      },
      vulnerability: {
        type: "High Behavioral Predictability",
        reason: `재사용 추정 확률 ${prob}%는 수동 생성 암호 중 상위 위험군에 해당합니다. 전화번호, 생년월일, 반복 패턴 등 인간 행동의 전형적인 흔적이 감지되었습니다.`
      },
      evidence: [
        { label: 'BREACH MATCH',   value: 'NONE',                  unit: '' },
        { label: 'REUSE PROB',     value: prob,                    unit: '%' },
        { label: 'RISK TIER',      value: 'HIGH',                  unit: '' },
        { label: 'PATTERN TYPE',   value: 'BEHAVIORAL',            unit: '' },
      ],
      narrative: [
        { step: "01", title: "행동 패턴 스캔", desc: `암호 구조에서 전화번호, 생년월일, 반복 숫자 등 인간의 전형적인 생성 규칙이 다수 감지되어 재사용 추정 확률 ${prob}%가 산정되었습니다.` },
        { step: "02", title: "통계적 위험 분석", desc: `${prob}% 확률은 다른 사용자들이 같거나 유사한 패턴의 암호를 사용할 가능성이 높다는 의미입니다. 공격자는 이 범위를 집중 대입합니다.` },
        { step: "03", title: "공격 효율 평가", desc: "유출 DB 직접 일치는 아니지만, 높은 예측 가능성은 해커의 스터핑 도구가 일찍 성공을 거둘 수 있게 합니다. 타 서비스 유출 연동 위험도 존재합니다." }
      ],
      mitigation: [
        { step: "01", title: "개인정보 완전 배제", desc: "이름, 생일, 전화번호, 연도 등 자신과 직접 연관된 정보를 암호에서 완전히 제거하십시오." },
        { step: "02", title: "반복 패턴 제거", desc: "연속된 숫자(1234, 0000)나 키보드 패턴(qwerty) 등 통계적으로 흔한 요소를 제거하십시오." },
        { step: "03", title: "무작위성 확보", desc: "암호 생성기를 통한 완전 무작위 문자열을 사용하거나, 서로 연관 없는 단어 조합을 통해 인간적 패턴을 완전히 제거하십시오." }
      ]
    };
  }

  // ─── [CASE 4] !matchFound + 수동 생성 + prob >= 20 (중간 위험) ───────
  if (!matchFound && !isGenerated && prob >= 20) {
    return {
      summary: `중간 수준의 재사용 위험: 재사용 추정 확률 ${prob}%로, 일부 개선이 권장됩니다.`,
      attackVector: "Credential Stuffing | Moderate Behavioral Risk Analysis",
      cryptoAnalysis: `No breach match. Moderate predictability score (${prob}%). Some human behavioral patterns detected but uniqueness is relatively preserved. Low-priority target for automated stuffing.`,
      metaphor: {
        title: "🧩 독창적이지만 일부 패턴이 보이는 퍼즐",
        description: "전반적으로 독창적인 암호이지만, 일부 구성 요소에서 인간적인 패턴의 흔적이 감지됩니다. 완전히 안전하지는 않으나 고위험 대상은 아닙니다."
      },
      vulnerability: {
        type: "Moderate Behavioral Predictability",
        reason: `재사용 추정 확률 ${prob}%는 평균적인 수동 생성 암호 수준입니다. 일부 구성 요소가 인간 행동 패턴을 반영하고 있어 완전한 무작위성에는 미치지 못합니다.`
      },
      evidence: [
        { label: 'BREACH MATCH',   value: 'NONE',                  unit: '' },
        { label: 'REUSE PROB',     value: prob,                    unit: '%' },
        { label: 'RISK TIER',      value: 'MODERATE',              unit: '' },
        { label: 'UNIQUENESS',     value: 'PARTIAL',               unit: '' },
      ],
      narrative: [
        { step: "01", title: "패턴 희소성 분석", desc: `재사용 추정 확률 ${prob}%는 완전한 무작위성보다는 낮지만, 전형적인 인간 행동 패턴에 비해서는 독창성이 있는 수준입니다.` },
        { step: "02", title: "자동화 공격 우선순위", desc: "중간 수준의 예측 가능성으로 인해 완전 무작위 암호보다는 공격 대상이 될 가능성이 높지만, 고위험군에 비해 우선순위는 낮습니다." },
        { step: "03", title: "개선 가능성", desc: `${prob}%에서 5% 이하로 낮추는 것은 암호 구성 방식의 간단한 변경으로 달성할 수 있습니다. 소폭의 개선으로 보안이 크게 향상됩니다.` }
      ],
      mitigation: [
        { step: "01", title: "예측 가능 요소 제거", desc: "암호에서 인간적 패턴의 흔적을 찾아 제거하십시오. 개인정보, 연도, 반복 패턴이 주요 개선 대상입니다." },
        { step: "02", title: "무작위성 강화", desc: "현재의 기반을 유지하면서 더 많은 무작위 요소를 추가하거나, 암호 생성기를 활용하여 완전 무작위 문자열로 교체하십시오." },
        { step: "03", title: "서비스별 고유화", desc: "각 서비스마다 다른 암호를 사용하면 한 서비스에서 유출이 발생해도 다른 서비스는 안전하게 보호됩니다." }
      ]
    };
  }

  // ─── [CASE 5] !matchFound + 수동 생성 + prob < 20 (안전) ─────────────
  return {
    summary: `우수한 보안 습관: 재사용 추정 확률 ${prob}%로, 크리덴셜 스터핑 공격으로부터 안전합니다.`,
    attackVector: "Credential Stuffing | Manual Integrity Verification",
    cryptoAnalysis: `No breach match. Low predictability score (${prob}%). High structural uniqueness despite manual creation. Automated stuffing attacks have minimal probability of success.`,
    metaphor: {
      title: "🧩 정교하게 설계된 수제 열쇠",
      description: "인간의 기억력을 활용하면서도 해커의 통계를 따돌린 드문 사례입니다. 기계 수준에 가까운 무작위성을 수동으로 구현했습니다."
    },
    vulnerability: {
      type: "High Behavioral Entropy",
      reason: `재사용 추정 확률 ${prob}%는 수동 생성 암호 중 매우 안전한 수준에 해당합니다. 인간 행동 패턴의 흔적이 거의 감지되지 않아 통계적 추론이 어렵습니다.`
    },
    evidence: [
      { label: 'BREACH MATCH',   value: 'NONE',                    unit: '' },
      { label: 'REUSE PROB',     value: prob,                      unit: '%' },
      { label: 'RISK TIER',      value: 'LOW',                     unit: '' },
      { label: 'UNIQUENESS',     value: 'HIGH',                    unit: '' },
    ],
    narrative: [
      { step: "01", title: "행동 패턴 희소성", desc: `수동으로 생성했음에도 재사용 추정 확률이 ${prob}%로 매우 낮습니다. 전형적인 인간 행동 패턴에서 크게 벗어난 독창적인 구성임을 확인했습니다.` },
      { step: "02", title: "자동화 공격 우선순위 평가", desc: `${prob}%의 낮은 예측 가능성으로 인해 해커의 자동화 스터핑 도구가 이 암호를 우선 대상으로 선택할 가능성이 극히 낮습니다.` },
      { step: "03", title: "종합 안전 판정", desc: `유출 DB 직접 매칭 없음 + 낮은 재사용 확률(${prob}%)의 조합으로, 크리덴셜 스터핑 공격으로부터 충분한 보호가 확보되어 있습니다.` }
    ],
    mitigation: [
      { step: "01", title: "현재 보안 수준 유지", desc: "안정적인 수준입니다. 지금의 암호 생성 방식을 지속하십시오." },
      { step: "02", title: "서비스별 고유화 유지", desc: "각 서비스마다 다른 암호를 사용하는 습관을 계속 유지하여 한 서비스의 유출이 다른 서비스로 번지지 않게 하십시오." },
      { step: "03", title: "2단계 인증 추가", desc: "강력한 암호에 OTP나 생체 인증을 추가하면 만일의 유출 사고에도 계정을 이중으로 보호할 수 있습니다." }
    ]
  };
};