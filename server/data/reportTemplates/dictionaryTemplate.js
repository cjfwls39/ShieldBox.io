/**
 * Dictionary Attack Report Module
 * [위치] server/data/reportTemplates/dictionaryTemplate.js
 *
 * [분기 설계]
 * 사전 공격은 패턴 매칭과 물리적 저항력을 복합 평가.
 * matchMethod 세분화가 핵심 — 같은 "탐지됨"이어도 Direct(정답 보유)와
 * 변형 역추적(Leet/Suffix 등)은 완전히 다른 서사.
 *
 * CASE 1: matchFound && matchMethod === 'Direct'      → 유출 DB 직접 일치
 * CASE 2: matchFound && matchMethod !== 'Direct'      → 지능형 변형 역추적
 * CASE 3: !matchFound && grade === 'F'                → 미탐지 + 설정 결함
 * CASE 4: !matchFound && grade D or C                 → 미탐지 + 알고리즘 취약
 * CASE 5: !matchFound (else)                          → 완전 안전
 */

module.exports = (res) => {
  const {
    matchFound, matchMethod, matchWord,
    grade, algorithm, pwLen, gradeLabel, wordlistSize, crackLabel
  } = res;

  const wordlistDisplay = wordlistSize ? wordlistSize.toLocaleString() : '10,000';

  // ─── [CASE 1] 유출 DB 직접 일치 ──────────────────────────────────────
  if (matchFound && matchMethod === 'Direct') {
    return {
      summary: `치명적 보안 결함: 전 세계 유출 데이터셋과 100% 일치하는 암호입니다.`,
      attackVector: "Dictionary Attack | Direct Pattern Match",
      cryptoAnalysis: `Critical: ${algorithm.toUpperCase()} hash reveals identical match with known breach string '${matchWord}'. No transformation required. Instant recovery.`,
      metaphor: {
        title: "🔑 복제된 만능 열쇠",
        description: "성벽이 아무리 높아도 해커가 이미 정문을 여는 열쇠를 손에 들고 있는 격입니다. 이 암호는 어떤 보안 설정과도 무관하게 즉시 파훼됩니다."
      },
      vulnerability: {
        type: "Direct Pattern Exposure",
        reason: "이미 공개된 유출 목록에 그대로 등재된 암호를 사용 중입니다. 이는 보안의 근간을 무너뜨리는 가장 위험한 상태입니다."
      },
      evidence: [
        { label: 'MATCH STATUS', value: 'DIRECT HIT',                              unit: '' },
        { label: 'SOURCE WORD',  value: matchWord || '—',                           unit: '' },
        { label: 'DB SIZE',      value: wordlistDisplay,                            unit: 'items' },
        { label: 'ATTACK COST',  value: 'Near Zero',                               unit: '' },
      ],
      narrative: [
        { step: "01", title: "패턴 스캔", desc: `전 세계 주요 유출 데이터베이스 ${wordlistDisplay}건을 대상으로 스캔한 결과, 귀하의 암호와 정확히 일치하는 값을 즉시 찾아냈습니다.` },
        { step: "02", title: "공격 시나리오", desc: "해커는 단 한 번의 연산도 없이 목록 대조만으로 귀하의 계정에 즉시 침투할 수 있습니다. 알고리즘의 종류나 강도는 전혀 의미가 없습니다." },
        { step: "03", title: "파급 범위 평가", desc: `'${matchWord}'는 공격자의 자동화 도구가 가장 먼저 시도하는 목록에 포함됩니다. 이 암호를 사용하는 모든 서비스가 동시에 위험에 노출된 상태입니다.` }
      ],
      mitigation: [
        { step: "01", title: "즉시 변경", desc: "현재 암호의 정답이 공개된 상태입니다. 이 암호를 사용하는 모든 서비스에서 즉시 변경하십시오." },
        { step: "02", title: "무작위성 확보", desc: "특정 단어나 의미에 기반하지 않은 순수 무작위 문자열로 교체하십시오. 암호 생성기 사용을 권장합니다." },
        { step: "03", title: "서비스별 고유 암호", desc: "하나의 암호를 여러 서비스에 사용하는 습관을 버리고, 서비스마다 서로 다른 암호를 설정하십시오." }
      ]
    };
  }

  // ─── [CASE 2] 지능형 변형 역추적 성공 ────────────────────────────────
  if (matchFound) {
    // matchMethod 예시: 'Leet Restored', 'Symbols Stripped', 'Suffix Peel (Direct)' 등
    const isLeet    = matchMethod?.includes('Leet');
    const isSymbol  = matchMethod?.includes('Symbol') || matchMethod?.includes('Sym');
    const isSuffix  = matchMethod?.includes('Suffix') || matchMethod?.includes('Peel');

    const methodDesc = isLeet   ? 'Leet Speak 치환(@→a, 0→o, 3→e 등)을 역으로 복원하여'
                     : isSymbol ? '특수문자를 제거하여 원형을 추출하는 방식으로'
                     : isSuffix ? '숫자·기호 접미사를 제거하여 원형 단어를 복구하는 방식으로'
                     : '변형 규칙을 역으로 적용하여';

    return {
      summary: `지능형 역추적 성공: 복잡한 변형 뒤에 숨겨진 원형 단어를 간파했습니다.`,
      attackVector: `Dictionary Attack | Heuristic Mapping (${matchMethod})`,
      cryptoAnalysis: `${algorithm.toUpperCase()} hash analyzed. Method '${matchMethod}' successfully recovered root word '${matchWord}'. Structural disguise is transparent to heuristic engines.`,
      metaphor: {
        title: "🎭 정체가 드러난 가면",
        description: `기호로 치환하여 복잡해 보이려 하셨지만, 해커의 역추적 엔진은 그 뒤에 숨겨진 '${matchWord}'를 단숨에 읽어냈습니다. 가면을 써도 목소리로 정체가 드러난 것과 같습니다.`
      },
      vulnerability: {
        type: "Heuristic Pattern Recovery",
        reason: `인간의 전형적인 변형 습관(${isLeet ? 'Leet Speak' : isSuffix ? '숫자·기호 접미사 추가' : '특수문자 치환'} 등)은 해커에게 이미 공식화된 역연산 패턴입니다.`
      },
      evidence: [
        { label: 'MATCH STATUS',  value: 'RECOVERED',   unit: '' },
        { label: 'MATCH METHOD',  value: matchMethod,   unit: '' },
        { label: 'ROOT WORD',     value: matchWord || '—', unit: '' },
        { label: 'DB SIZE',       value: wordlistDisplay, unit: 'items' },
      ],
      narrative: [
        { step: "01", title: "변형 규칙 역추적", desc: `${methodDesc} 암호의 원형인 '${matchWord}'를 성공적으로 복구했습니다.` },
        { step: "02", title: "보안 착시 분석", desc: "규칙성이 있는 변형은 보안을 강화한 것처럼 느껴지지만, 해커는 50,000개 이상의 변형 규칙 데이터베이스를 보유하고 있어 몇 초 안에 무력화됩니다." },
        { step: "03", title: "실질적 보안 강도", desc: `아무리 복잡해 보여도 원형 단어가 복구된 이상, 실질적인 보안 강도는 '${matchWord}'라는 단순 단어 수준과 동일합니다.` }
      ],
      mitigation: [
        { step: "01", title: "원형 단어 완전 제거", desc: `'${matchWord}'처럼 사전에 수록된 단어를 암호의 기반으로 사용하지 마십시오. 변형 규칙을 아무리 적용해도 원형이 추적됩니다.` },
        { step: "02", title: "구조적 탈피", desc: "단순히 문자를 기호로 치환하는 방식 대신, 서로 연관 없는 단어들을 조합하는 패스프레이즈(Passphrase) 방식을 사용하십시오." },
        { step: "03", title: "무작위성 강화", desc: "기호 치환(@, !, 1 등)에 의존하지 말고 암호 생성기를 통해 완전히 무작위화된 문자열을 사용하십시오." }
      ]
    };
  }

  // ─── [CASE 3] 미탐지 + grade F (설정 결함) ───────────────────────────
  if (!matchFound && grade === 'F') {
    return {
      summary: "암호 조합은 독창적이나, 보안 설정의 치명적 결함이 방어선을 무너뜨리고 있습니다.",
      attackVector: "Dictionary Attack | Configuration Failure Override",
      cryptoAnalysis: `Pattern scan cleared — no match in ${wordlistDisplay} entries. Critical: Grade F due to configuration failure. ${algorithm.toUpperCase()} effectiveness nullified by current settings.`,
      metaphor: {
        title: "🔓 자물쇠가 없는 견고한 금고",
        description: "금고 자체는 훌륭하지만 자물쇠가 채워져 있지 않습니다. 사전 공격은 통했지 않지만, 설정 결함으로 인해 더 단순한 물리적 공격에 즉시 노출됩니다."
      },
      vulnerability: {
        type: "Configuration Override Risk",
        reason: "암호 자체는 사전에 없는 고유한 조합이지만, Salt 부재 또는 기타 설정 오류로 인해 알고리즘의 보호 효과가 소멸된 상태입니다."
      },
      evidence: [
        { label: 'PATTERN MATCH',  value: 'CLEARED',                  unit: '' },
        { label: 'SECURITY GRADE', value: 'F — CONFIG FAIL',          unit: '' },
        { label: 'DB SIZE',        value: wordlistDisplay,             unit: 'items' },
        { label: 'REAL RISK',      value: 'CRITICAL (SETTINGS)',       unit: '' },
      ],
      narrative: [
        { step: "01", title: "패턴 검사 통과", desc: `${wordlistDisplay}건의 유출 데이터베이스 전체를 대상으로 스캔했으나 일치하는 패턴을 찾지 못했습니다. 암호의 독창성은 인정됩니다.` },
        { step: "02", title: "설정 결함 감지", desc: "그러나 F등급이 산정되었습니다. Salt 부재 또는 기타 설정 오류가 알고리즘의 모든 방어 효과를 소멸시키고 있습니다." },
        { step: "03", title: "복합 위험 분석", desc: "사전 공격에는 강하지만, 설정 결함으로 인해 Rainbow Table이나 단순 무차별 대입 공격에 즉시 노출됩니다. 두 가지 위협 중 더 시급한 것은 설정 수정입니다." }
      ],
      mitigation: [
        { step: "01", title: "설정 수정 최우선", desc: "암호를 바꾸기 전에 Salt 활성화와 알고리즘 파라미터 수정을 먼저 진행하십시오." },
        { step: "02", title: "Salt 즉시 적용", desc: "사용자별 고유 Salt를 즉시 적용하여 Rainbow Table 공격 경로도 함께 차단하십시오." },
        { step: "03", title: "현재 암호 강점 유지", desc: "독창적인 암호 조합이라는 강점은 그대로 살리면서, 설정만 수정하면 전체 보안이 크게 향상됩니다." }
      ]
    };
  }

  // ─── [CASE 4] 미탐지 + grade D or C (알고리즘 취약) ──────────────────
  if (!matchFound && (grade === 'D' || grade === 'C')) {
    return {
      summary: "암호 조합은 견고하나, 이를 보호하는 알고리즘의 저항력이 부족합니다.",
      attackVector: "Dictionary Attack | Algorithmic Resistance Audit",
      cryptoAnalysis: `Pattern scan cleared — ${wordlistDisplay} entries checked, no match. Risk: ${algorithm.toUpperCase()} hash velocity insufficient. Grade ${grade} yields ${gradeLabel || crackLabel} crack time via brute-force transition.`,
      metaphor: {
        title: "🏚️ 녹슨 자물쇠가 달린 튼튼한 금고",
        description: "금고 자체는 훌륭하지만 자물쇠가 낡아 해커가 초당 수억 번씩 열쇠를 꽂아볼 수 있는 상태입니다. 사전 공격은 막았지만 물리적 대입에는 취약합니다."
      },
      vulnerability: {
        type: "Algorithmic Resistance Deficiency",
        reason: `사전 패턴 탐지는 피했으나 ${algorithm.toUpperCase()}의 연산 속도가 너무 빨라 무차별 대입 전환 시 효과적인 지연을 제공하지 못합니다.`
      },
      evidence: [
        { label: 'PATTERN MATCH',  value: 'CLEARED',                  unit: '' },
        { label: 'SECURITY GRADE', value: `${grade} — ALGO RISK`,      unit: '' },
        { label: 'ALGORITHM',      value: algorithm.toUpperCase(),     unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel || crackLabel,   unit: '' },
      ],
      narrative: [
        { step: "01", title: "패턴 검사 통과", desc: `${wordlistDisplay}건의 유출 데이터베이스를 전량 검사했으나 일치하는 항목이 없었습니다. 암호의 독창성이 사전 공격을 막아냈습니다.` },
        { step: "02", title: "알고리즘 취약점 발견", desc: `사전 공격이 실패하면 공격자는 즉시 무차별 대입으로 전환합니다. ${algorithm.toUpperCase()}의 낮은 연산 비용이 이 전환을 용이하게 만듭니다.` },
        { step: "03", title: "종합 위험도 평가", desc: `${grade}등급 기준 예상 해독 시간은 ${gradeLabel || crackLabel}입니다. 암호의 독창성은 우수하지만 알고리즘이 물리적 공격 속도를 충분히 억제하지 못합니다.` }
      ],
      mitigation: [
        { step: "01", title: "알고리즘 업그레이드", desc: "Bcrypt나 Argon2id처럼 의도적으로 연산 속도를 늦춘 알고리즘으로 전환하십시오. 암호의 독창성과 강력한 알고리즘의 조합이 완벽한 방어를 만듭니다." },
        { step: "02", title: "연산 비용 상향", desc: "서버 설정에서 해시 반복 횟수(Iteration/Cost Factor)를 높여 공격자가 한 번 시도할 때마다 더 많은 자원을 소모하게 만드십시오." },
        { step: "03", title: "현재 암호 강점 활용", desc: "독창적인 암호라는 강점은 그대로 살리면서 알고리즘만 교체하면 전체 보안 수준이 크게 도약합니다." }
      ]
    };
  }

  // ─── [CASE 5] 완전 안전 ───────────────────────────────────────────────
  return {
    summary: "심리적 통찰과 물리적 강도를 모두 갖춘 이상적인 암호입니다.",
    attackVector: "Dictionary Attack | Verified Secure",
    cryptoAnalysis: `Robust integrity confirmed. ${wordlistDisplay} entries scanned — no match. ${algorithm.toUpperCase()} provides strong physical resistance. Grade ${grade}.`,
    metaphor: {
      title: "🏔️ 구름 위에 솟은 화강암 요새",
      description: "어떤 사전적 유추도 불가능하며 물리적으로도 무너뜨릴 수 없는 최상의 보안 상태입니다."
    },
    vulnerability: {
      type: "Structural Integrity",
      reason: "패턴의 독창성, 충분한 물리적 강도, 강력한 알고리즘이 완벽한 균형을 이루고 있습니다."
    },
    evidence: [
      { label: 'PATTERN MATCH',  value: 'CLEAR',                      unit: '' },
      { label: 'SECURITY GRADE', value: `${grade} — SECURE`,          unit: '' },
      { label: 'EST. CRACK TIME', value: gradeLabel || crackLabel,     unit: '' },
      { label: 'DB SIZE',        value: wordlistDisplay,               unit: 'items' },
    ],
    narrative: [
      { step: "01", title: "패턴 독창성 확인", desc: `${wordlistDisplay}건의 유출 데이터베이스와 50,000개 이상의 변형 규칙을 모두 통과한 완전히 고유한 조합임을 확인했습니다.` },
      { step: "02", title: "물리적 강도 검증", desc: `${algorithm.toUpperCase()}이 제공하는 연산 부하와 암호의 조합이 ${grade}등급을 만들어냅니다. 사전 공격 실패 후 무차별 대입으로 전환하더라도 현실적인 파훼가 불가능합니다.` },
      { step: "03", title: "종합 판정", desc: "사전 공격의 두 가지 경로인 직접 매칭과 변형 역추적, 그리고 물리적 무차별 대입 모두에서 완벽하게 방어된 이상적인 암호입니다." }
    ],
    mitigation: [
      { step: "01", title: "현재 수준 유지", desc: "더 이상의 강화가 필요 없습니다. 지금의 보안 습관을 계속 유지하십시오." },
      { step: "02", title: "관리 체계 점검", desc: "암호 자체는 완벽하더라도 저장 방식, 전송 보안 등 전반적인 관리 체계를 함께 점검하십시오." },
      { step: "03", title: "정기적 갱신", desc: "현재의 강력한 암호를 기준으로 삼아, 주기적으로 동등한 수준의 새 암호로 교체하는 습관을 들이십시오." }
    ]
  };
};