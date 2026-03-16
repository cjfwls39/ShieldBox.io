/**
 * Rule-Based Attack Report Module
 * [위치] server/data/reportTemplates/ruleBasedTemplate.js
 *
 * [분기 설계]
 * 규칙 기반 공격은 Leet, Suffix, DigitStrip 등 심리적 변형 규칙을 역추적하는 공격.
 * matchMethod 세분화로 "어떤 규칙이 뚫렸는지" 구체적 서사를 제공.
 *
 * CASE 1: matchFound && method includes 'Leet'           → Leet 치환 역추적 (@ → a, 0 → o)
 * CASE 2: matchFound && method includes Suffix/Digit      → 숫자·접미사 변형 역추적
 * CASE 3: matchFound (Direct 등 나머지)                   → 직접 일치 또는 기타 방식
 * CASE 4: !matchFound && grade F or D                     → 미탐지 + 설정/알고리즘 취약
 * CASE 5: !matchFound (else)                              → 미탐지 + 안전
 */

module.exports = (res) => {
  const { matchFound, matchMethod, matchWord, grade, gradeLabel, algorithm, pwLen } = res;

  // ─── [CASE 1] Leet Speak 역추적 성공 ─────────────────────────────────
  if (matchFound && matchMethod && matchMethod.includes('Leet')) {
    return {
      summary: `Leet Speak 역추적 성공: 기호 치환 뒤에 숨겨진 원형 단어 '${matchWord}'가 복구되었습니다.`,
      attackVector: "Rule-Based | Leet Speak Reverse Mapping",
      cryptoAnalysis: `Critical: Leet Speak substitution detected via '${matchMethod}'. Root word '${matchWord}' recovered. Common substitutions (@→a, 0→o, 3→e, 1→i, $→s) are fully mapped in heuristic databases.`,
      metaphor: {
        title: "🎭 암호를 바꿔도 목소리는 그대로",
        description: `@ 기호로 a를, 0으로 o를 바꿔 복잡하게 보이려 하셨지만, 해커의 역추적 엔진은 그 뒤에 숨겨진 '${matchWord}'를 즉시 읽어냈습니다. 가면을 썼어도 목소리로 정체가 드러난 것과 같습니다.`
      },
      vulnerability: {
        type: "Leet Speak Transparency",
        reason: "Leet Speak(@ = a, 0 = o, 3 = e 등)는 수십 년 전부터 해커에게 알려진 변형 패턴입니다. 해커의 역연산 데이터베이스는 이 치환 규칙 전체를 커버합니다."
      },
      evidence: [
        { label: 'MATCH STATUS',   value: 'LEET RECOVERED',       unit: '' },
        { label: 'MATCH METHOD',   value: matchMethod,            unit: '' },
        { label: 'ROOT WORD',      value: matchWord || '—',       unit: '' },
        { label: 'RECOVERY RATE',  value: '99',                   unit: '%' },
      ],
      narrative: [
        { step: "01", title: "Leet Speak 패턴 탐지", desc: `'${matchMethod}' 규칙을 통해 암호에서 Leet Speak 치환 패턴이 발견되었습니다. 적용된 변형 규칙을 역으로 계산하여 원형 단어를 추출했습니다.` },
        { step: "02", title: "원형 단어 복구", desc: `역추적 결과 원형 단어 '${matchWord}'가 확인되었습니다. 실질적인 보안 강도는 이 단순 단어 수준과 동일합니다. 겉모습의 복잡함은 의미가 없습니다.` },
        { step: "03", title: "규칙 데이터베이스 비교", desc: "해커는 50,000개 이상의 Leet Speak 변형 규칙 데이터베이스를 보유하고 있습니다. @, 0, 3, 1, $를 이용한 모든 치환 패턴이 이미 공식화되어 있습니다." }
      ],
      mitigation: [
        { step: "01", title: "Leet Speak 의존 탈피", desc: "@, !, 0, 3 등의 기호 치환에 의존하지 마십시오. 이는 복잡해 보이지만 실질적인 보안 강화 효과가 없습니다." },
        { step: "02", title: "원형 단어 완전 제거", desc: `'${matchWord}'처럼 사전에 수록된 단어를 암호의 기반으로 사용하지 마십시오. 변형 규칙을 아무리 적용해도 원형이 추적됩니다.` },
        { step: "03", title: "무작위 문자열 채택", desc: "기억에 의존하기보다 암호 생성기를 통해 완전히 무작위화된 문자열을 사용하십시오. 관련 없는 단어 3~4개를 결합하는 패스프레이즈도 효과적입니다." }
      ]
    };
  }

  // ─── [CASE 2] 숫자·접미사 변형 역추적 성공 ───────────────────────────
  if (matchFound && matchMethod && (
    matchMethod.includes('Suffix') ||
    matchMethod.includes('Digit')  ||
    matchMethod.includes('Peel')
  )) {
    return {
      summary: `숫자·접미사 제거 성공: 뒤에 붙인 숫자와 기호를 제거하여 원형 단어 '${matchWord}'를 복구했습니다.`,
      attackVector: "Rule-Based | Suffix/Digit Strip Recovery",
      cryptoAnalysis: `Suffix peeling successful via '${matchMethod}'. Root word '${matchWord}' identified after stripping trailing digits/symbols. Common suffixes (123, 2024, !, @, 01) are primary attack vectors in rule-based engines.`,
      metaphor: {
        title: "🔖 표지만 바꾼 책",
        description: `단어 뒤에 숫자와 기호를 붙여 다르게 보이려 하셨지만, 해커는 그 '꼬리표'를 떼어내어 안에 있는 원형 단어 '${matchWord}'를 찾아냈습니다. 제목이 달라져도 내용은 같습니다.`
      },
      vulnerability: {
        type: "Predictable Suffix Augmentation",
        reason: "숫자·기호 접미사 추가(dragon123, samsung2024 등)는 가장 흔한 암호 강화 시도 중 하나로, 규칙 기반 공격 엔진의 최우선 처리 대상입니다."
      },
      evidence: [
        { label: 'MATCH STATUS',  value: 'SUFFIX STRIPPED',       unit: '' },
        { label: 'MATCH METHOD',  value: matchMethod,             unit: '' },
        { label: 'ROOT WORD',     value: matchWord || '—',        unit: '' },
        { label: 'RECOVERY RATE', value: '95',                    unit: '%' },
      ],
      narrative: [
        { step: "01", title: "접미사 제거 분석", desc: `'${matchMethod}' 기법을 통해 암호에서 후행 숫자·기호 접미사를 제거하여 원형 단어 '${matchWord}'를 성공적으로 추출했습니다.` },
        { step: "02", title: "패턴 데이터베이스 매칭", desc: `'1', '123', '2024', '!', '@', '01' 등 흔한 접미사 패턴은 규칙 엔진의 최우선 처리 목록에 있습니다. 어떤 접미사를 붙여도 제거 후 원형이 매칭됩니다.` },
        { step: "03", title: "실질적 보안 강도", desc: `접미사가 제거된 이상, 실질적인 보안 강도는 '${matchWord}'라는 단순 단어와 동일합니다. 숫자와 기호를 더하는 것은 체감상의 복잡함만 제공합니다.` }
      ],
      mitigation: [
        { step: "01", title: "접미사 추가 방식 탈피", desc: "단어 뒤에 숫자나 기호를 붙이는 방식은 보안을 강화하지 않습니다. 완전히 다른 방식으로 암호를 구성하십시오." },
        { step: "02", title: "원형 단어 교체", desc: `'${matchWord}'처럼 사전에 수록된 단어를 기반으로 사용하지 마십시오. 단어 자체를 무작위 문자열로 교체해야 합니다.` },
        { step: "03", title: "패스프레이즈 권장", desc: "서로 연관 없는 단어 3~4개를 결합하는 패스프레이즈 방식은 기억하기도 쉽고 접미사 제거 공격에도 강합니다." }
      ]
    };
  }

  // ─── [CASE 3] 직접 일치 또는 기타 변형 탐지 ──────────────────────────
  if (matchFound) {
    return {
      summary: `변형 규칙 역추적 성공: 원형 단어 '${matchWord}'가 복구되었습니다.`,
      attackVector: `Rule-Based | ${matchMethod || 'Pattern'} Recovery`,
      cryptoAnalysis: `Rule-based engine recovered root word '${matchWord}' via '${matchMethod || 'Direct'}' method. Effective security equivalent to unmodified base word.`,
      metaphor: {
        title: "🔍 아무리 숨겨도 찾아내는 탐정",
        description: `어떤 방식으로 변형을 시도했더라도, 해커의 역추적 엔진은 원형 단어 '${matchWord}'를 찾아냈습니다. 변형의 방식이 무엇이든 결과는 같습니다.`
      },
      vulnerability: {
        type: "Heuristic Rule Penetration",
        reason: "인간이 사용하는 암호 변형 패턴은 수천 가지 규칙으로 이미 공식화되어 있습니다. 어떤 변형도 이 데이터베이스 안에서 역연산됩니다."
      },
      evidence: [
        { label: 'MATCH STATUS',  value: 'RECOVERED',             unit: '' },
        { label: 'MATCH METHOD',  value: matchMethod || 'Direct', unit: '' },
        { label: 'ROOT WORD',     value: matchWord || '—',        unit: '' },
        { label: 'RECOVERY RATE', value: '95',                    unit: '%' },
      ],
      narrative: [
        { step: "01", title: "변형 패턴 분석", desc: `'${matchMethod || 'Direct'}' 방식으로 암호에서 변형 규칙이 탐지되어 원형 단어 '${matchWord}'가 복구되었습니다.` },
        { step: "02", title: "규칙 데이터베이스 적중", desc: "50,000개 이상의 변형 규칙 데이터베이스를 대조한 결과, 사용된 변형 방식이 이미 공식화된 패턴에 해당합니다." },
        { step: "03", title: "실질 보안 강도 평가", desc: `원형 단어가 복구된 이상, 실질적인 보안 강도는 '${matchWord}'라는 단순 단어 수준입니다. 복잡해 보이는 외형이 실제 보안 강도를 반영하지 않습니다.` }
      ],
      mitigation: [
        { step: "01", title: "변형 규칙 의존 탈피", desc: "단어를 변형하는 방식 전체에서 벗어나야 합니다. 원형 단어가 있는 한 어떤 변형도 역추적됩니다." },
        { step: "02", title: "완전한 무작위성 채택", desc: "암호 생성기를 통해 완전히 무작위화된 문자열을 생성하거나, 서로 연관 없는 단어를 조합하는 패스프레이즈 방식을 사용하십시오." },
        { step: "03", title: "기억 의존 탈피", desc: "기억하기 쉬운 단어에서 출발하는 암호 생성 방식 자체를 바꾸십시오. 암호 관리자를 사용하면 기억 부담 없이 강력한 암호를 유지할 수 있습니다." }
      ]
    };
  }

  // ─── [CASE 4] 미탐지 + grade F or D (설정/알고리즘 취약) ─────────────
  if (!matchFound && (grade === 'F' || grade === 'D')) {
    return {
      summary: "규칙 분석은 통과했으나, 알고리즘 설정의 치명적 결함이 물리적 방어선을 약화시키고 있습니다.",
      attackVector: "Rule-Based | Algorithmic Resistance Audit",
      cryptoAnalysis: `Pattern immunity confirmed — no rule-based match found. Grade ${grade}: ${algorithm.toUpperCase()} configuration insufficient. Despite heuristic immunity, physical brute-force transition is feasible.`,
      metaphor: {
        title: "🏗️ 기초는 튼튼하지만 벽이 얇은 성",
        description: `해커의 심리적 분석을 완전히 통과한 훌륭한 구성입니다. 그러나 이를 감싸는 ${algorithm.toUpperCase()} 설정이 너무 가벼워, 지능형 공격은 막았지만 물리적 공격에는 취약한 상태입니다.`
      },
      vulnerability: {
        type: "Physical Resistance Deficiency",
        reason: `규칙 기반 공격에 대한 면역은 확보했지만, ${grade}등급을 야기하는 알고리즘 설정 문제가 무차별 대입으로의 전환 시 효과적인 저항력을 제공하지 못합니다.`
      },
      evidence: [
        { label: 'RULE MATCH',      value: 'IMMUNE',               unit: '' },
        { label: 'SECURITY GRADE',  value: `${grade} — ALGO RISK`, unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(), unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel,             unit: '' },
      ],
      narrative: [
        { step: "01", title: "규칙 분석 통과", desc: "50,000개 이상의 변형 규칙을 역으로 적용했지만 알려진 패턴과의 매칭이 없었습니다. 규칙 기반 공격에 대한 면역이 확보되어 있습니다." },
        { step: "02", title: "알고리즘 취약점 발견", desc: `규칙 공격이 실패하면 공격자는 즉시 무차별 대입으로 전환합니다. ${algorithm.toUpperCase()}의 ${grade}등급 설정이 이 전환을 용이하게 만듭니다.` },
        { step: "03", title: "복합 위험도 평가", desc: `지능형 공격은 막았지만 물리적 공격은 취약합니다. 예상 해독 시간 ${gradeLabel}는 개선이 필요한 수준입니다.` }
      ],
      mitigation: [
        { step: "01", title: "알고리즘 설정 강화", desc: `${grade}등급을 야기하는 설정 문제를 해결하십시오. Salt 적용, 반복 횟수 증가, 또는 Argon2id 전환을 고려하십시오.` },
        { step: "02", title: "현재 암호 구성 유지", desc: "규칙 기반 공격에 강한 현재의 암호 구성은 그대로 유지하면서 알고리즘만 개선하면 됩니다." },
        { step: "03", title: "이중 방어 완성", desc: "규칙 기반 공격 면역(이미 확보)과 물리적 강도(개선 필요)를 모두 갖추면 완전한 방어 체계가 완성됩니다." }
      ]
    };
  }

  // ─── [CASE 5] 미탐지 + 안전 (최상위) ─────────────────────────────────
  return {
    summary: "심리적 사각지대 확보: 어떤 규칙으로도 역추적할 수 없는 완벽한 구성입니다.",
    attackVector: "Rule-Based | Maximum Heuristic Immunity",
    cryptoAnalysis: `Heuristic immunity confirmed. Zero correlation with 50,000+ rule-sets. Grade ${grade} physical strength further eliminates any residual risk. Optimal configuration.`,
    metaphor: {
      title: "🌌 누구도 해독할 수 없는 고유 코드",
      description: "인간의 전형적인 습관이 전혀 발견되지 않는, 순수한 무작위성으로 가득 찬 암호입니다. 어떤 심리적 분석이나 역추적 규칙으로도 이 성벽의 틈새를 찾을 수 없습니다."
    },
    vulnerability: {
      type: "Heuristic and Physical Immunity",
      reason: "진정한 무작위 조합과 강력한 물리적 강도가 결합되어 규칙 기반 공격과 무차별 대입 모두에 대해 완전한 면역력을 가집니다."
    },
    evidence: [
      { label: 'RULE STATUS',     value: 'IMMUNE',                unit: '' },
      { label: 'SECURITY GRADE',  value: `${grade} — SECURE`,     unit: '' },
      { label: 'COMPLEXITY',      value: pwLen,                   unit: 'chars' },
      { label: 'DEFENSE TIER',    value: 'IMPENETRABLE',          unit: '' },
    ],
    narrative: [
      { step: "01", title: "완벽한 불규칙성", desc: "50,000개 이상의 변형 규칙을 역으로 적용한 결과, 인간의 인지 습관이나 통계적 규칙이 전혀 개입되지 않은 최상위 무작위성을 확인했습니다." },
      { step: "02", title: "규칙 데이터베이스 무력화", desc: "Leet Speak, 접미사 추가, 숫자 치환, 기타 모든 알려진 변형 규칙을 대조했으나 어떤 패턴도 발견되지 않았습니다." },
      { step: "03", title: "종합 판정", desc: `${grade}등급의 물리적 강도가 규칙 공격 면역을 완전히 뒷받침합니다. 지능형 공격과 물리적 대입 모두에서 완벽한 방어 체계를 갖추고 있습니다.` }
    ],
    mitigation: [
      { step: "01", title: "현재 수준 유지", desc: "보안의 교과서적인 사례입니다. 현재의 생성 방식과 보안 정책을 흔들림 없이 유지하십시오." },
      { step: "02", title: "생성 방식 표준화", desc: "이처럼 완전한 무작위성을 가진 암호를 모든 서비스의 표준으로 삼으십시오." },
      { step: "03", title: "암호 관리자 의존", desc: "이 수준의 무작위성을 지속적으로 유지하려면 암호 관리자(Password Manager)를 활용하는 것이 가장 현실적입니다." }
    ]
  };
};