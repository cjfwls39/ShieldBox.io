/**
 * Brute Force Attack Report Module
 * [위치] server/data/reportTemplates/bruteForceTemplate.js
 *
 * [분기 설계]
 * 브루트 포스는 순수 물리적 연산력으로 모든 조합을 대입하는 공격.
 * grade가 공격 결과를 가장 직접적으로 표현하므로 grade 단계로 분기.
 *
 * CASE 1: actualResult.found          → 실시간 파훼 성공 (극단적 취약)
 * CASE 2: grade === 'F'               → 설정 결함 (Salt없음/8자미만 등)
 * CASE 3: grade === 'D'               → 취약 (짧거나 알고리즘 부하 부족)
 * CASE 4: grade === 'C'               → 경계선 (개선 필요)
 * CASE 5: grade === 'B'               → 안전하나 개선 여지 있음
 * CASE 6: grade === 'A' || 'S'        → 최상위 방어
 */

module.exports = (res) => {
  const { pwLen, gradeLabel, actualResult, algorithm, hardware, grade } = res;

  // ─── [CASE 1] 실시간 파훼 성공 ───────────────────────────────────────
  if (actualResult && actualResult.found) {
    return {
      summary: `보안 붕괴: 시뮬레이션 엔진이 실제 평문을 즉각 복구했습니다.`,
      attackVector: "Brute Force | Real-time Collision Simulation",
      cryptoAnalysis: `Critical: Plaintext recovered in ${actualResult.attempts?.toLocaleString()} attempts. Search space (94^${pwLen}) is insufficient to resist modern local compute power.`,
      metaphor: {
        title: "🚪 열려 있는 종이 문",
        description: "보안 장치라고 부르기 민망한 수준입니다. 해커가 문을 두드리기도 전에 이미 문이 열려 있는 것과 같습니다. 현대적인 PC 한 대만으로도 0.1초 안에 정답을 찾아냈습니다."
      },
      vulnerability: {
        type: "Zero Entropy Resistance",
        reason: "암호의 길이가 너무 짧아 대입해볼 수 있는 후보군 자체가 극히 적습니다. 기술이 없는 공격자도 즉시 뚫을 수 있는 상태입니다."
      },
      evidence: [
        { label: 'SIMULATION',    value: 'SUCCESS',                              unit: '' },
        { label: 'ATTEMPTS',      value: actualResult.attempts?.toLocaleString(), unit: 'iters' },
        { label: 'SEARCH SPACE',  value: `94^${pwLen}`,                          unit: 'keys' },
        { label: 'CRACK TIME',    value: '< 0.1',                                unit: 'sec' },
      ],
      narrative: [
        { step: "01", title: "실시간 충돌 테스트", desc: `엔진 가동 직후 ${actualResult.attempts?.toLocaleString()}회 시도만에 실제 평문 '${actualResult.password}'를 찾아냈습니다.` },
        { step: "02", title: "물리적 장벽 전무", desc: "알고리즘 설정과 무관하게, 방패 자체가 존재하지 않는 것과 같은 상태입니다. 어떤 보안 엔진도 이 길이 앞에서는 무력합니다." },
        { step: "03", title: "즉각적 위협 실증", desc: "이 결과는 단순 추정이 아닌 실제 연산을 통해 검증된 수치입니다. 현재 암호는 공격 대상으로서 방어 가치가 없습니다." }
      ],
      mitigation: [
        { step: "01", title: "최소 길이 즉시 확보", desc: "보안의 기본 전제는 8자 이상입니다. 지금 당장 12자 이상의 문자열로 교체하십시오." },
        { step: "02", title: "복합 조합 도입", desc: "숫자, 특수문자, 대소문자를 고루 포함하여 경우의 수를 기하급수적으로 늘리십시오." },
        { step: "03", title: "암호 관리자 활용", desc: "기억에 의존하지 말고 암호 관리자(Password Manager)를 통해 무작위 생성된 강력한 암호를 사용하십시오." }
      ]
    };
  }

  // ─── [CASE 2] grade F — 설정 결함 ────────────────────────────────────
  if (grade === 'F') {
    return {
      summary: "보안 설정 결함: 암호화 구조 자체에 치명적인 취약점이 존재합니다.",
      attackVector: "Brute Force | Configuration Failure Analysis",
      cryptoAnalysis: `Critical: Grade F. Salt absence or critical configuration error eliminates all computational resistance. ${algorithm.toUpperCase()} provides zero effective protection under current settings.`,
      metaphor: {
        title: "🔓 자물쇠가 없는 철문",
        description: "철문 자체는 있지만 자물쇠가 채워져 있지 않습니다. 암호화 설정의 결함으로 인해 해커가 아무런 도구 없이도 문을 밀고 들어올 수 있는 상태입니다."
      },
      vulnerability: {
        type: "Critical Configuration Failure",
        reason: "Salt 부재, 8자 미만의 길이, 또는 기타 설정 오류로 인해 알고리즘의 연산 저항력이 완전히 무력화된 상태입니다."
      },
      evidence: [
        { label: 'SECURITY GRADE',  value: 'F — CRITICAL',             unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(),     unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel,                  unit: '' },
        { label: 'CONFIG STATUS',   value: 'FAILED',                   unit: '' },
      ],
      narrative: [
        { step: "01", title: "최하위 등급 F 판정", desc: `${algorithm.toUpperCase()} 알고리즘이 사용됐더라도 현재 설정이 그 효과를 완전히 소멸시키고 있습니다. 알고리즘 교체만으로는 해결되지 않습니다.` },
        { step: "02", title: "설정 결함 분석", desc: "Salt 부재, 암호 길이 부족, 반복 횟수 설정 오류 중 하나 이상이 발생한 상태입니다. 설정이 잘못되면 어떤 알고리즘도 무의미합니다." },
        { step: "03", title: "즉각 조치 필요", desc: `예상 해독 시간 ${gradeLabel}는 현재 하드웨어로 충분히 달성 가능합니다. 설정 수정 없이는 어떤 개선도 효과가 없습니다.` }
      ],
      mitigation: [
        { step: "01", title: "Salt 즉시 활성화", desc: "Salt 없는 해시는 Rainbow Table 공격에도 노출됩니다. 사용자별 고유 Salt를 즉시 적용하십시오." },
        { step: "02", title: "최소 길이 준수", desc: "암호는 반드시 8자 이상, 권장 12자 이상으로 설정하여 탐색 공간을 충분히 확보하십시오." },
        { step: "03", title: "설정 전면 검토", desc: "알고리즘의 반복 횟수(Cost Factor)와 메모리 파라미터를 최신 보안 권고 기준에 맞게 재설정하십시오." }
      ]
    };
  }

  // ─── [CASE 3] grade D — 취약 ──────────────────────────────────────────
  if (grade === 'D') {
    return {
      summary: "심각한 취약성: 현실적인 공격 시나리오에서 파훼 가능성이 높습니다.",
      attackVector: "Brute Force | Low Entropy Resistance Analysis",
      cryptoAnalysis: `High Risk: Grade D. ${algorithm.toUpperCase()} combined with ${pwLen}-char password yields cracking time of ${gradeLabel}. Within practical reach of dedicated hardware.`,
      metaphor: {
        title: "🏚️ 낡고 얇은 나무 울타리",
        description: "울타리가 있긴 하지만 조금만 힘을 주면 무너질 수준입니다. 전문 장비를 갖춘 공격자라면 어렵지 않게 통과할 수 있습니다."
      },
      vulnerability: {
        type: "Insufficient Entropy Barrier",
        reason: "암호 길이 또는 알고리즘 연산 비용이 현대적 공격 장비의 처리 속도를 따라가지 못하는 수준입니다."
      },
      evidence: [
        { label: 'SECURITY GRADE',  value: 'D — HIGH RISK',            unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(),     unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel,                  unit: '' },
        { label: 'HARDWARE CTX',    value: hardware,                   unit: '' },
      ],
      narrative: [
        { step: "01", title: "탐색 공간 분석", desc: `현재 암호(${pwLen}자)가 제공하는 탐색 공간은 ${hardware} 수준의 장비 앞에서 충분한 저항력을 갖추지 못합니다.` },
        { step: "02", title: "알고리즘 부하 평가", desc: `${algorithm.toUpperCase()}의 연산 비용이 공격자의 시도 횟수를 충분히 억제하지 못합니다. 예상 해독 시간은 ${gradeLabel}입니다.` },
        { step: "03", title: "위험 수준 판정", desc: "D등급은 전문 공격자나 고성능 하드웨어를 보유한 집단의 표적이 될 경우 현실적인 위험에 처하는 수준입니다." }
      ],
      mitigation: [
        { step: "01", title: "암호 길이 확장", desc: "현재 길이에서 4자 이상을 추가하는 것만으로도 탐색 공간이 수억 배 증가합니다." },
        { step: "02", title: "알고리즘 강화", desc: "Bcrypt나 Argon2id와 같이 연산 부하가 높은 알고리즘으로 전환하여 공격 속도를 물리적으로 억제하십시오." },
        { step: "03", title: "복잡도 향상", desc: "소문자만 사용한다면 대문자, 숫자, 특수문자를 추가하여 문자 집합을 넓히십시오." }
      ]
    };
  }

  // ─── [CASE 4] grade C — 경계선 ────────────────────────────────────────
  if (grade === 'C') {
    return {
      summary: "경계선상의 보안: 일반적 공격은 방어하나 고성능 공격에 취약할 수 있습니다.",
      attackVector: "Brute Force | Marginal Entropy Audit",
      cryptoAnalysis: `Moderate Risk: Grade C. ${algorithm.toUpperCase()} yields ${gradeLabel} crack time. Resistant to casual attacks but vulnerable to sustained high-performance assaults.`,
      metaphor: {
        title: "🧱 금이 간 벽돌 성벽",
        description: "성벽이 대부분 건재하지만 곳곳에 약점이 있습니다. 일반적인 공격은 막을 수 있지만, 고성능 장비와 충분한 시간을 가진 공격자에게는 결국 무너질 수 있습니다."
      },
      vulnerability: {
        type: "Marginal Computational Resistance",
        reason: "현재 설정이 최소 보안 기준을 간신히 충족하는 수준입니다. 하드웨어 성능 향상이나 분산 공격 시나리오에서는 취약점이 드러날 수 있습니다."
      },
      evidence: [
        { label: 'SECURITY GRADE',  value: 'C — MARGINAL',             unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(),     unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel,                  unit: '' },
        { label: 'RISK PROFILE',    value: 'MODERATE',                 unit: '' },
      ],
      narrative: [
        { step: "01", title: "보안 수준 측정", desc: "C등급은 일반적인 공격 시나리오에서 암호를 보호할 수 있는 수준이지만, 보안 학계 권장 기준의 최저선에 해당합니다." },
        { step: "02", title: "위험 요소 식별", desc: `${algorithm.toUpperCase()}의 설정과 현재 암호 구조가 예상 해독 시간 ${gradeLabel}을 만들어내지만, 클라우드 기반 분산 공격에는 취약합니다.` },
        { step: "03", title: "개선 필요성", desc: "C등급에서 B등급으로 올라가는 것은 간단한 설정 변경만으로도 가능합니다. 지금이 개선할 적기입니다." }
      ],
      mitigation: [
        { step: "01", title: "알고리즘 파라미터 강화", desc: "현재 알고리즘의 비용 계수(Cost Factor)를 2배로 높이면 C에서 B등급으로 도달할 수 있습니다." },
        { step: "02", title: "암호 길이 추가", desc: "현재 구조를 유지하면서 2~4자만 추가해도 등급이 크게 향상됩니다." },
        { step: "03", title: "장기 보안 계획 수립", desc: "하드웨어 성능은 매년 향상됩니다. C등급은 시간이 지남에 따라 더 취약해질 수 있으므로 주기적인 재검토를 권장합니다." }
      ]
    };
  }

  // ─── [CASE 5] grade B — 안전하나 개선 여지 ───────────────────────────
  if (grade === 'B') {
    return {
      summary: "안정적 방어: 현대적 공격 시나리오에 견고하지만 최적화의 여지가 있습니다.",
      attackVector: "Brute Force | Solid Hardening Audit",
      cryptoAnalysis: `Good Defense: Grade B. ${algorithm.toUpperCase()} under current configuration yields ${gradeLabel} crack time. Resistant to all practical attacks under current hardware landscape.`,
      metaphor: {
        title: "🏰 견고한 현대적 요새",
        description: "잘 설계된 성벽이 해커의 정면 돌파를 효과적으로 막아냅니다. 공격에 소요되는 비용이 기대 이익을 크게 상회하는 상태입니다."
      },
      vulnerability: {
        type: "High Physical Entropy",
        reason: "충분한 탐색 공간과 알고리즘 연산 비용이 결합되어 현실적인 공격으로는 파훼가 불가능에 가깝습니다."
      },
      evidence: [
        { label: 'SECURITY GRADE',  value: 'B — SOLID',                unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(),     unit: '' },
        { label: 'EST. CRACK TIME', value: gradeLabel,                  unit: '' },
        { label: 'HARDWARE CTX',    value: hardware,                   unit: '' },
      ],
      narrative: [
        { step: "01", title: "방어 수준 확인", desc: "B등급은 현재 하드웨어 환경에서 실용적인 무차별 대입 공격으로는 파훼가 불가능한 수준임을 의미합니다." },
        { step: "02", title: "알고리즘 성능 검증", desc: `${algorithm.toUpperCase()}이 부여하는 연산 부하와 현재 암호 길이(${pwLen}자)의 조합이 견고한 방어선을 형성하고 있습니다.` },
        { step: "03", title: "개선 가능성 확인", desc: `예상 해독 시간 ${gradeLabel}는 현재로선 충분합니다. 약간의 설정 강화만으로 A등급에 도달할 수 있습니다.` }
      ],
      mitigation: [
        { step: "01", title: "현재 보안 수준 유지", desc: "안정적인 수준입니다. 지금의 보안 설정을 꾸준히 유지하십시오." },
        { step: "02", title: "다요소 인증 권장", desc: "암호 외에 OTP나 생체 인증을 추가하면 무차별 대입 공격의 실효성을 더욱 낮출 수 있습니다." },
        { step: "03", title: "A등급으로의 업그레이드", desc: "알고리즘의 비용 계수를 소폭 상향하거나 암호 길이를 2~3자 추가하면 A등급에 도달할 수 있습니다." }
      ]
    };
  }

  // ─── [CASE 6] grade A / S — 최상위 ───────────────────────────────────
  return {
    summary: "압도적 방어선: 현존하는 연산 능력으로는 뚫을 수 없는 수준입니다.",
    attackVector: "Brute Force | Maximum Entropy Verification",
    cryptoAnalysis: `Theoretical security limit reached. Grade ${grade}. ${algorithm.toUpperCase()} combined with ${pwLen}-char password exceeds capabilities of any contemporary compute cluster.`,
    metaphor: {
      title: "🏔️ 다이아몬드 산맥",
      description: "인류 문명의 역사보다 긴 시간이 흘러야 해독이 가능한 수준입니다. 해커가 이 암호를 공략하는 것은 모래사장에서 특정 모래 한 알을 찾는 것보다 무모합니다."
    },
    vulnerability: {
      type: "Absolute Brute-force Immunity",
      reason: "암호 길이와 알고리즘의 결합이 최상의 시너지를 만들어 어떤 형태의 대입 공격으로도 유의미한 균열을 낼 수 없는 상태입니다."
    },
    evidence: [
      { label: 'SECURITY GRADE',  value: `${grade} — IMPENETRABLE`,   unit: '' },
      { label: 'SEARCH SPACE',    value: `94^${pwLen}`,               unit: 'keys' },
      { label: 'EST. CRACK TIME', value: gradeLabel,                   unit: '' },
      { label: 'ALGORITHM',       value: algorithm.toUpperCase(),      unit: '' },
    ],
    narrative: [
      { step: "01", title: "엔트로피 검증", desc: `탐색해야 할 경우의 수(94^${pwLen})가 우주의 원자 수에 필적할 정도로 방대하여 전수 조사가 물리적으로 불가능합니다.` },
      { step: "02", title: "알고리즘 내성 확인", desc: `${algorithm.toUpperCase()}의 높은 연산 부하가 공격 속도를 극도로 제한합니다. 최고 성능의 슈퍼컴퓨터 클러스터를 동원해도 해독이 불가능합니다.` },
      { step: "03", title: "최종 판정", desc: `${grade}등급은 물리 보안 분야에서 더 이상의 개선이 불필요한 수준입니다. 현재와 가까운 미래의 모든 공격 시나리오에 대해 안전합니다.` }
    ],
    mitigation: [
      { step: "01", title: "현재 수준 유지", desc: "물리 보안 분야에서 최고 등급입니다. 이 보안 설정을 계속 유지하십시오." },
      { step: "02", title: "보안 정책 표준화", desc: "이 수준의 설정을 서비스 전반의 표준으로 채택하여 일관된 보안 정책을 유지하십시오." },
      { step: "03", title: "주기적 재검토", desc: "현재 최고 등급이더라도 5년 주기로 최신 권고 기준과 비교 검토하여 지속적인 보안을 보장하십시오." }
    ]
  };
};