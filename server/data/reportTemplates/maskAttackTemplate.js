/**
 * Mask Attack Report Module
 * [위치] server/data/reportTemplates/maskAttackTemplate.js
 *
 * [분기 설계]
 * 마스크 공격은 암호의 "구조 예측 가능성"을 점수화하여 탐색 공간을 압축하는 공격.
 * intensity(구조 정형화 점수)와 grade(물리적 등급)의 두 축으로 케이스 분류.
 * HIGH×SAFE는 실측상 달성이 어려운 케이스로 제외.
 *
 * intensity 기준: HIGH(>=7) / MID(4~6) / LOW(<4)
 * grade 기준:     WEAK([F,D,C]) / SAFE([B,A,S])
 *
 * CASE 1: intensity >= 7 && WEAK → 정형구조 + 물리 취약 (최악)
 * CASE 2: intensity >= 7 && SAFE → 정형구조 + 물리 충분 (구조만 문제)
 * CASE 3: intensity 4~6 && WEAK  → 중간구조 + 물리 취약
 * CASE 4: intensity 4~6 && SAFE  → 중간구조 + 물리 충분 (양호)
 * CASE 5: intensity < 4  && WEAK → 무작위구조 + 물리 취약 (알고리즘만 문제)
 * CASE 6: intensity < 4  && SAFE → 무작위구조 + 물리 충분 (최상)
 */

module.exports = (res) => {
  const { intensity, reductionRate, pwLen, grade, gradeLabel, algorithm } = res;

  const WEAK_GRADES = ['F', 'D', 'C'];
  const isWeak = WEAK_GRADES.includes(grade);

  // ─── [CASE 1] intensity >= 7 + WEAK — 최악의 조합 ────────────────────
  if (intensity >= 7 && isWeak) {
    return {
      summary: "이중 취약성: 전형적인 구조와 낮은 물리 강도가 결합되어 최악의 상태입니다.",
      attackVector: "Mask Attack | Structural Predictability Analysis",
      cryptoAnalysis: `Critical double vulnerability. Structural intensity: ${intensity}/10 (HIGH). Search space compressed by ${reductionRate}% via mask filters. Grade ${grade} offers minimal resistance after compression.`,
      metaphor: {
        title: "🏗️ 설계도가 공개된 종잇장 건물",
        description: "'첫 글자 대문자', '끝에 숫자' 등 전형적인 구조를 따르는 데다 암호 자체의 강도도 낮습니다. 해커는 지름길(마스크 패턴)로 빠르게 접근한 뒤 얇은 벽을 쉽게 부수고 들어옵니다."
      },
      vulnerability: {
        type: "Compound Structural Weakness",
        reason: `정형화된 문자 배치(intensity ${intensity}/10)로 인해 탐색 공간이 ${reductionRate}% 압축되고, ${grade}등급의 낮은 물리적 강도가 압축된 공간마저 빠르게 소진시킵니다.`
      },
      evidence: [
        { label: 'INTENSITY',        value: `${intensity} / 10`,   unit: '' },
        { label: 'COMPRESSION',      value: reductionRate,          unit: '%' },
        { label: 'SECURITY GRADE',   value: `${grade} — CRITICAL`, unit: '' },
        { label: 'ATTACK EFFICIENCY', value: 'MAXIMUM',            unit: '' },
      ],
      narrative: [
        { step: "01", title: "구조 패턴 탐지", desc: `정형화 강도 ${intensity}/10으로 측정되었습니다. '첫 글자 대문자', '연속 숫자', '마지막 특수문자' 등 해커가 가장 먼저 시도하는 전형적인 마스크 패턴을 그대로 따르고 있습니다.` },
        { step: "02", title: "탐색 공간 압축", desc: `마스크 필터 적용으로 전체 탐색 공간의 ${reductionRate}%가 즉시 제거됩니다. 단순 무차별 대입보다 훨씬 빠른 속도로 공격이 진행됩니다.` },
        { step: "03", title: "물리 강도 한계", desc: `압축된 탐색 공간에서 ${grade}등급의 물리적 강도는 충분한 시간적 방벽을 제공하지 못합니다. 예상 해독 시간: ${gradeLabel}.` }
      ],
      mitigation: [
        { step: "01", title: "구조적 무작위성 도입", desc: "대문자나 숫자를 예측 가능한 위치(첫 글자, 마지막)에 두지 말고 임의의 위치에 배치하십시오." },
        { step: "02", title: "물리 강도 동시 강화", desc: "구조 개선과 함께 알고리즘 파라미터를 강화하거나 암호 길이를 늘려 물리적 방어선도 확보하십시오." },
        { step: "03", title: "패턴 고정관념 타파", desc: "'대문자+소문자+숫자+기호' 순서의 고정 배치를 버리고, 무작위로 섞어 마스크 필터가 예측할 수 없게 만드십시오." }
      ]
    };
  }

  // ─── [CASE 2] intensity >= 7 + SAFE — 구조만 문제 ────────────────────
  if (intensity >= 7 && !isWeak) {
    return {
      summary: "구조적 취약성 발견: 물리 강도는 우수하나 문자 배치 규칙이 너무 예측 가능합니다.",
      attackVector: "Mask Attack | Pattern Redundancy Audit",
      cryptoAnalysis: `Physical entropy sufficient (Grade ${grade}). However, structural intensity ${intensity}/10 enables ${reductionRate}% search space compression. Effective security lower than grade implies.`,
      metaphor: {
        title: "🏛️ 견고하지만 지도에 표시된 신전",
        description: "성벽의 두께는 매우 견고합니다. 그러나 입구와 통로의 위치가 지도에 표시되어 있어 해커가 정면 돌파 대신 효율적인 경로를 통해 접근할 수 있습니다."
      },
      vulnerability: {
        type: "Structural Efficiency Exploit",
        reason: `물리적 강도가 ${grade}등급으로 우수하지만, intensity ${intensity}/10의 정형화된 구조가 탐색 공간을 ${reductionRate}% 압축하여 실질적인 보안 수준을 낮추고 있습니다.`
      },
      evidence: [
        { label: 'INTENSITY',       value: `${intensity} / 10`,    unit: '' },
        { label: 'COMPRESSION',     value: reductionRate,           unit: '%' },
        { label: 'SECURITY GRADE',  value: `${grade} — STRUCT RISK`, unit: '' },
        { label: 'EFFECTIVE TIER',  value: 'REDUCED',              unit: '' },
      ],
      narrative: [
        { step: "01", title: "구조 패턴 고착화", desc: `암호의 물리적 강도는 ${grade}등급으로 충분하지만, 정형화 강도 ${intensity}/10이 문자 배치의 예측 가능성을 높이고 있습니다.` },
        { step: "02", title: "마스크 필터 효과", desc: `정형화된 구조 덕분에 공격자는 탐색 공간을 ${reductionRate}% 압축하여, 실제 보안 수준을 ${grade}등급보다 낮추는 효과를 냅니다.` },
        { step: "03", title: "잠재적 위험성", desc: `예상 해독 시간 ${gradeLabel}는 마스크 공격을 고려하지 않은 수치입니다. 구조 압축을 적용하면 실제 소요 시간은 이보다 크게 단축됩니다.` }
      ],
      mitigation: [
        { step: "01", title: "문자 위치 분산", desc: "숫자나 기호를 암호의 마지막이 아닌 중간에 배치하여 마스크 필터의 예측을 차단하십시오." },
        { step: "02", title: "대문자 분산 배치", desc: "첫 글자에만 대문자를 두는 관행을 버리고, 문자열 전체에 불규칙적으로 대문자를 배치하십시오." },
        { step: "03", title: "구조적 엔트로피 강화", desc: "예기치 않은 위치에 특수문자를 삽입하거나 연속된 숫자 블록을 분산시켜 마스크 패턴 적용을 어렵게 만드십시오." }
      ]
    };
  }

  // ─── [CASE 3] intensity 4~6 + WEAK — 중간구조 + 물리 취약 ───────────
  if (intensity >= 4 && isWeak) {
    return {
      summary: "부분적 구조 노출과 물리 취약성의 복합 위협이 탐지되었습니다.",
      attackVector: "Mask Attack | Moderate Pattern Risk Analysis",
      cryptoAnalysis: `Moderate structural intensity: ${intensity}/10. Partial compression: ${reductionRate}%. Grade ${grade} physical strength insufficient even without full compression advantage.`,
      metaphor: {
        title: "🏚️ 약한 문이 달린 반쯤 예측 가능한 미로",
        description: "미로의 구조가 완전히 뚫리지는 않았지만 일부 경로가 예측 가능하고, 문 자체도 약합니다. 해커는 예측 가능한 경로로 빠르게 이동하고 약한 문을 부수고 들어올 수 있습니다."
      },
      vulnerability: {
        type: "Moderate Structure with Weak Physical Barrier",
        reason: `intensity ${intensity}/10의 부분적 구조 노출로 탐색 공간이 ${reductionRate}% 압축되고, ${grade}등급의 낮은 물리적 강도가 나머지 공간의 방어력도 충분히 제공하지 못합니다.`
      },
      evidence: [
        { label: 'INTENSITY',       value: `${intensity} / 10`,    unit: '' },
        { label: 'COMPRESSION',     value: reductionRate,           unit: '%' },
        { label: 'SECURITY GRADE',  value: `${grade} — WEAK`,      unit: '' },
        { label: 'PHYSICAL TIER',   value: 'INSUFFICIENT',         unit: '' },
      ],
      narrative: [
        { step: "01", title: "부분적 구조 노출", desc: `정형화 강도 ${intensity}/10으로 측정되었습니다. 완전히 예측 가능하지는 않지만, 일부 마스크 패턴이 적용되어 탐색 공간이 ${reductionRate}% 압축됩니다.` },
        { step: "02", title: "물리 강도 부족", desc: `${grade}등급은 마스크 압축이 없더라도 이미 충분한 방어력을 갖추지 못한 수준입니다. 두 취약점이 복합 작용하여 위험이 배가됩니다.` },
        { step: "03", title: "복합 위험 분석", desc: `구조적 취약점 단독으로도, 물리적 취약점 단독으로도 위험한 상황입니다. 두 가지를 동시에 개선해야 합니다.` }
      ],
      mitigation: [
        { step: "01", title: "구조와 강도 동시 개선", desc: "문자 배치의 무작위성을 높이는 동시에 암호 길이를 늘리거나 알고리즘을 강화하십시오." },
        { step: "02", title: "알고리즘 업그레이드 우선", desc: "두 취약점 중 알고리즘/설정 개선이 더 즉각적인 효과를 냅니다. Bcrypt나 Argon2id로 전환하십시오." },
        { step: "03", title: "구조적 무작위성 추가", desc: "숫자와 기호의 위치를 예측 불가능하게 분산시키고, 연속된 숫자 블록은 제거하십시오." }
      ]
    };
  }

  // ─── [CASE 4] intensity 4~6 + SAFE — 양호 ────────────────────────────
  if (intensity >= 4 && !isWeak) {
    return {
      summary: "전반적으로 양호한 보안: 구조 개선으로 더욱 강화할 수 있습니다.",
      attackVector: "Mask Attack | Moderate Pattern Integrity Check",
      cryptoAnalysis: `Grade ${grade} physical strength is solid. Moderate structural intensity (${intensity}/10) allows partial compression (${reductionRate}%). Practical risk remains low but structural improvements are advised.`,
      metaphor: {
        title: "🏰 견고하지만 일부 경로가 보이는 요새",
        description: "성벽 자체는 견고하여 정면 돌파는 어렵습니다. 다만 일부 통로의 위치가 어느 정도 예측 가능하여, 해커가 효율적인 경로를 찾을 가능성이 존재합니다."
      },
      vulnerability: {
        type: "Moderate Structural Predictability",
        reason: `${grade}등급의 물리적 강도가 충분하지만, intensity ${intensity}/10의 부분적 구조 예측 가능성이 마스크 공격에 ${reductionRate}%의 효율 이점을 줄 수 있습니다.`
      },
      evidence: [
        { label: 'INTENSITY',       value: `${intensity} / 10`,    unit: '' },
        { label: 'COMPRESSION',     value: reductionRate,           unit: '%' },
        { label: 'SECURITY GRADE',  value: `${grade} — ADEQUATE`,  unit: '' },
        { label: 'RISK LEVEL',      value: 'LOW-MODERATE',         unit: '' },
      ],
      narrative: [
        { step: "01", title: "구조 분석", desc: `정형화 강도 ${intensity}/10으로 측정되었습니다. 완전히 무작위적이지는 않지만 심각한 수준의 구조 예측도는 아닙니다.` },
        { step: "02", title: "물리 강도 확인", desc: `${grade}등급의 물리적 강도가 마스크 압축(${reductionRate}%)의 이점을 상쇄하여, 실질적인 공격 성공 가능성은 낮습니다.` },
        { step: "03", title: "개선 여지 확인", desc: `현재 상태로도 안전하지만, 구조적 무작위성을 높이면 마스크 공격이 주는 ${reductionRate}%의 압축 이점을 제거하여 더욱 완전한 방어가 됩니다.` }
      ],
      mitigation: [
        { step: "01", title: "구조적 무작위성 강화", desc: "기호나 숫자를 암호의 마지막이 아닌 중간에 배치하여 마스크 필터의 예측을 차단하면 보안이 크게 향상됩니다." },
        { step: "02", title: "현재 강점 유지", desc: "물리적 강도가 충분합니다. 알고리즘 설정은 현재 수준을 유지하십시오." },
        { step: "03", title: "대문자 분산 배치", desc: "첫 글자에만 대문자를 두는 관행을 개선하면 intensity 점수가 크게 낮아져 마스크 공격 효율이 줄어듭니다." }
      ]
    };
  }

  // ─── [CASE 5] intensity < 4 + WEAK — 무작위구조 + 물리 취약 ─────────
  if (isWeak) {
    return {
      summary: "보안 설정 결함: 구조적 독창성에도 불구하고 알고리즘 설정이 물리적 방어선을 무너뜨리고 있습니다.",
      attackVector: "Mask Attack | Unique Structure, Weak Physical Barrier",
      cryptoAnalysis: `Low structural intensity (${intensity}/10) — mask attack offers minimal advantage (${reductionRate}% compression). Grade ${grade}: configuration or length issue nullifies physical resistance despite good structural entropy.`,
      metaphor: {
        title: "🎨 독창적이지만 얇은 유리 조각",
        description: "전형적인 배치 규칙을 따르지 않는 독창적인 구조는 마스크 공격을 어렵게 만듭니다. 그러나 암호 자체의 강도가 낮아 해커가 마스크 없이 정면으로 부수고 들어오는 공격에 취약합니다."
      },
      vulnerability: {
        type: "Configuration Weakness with Good Structure",
        reason: `구조적 독창성으로 마스크 공격의 압축 효율은 낮지만(${reductionRate}%), ${grade}등급을 야기하는 설정 결함이나 길이 부족이 물리적 방어선을 약화시키고 있습니다.`
      },
      evidence: [
        { label: 'INTENSITY',       value: `${intensity} / 10`,    unit: '' },
        { label: 'COMPRESSION',     value: reductionRate,           unit: '%' },
        { label: 'SECURITY GRADE',  value: `${grade} — CONFIG/LEN`, unit: '' },
        { label: 'STRUCTURE RISK',  value: 'LOW (GOOD)',            unit: '' },
      ],
      narrative: [
        { step: "01", title: "구조적 독창성 확인", desc: `정형화 강도 ${intensity}/10으로 측정되었습니다. 문자 배치가 예측 불가능하여 마스크 공격이 제공하는 압축 이점이 ${reductionRate}%에 불과합니다.` },
        { step: "02", title: "물리 강도 한계 진단", desc: `구조는 훌륭하지만 ${grade}등급이 산정되었습니다. Salt 부재, 암호 길이 부족, 또는 알고리즘 설정 오류 중 하나 이상이 물리적 방어선을 약화시키고 있습니다.` },
        { step: "03", title: "위협 경로 분석", desc: "마스크 공격 경로는 막혔지만, 해커는 일반 무차별 대입으로 전환하여 공격을 계속할 수 있습니다. 알고리즘 설정 수정이 최우선입니다." }
      ],
      mitigation: [
        { step: "01", title: "설정 수정 최우선", desc: `구조적 독창성이라는 강점은 이미 확보되어 있습니다. ${grade}등급을 야기하는 Salt 부재 또는 설정 오류를 즉시 수정하십시오.` },
        { step: "02", title: "알고리즘 파라미터 강화", desc: "현재의 좋은 구조에 강력한 알고리즘 설정을 더하면 두 취약점을 모두 해소하고 최상위 보안에 도달할 수 있습니다." },
        { step: "03", title: "현재 구조 유지", desc: "문자 배치의 무작위성은 훌륭합니다. 이 특성을 유지하면서 설정만 개선하면 됩니다." }
      ]
    };
  }

  // ─── [CASE 6] intensity < 4 + SAFE — 최상위 ──────────────────────────
  return {
    summary: "철옹성의 방어: 예측 불가능한 구조와 압도적인 물리 강도가 결합되었습니다.",
    attackVector: "Mask Attack | High-Entropy Structural Verification",
    cryptoAnalysis: `Optimal configuration. Low structural intensity (${intensity}/10): mask attack offers near-zero advantage (${reductionRate}% compression). Grade ${grade} physical strength makes even this minimal advantage irrelevant.`,
    metaphor: {
      title: "🏔️ 입구조차 찾을 수 없는 거대 암벽 요새",
      description: "어떠한 정형화된 배치 규칙도 발견되지 않으며, 성벽의 두께 또한 압도적입니다. 해커는 지름길을 찾을 수도, 정면으로 부술 수도 없습니다."
    },
    vulnerability: {
      type: "High Structural and Physical Entropy",
      reason: `문자 배치가 완벽하게 무작위적이어서(intensity ${intensity}/10) 마스크 공격의 탐색 공간 압축 효과가 ${reductionRate}%에 불과하고, ${grade}등급의 물리적 강도가 이 미미한 이점마저 무의미하게 만듭니다.`
    },
    evidence: [
      { label: 'INTENSITY',       value: `${intensity} / 10`,      unit: '' },
      { label: 'COMPRESSION',     value: reductionRate,             unit: '%' },
      { label: 'SECURITY GRADE',  value: `${grade} — OPTIMAL`,     unit: '' },
      { label: 'DEFENSE TIER',    value: 'IMMUNE',                 unit: '' },
    ],
    narrative: [
      { step: "01", title: "구조적 무작위성 검증", desc: `정형화 강도 ${intensity}/10으로, 문자 배치에 어떤 일관된 패턴도 발견되지 않습니다. 마스크 공격이 제공하는 압축 이점은 ${reductionRate}%에 불과합니다.` },
      { step: "02", title: "물리 강도 확인", desc: `${grade}등급의 물리적 강도가 마스크 압축의 미미한 이점마저 완전히 무력화합니다. 어떤 공격 시나리오에서도 파훼가 불가능합니다.` },
      { step: "03", title: "종합 판정", desc: "구조적 무작위성과 물리적 강도 모두에서 최상위 수준을 갖추고 있습니다. 마스크 공격의 어떤 접근 경로도 효과를 발휘하지 못합니다." }
    ],
    mitigation: [
      { step: "01", title: "현재 수준 유지", desc: "최상위권의 보안 상태입니다. 지금의 무작위 생성 방식을 유지하십시오." },
      { step: "02", title: "습관으로 정착", desc: "이처럼 구조적 무작위성을 갖춘 암호를 모든 서비스에서의 기본 원칙으로 삼으십시오." },
      { step: "03", title: "암호 관리자 활용", desc: "이 수준의 무작위성을 꾸준히 유지하려면 암호 관리자(Password Manager)를 사용하는 것이 가장 효율적입니다." }
    ]
  };
};