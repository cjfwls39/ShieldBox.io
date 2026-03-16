/**
 * Rainbow Table Attack Report Module
 * [위치] server/data/reportTemplates/rainbowTableTemplate.js
 *
 * [분기 설계]
 * Rainbow Table 공격의 핵심은 Salt 유무가 공격 가능 여부를 100% 결정.
 * Salt가 없으면 등급 무관하게 공격 성공. Salt가 있으면 grade로 실시간 대입 저항력 판단.
 *
 * CASE 1: !hasSalt                                    → Salt 없음 (테이블 공격 완전 성공)
 * CASE 2: hasSalt && grade === 'F'                    → Salt있음 + 설정 결함 (병렬 취약점)
 * CASE 3: hasSalt && (grade D or C)                   → Salt있음 + 낮은 실시간 저항력
 * CASE 4: hasSalt && (grade B or A or S)              → Salt있음 + 충분한 강도 (완전 방어)
 */

module.exports = (res) => {
  const { hasSalt, grade, algorithm, gradeLabel, crackLabel } = res;

  const crackTime = gradeLabel || crackLabel || '—';

  // ─── [CASE 1] Salt 없음 — Rainbow Table 완전 성공 ─────────────────────
  if (!hasSalt) {
    return {
      summary: "보안 설계의 근본적 결함: 고유 Salt가 식별되지 않았습니다.",
      attackVector: "Rainbow Table | Deterministic Hashing Analysis",
      cryptoAnalysis: `Critical: ${algorithm.toUpperCase()} hash identified without unique salt. Identical passwords always produce identical hashes. Precomputed table lookup is instant.`,
      metaphor: {
        title: "🏷️ 가격표가 붙은 채 진열된 상품",
        description: "암호에 Salt를 추가하지 않아 해시값 자체가 정답지가 되어버린 상태입니다. 해커는 계산기조차 두드릴 필요 없이 해시-평문 대조표에서 검색 한 번으로 암호를 가로챌 수 있습니다."
      },
      vulnerability: {
        type: "Deterministic Hashing Leak",
        reason: "동일한 암호에 대해 항상 동일한 해시를 생성합니다. 이는 해커가 전 세계적인 사전 계산 정답지(Rainbow Table)를 미리 준비할 수 있게 방치하는 치명적인 설계 오류입니다."
      },
      evidence: [
        { label: 'SALT STATUS',     value: 'MISSING',        unit: '' },
        { label: 'HASH UNIQUENESS', value: 'None (Shared)',  unit: '' },
        { label: 'ALGORITHM',       value: algorithm.toUpperCase(), unit: '' },
        { label: 'ATTACK COST',     value: 'Near Zero',      unit: '' },
      ],
      narrative: [
        { step: "01", title: "구조 정밀 스캔", desc: "암호를 사용자마다 고유하게 변조할 무작위 값(Salt)이 해시 구조 내에서 전혀 발견되지 않았습니다." },
        { step: "02", title: "테이블 기반 탈취", desc: "공격자는 별도의 연산 없이 수 테라바이트 규모의 사전 계산 테이블에서 해당 해시값을 검색하여 즉시 평문을 복구합니다." },
        { step: "03", title: "전역적 취약성", desc: "Salt가 없으면 같은 암호를 쓰는 모든 사용자가 동일한 해시값을 가집니다. 한 명의 정보가 유출되면 동일 암호를 사용하는 모든 계정이 함께 위험에 처합니다." }
      ],
      mitigation: [
        { step: "01", title: "Salt 즉시 활성화", desc: "서버 설정에서 사용자별 고유 Salt 기능을 즉시 활성화하여 결정론적 해싱 구조를 파괴하십시오." },
        { step: "02", title: "해시 전면 재생성", desc: "기존의 Salt 없는 해시 데이터는 모두 폐기하고, 새로운 Salt와 함께 암호를 다시 암호화해야 합니다." },
        { step: "03", title: "현대적 알고리즘 도입", desc: "SHA 계열보다는 Salt와 고부하 연산이 기본으로 포함된 Bcrypt나 Argon2id 사용을 강력히 권고합니다." }
      ]
    };
  }

  // ─── [CASE 2] Salt있음 + grade F (설정 결함으로 추가 취약) ──────────
  if (hasSalt && grade === 'F') {
    return {
      summary: "Salt는 적용됐으나, 보안 설정의 결함이 추가적인 취약점을 만들고 있습니다.",
      attackVector: "Rainbow Table | Salted but Configuration Failed",
      cryptoAnalysis: `Salt detected — precomputed table attacks are mitigated. However, Grade F configuration failure renders ${algorithm.toUpperCase()} ineffective against real-time brute-force transition.`,
      metaphor: {
        title: "🔐 잠겼지만 유리로 만든 금고",
        description: "자물쇠는 달았지만 금고 자체가 유리로 만들어진 상태입니다. Rainbow Table이라는 특정 도구는 막았지만, 해커가 망치를 드는 순간 모든 것이 무너집니다."
      },
      vulnerability: {
        type: "Salted but Critically Misconfigured",
        reason: "Salt가 Rainbow Table 공격을 차단하는 첫 번째 방어선은 확보했지만, F등급을 야기하는 설정 결함이 실시간 무차별 대입이라는 두 번째 공격 경로를 완전히 열어놓고 있습니다."
      },
      evidence: [
        { label: 'SALT STATUS',     value: 'ACTIVE',                  unit: '' },
        { label: 'TABLE DEFENSE',   value: 'SUCCESS',                 unit: '' },
        { label: 'SECURITY GRADE',  value: 'F — CONFIG FAIL',         unit: '' },
        { label: 'RESIDUAL RISK',   value: 'CRITICAL',                unit: '' },
      ],
      narrative: [
        { step: "01", title: "Salt 방어 확인", desc: "사용자 고유 Salt가 감지되어 Rainbow Table을 이용한 사전 계산 공격 경로는 성공적으로 차단되었습니다." },
        { step: "02", title: "설정 결함 감지", desc: "그러나 F등급 요인이 발견되었습니다. Salt 방어를 우회한 공격자가 실시간 무차별 대입으로 전환할 경우 저항 시간이 극히 짧습니다." },
        { step: "03", title: "복합 위험 분석", desc: "Salt라는 첫 번째 방어선은 구축됐으나, 두 번째 방어선이 무너진 상태입니다. 두 가지를 모두 갖춰야 완전한 보호가 됩니다." }
      ],
      mitigation: [
        { step: "01", title: "Salt 유지 + 설정 수정", desc: "Salt는 현재 올바르게 적용되어 있습니다. 이제 F등급을 야기하는 설정 결함(암호 길이, 반복 횟수 등)을 수정하십시오." },
        { step: "02", title: "알고리즘 파라미터 강화", desc: "알고리즘의 비용 계수(Cost Factor)나 반복 횟수를 높여 실시간 무차별 대입 공격의 속도를 충분히 억제하십시오." },
        { step: "03", title: "암호 길이 확보", desc: "Salt와 강력한 알고리즘 외에도 암호 자체의 길이가 8자 이상이어야 완전한 3중 방어 체계가 완성됩니다." }
      ]
    };
  }

  // ─── [CASE 3] Salt있음 + grade D or C (낮은 실시간 저항력) ──────────
  if (hasSalt && (grade === 'D' || grade === 'C')) {
    return {
      summary: "사전 계산 공격은 막았으나, 실시간 무차별 대입에 대한 저항력이 부족합니다.",
      attackVector: "Rainbow Table | Real-time Derivation Transition Risk",
      cryptoAnalysis: `Salt active — TMTO (Time-Memory Trade-Off) attacks neutralized. Grade ${grade}: real-time brute-force transition feasible. ${algorithm.toUpperCase()} yields ${crackTime} crack time.`,
      metaphor: {
        title: "🧊 얼어있지만 두께가 얇은 유리 빙판",
        description: "Salt를 사용하여 해커가 미리 준비한 정답지를 무용지물로 만든 점은 훌륭합니다. 그러나 암호 자체의 강도가 낮아 해커가 그 자리에서 직접 망치질을 시작하면 빠르게 뚫릴 수 있는 상태입니다."
      },
      vulnerability: {
        type: "Low Real-time Computational Resistance",
        reason: "Salt 덕분에 사전 계산 공격(TMTO)은 우회했으나, 실시간으로 모든 경우를 대입하는 정공법 공격에는 여전히 취약합니다."
      },
      evidence: [
        { label: 'SALT STATUS',     value: 'ACTIVE',                  unit: '' },
        { label: 'TABLE DEFENSE',   value: 'SUCCESS',                 unit: '' },
        { label: 'SECURITY GRADE',  value: `${grade} — LOW RESIST`,   unit: '' },
        { label: 'EST. CRACK TIME', value: crackTime,                 unit: '' },
      ],
      narrative: [
        { step: "01", title: "Salt 방어 확인", desc: "사용자 고유 Salt가 감지되어 Rainbow Table 공격 경로는 완전히 무력화되었습니다. 첫 번째 방어선은 견고합니다." },
        { step: "02", title: "공격 전략 전환", desc: `공격자는 사전 계산 방식을 포기하고 실시간 무차별 대입으로 전환했습니다. 현재 ${grade}등급 기준 해독까지 약 ${crackTime}이 소요될 것으로 예측됩니다.` },
        { step: "03", title: "방어 불균형 분석", desc: "Salt라는 첫 번째 방어선은 갖췄지만, 암호 강도나 알고리즘 설정이라는 두 번째 방어선이 충분히 구축되지 않았습니다." }
      ],
      mitigation: [
        { step: "01", title: "암호 길이 강화", desc: "Salt라는 방패는 이미 확보했으니, 암호 길이를 12자 이상으로 늘려 실시간 대입 공격의 탐색 공간을 확장하십시오." },
        { step: "02", title: "알고리즘 업그레이드", desc: "현재 알고리즘의 비용 계수를 높이거나 Argon2id처럼 연산 부하가 높은 알고리즘으로 전환하면 실시간 대입 속도를 크게 억제할 수 있습니다." },
        { step: "03", title: "이중 방어 완성", desc: "Salt(Rainbow Table 차단)와 강력한 물리적 강도(무차별 대입 억제)를 모두 갖추면 해시 역추적 공격 전체를 차단할 수 있습니다." }
      ]
    };
  }

  // ─── [CASE 4] Salt있음 + grade B or A or S (완전 방어) ───────────────
  return {
    summary: "철옹성 보안: 사전 계산과 실시간 무차별 대입이 모두 불가능한 상태입니다.",
    attackVector: "Rainbow Table | High-Entropy Verified Defense",
    cryptoAnalysis: `Optimal configuration confirmed. Salt active + Grade ${grade}. ${algorithm.toUpperCase()} renders both precomputed table attacks and real-time brute-force infeasible. Estimated crack time: ${crackTime}.`,
    metaphor: {
      title: "🌌 이중으로 봉인된 난공불락의 요새",
      description: "강력한 Salt가 해시의 고유성을 완벽히 보장하고, 알고리즘은 해커의 연산 자원을 압도합니다. 두 겹의 방어선이 모든 공격 시나리오를 차단합니다."
    },
    vulnerability: {
      type: "Absolute Cryptographic Integrity",
      reason: "최상위 알고리즘과 강력한 Salt가 결합되어, 현존하는 모든 해시 역추적 공격 시나리오를 이론적·물리적으로 무력화합니다."
    },
    evidence: [
      { label: 'SALT STATUS',     value: 'OPTIMIZED',                unit: '' },
      { label: 'SECURITY GRADE',  value: `${grade} — SECURE`,        unit: '' },
      { label: 'EST. CRACK TIME', value: crackTime,                  unit: '' },
      { label: 'ALGORITHM',       value: algorithm.toUpperCase(),    unit: '' },
    ],
    narrative: [
      { step: "01", title: "Salt 완전 검증", desc: "해시 구조 내에 고유 Salt가 완벽히 적용되어 있어 어떤 사전 계산 테이블도 이 해시에 대응할 수 없습니다." },
      { step: "02", title: "실시간 대입 저항력 확인", desc: `Salt 방어를 우회한 뒤 실시간 무차별 대입으로 전환하더라도, ${grade}등급에 해당하는 연산 비용이 이를 효과적으로 차단합니다. 예상 해독 시간: ${crackTime}.` },
      { step: "03", title: "이중 방어 완성", desc: "Rainbow Table(사전 계산)과 Brute Force(실시간 대입)이라는 두 가지 해시 공격 경로 모두에서 완벽한 방어 체계를 갖추고 있습니다." }
    ],
    mitigation: [
      { step: "01", title: "현재 보안 정책 유지", desc: "더 이상의 강화가 필요 없는 수준입니다. 현재의 Salt 및 알고리즘 설정을 엄격히 유지하십시오." },
      { step: "02", title: "보안 정책 표준화", desc: "이 수준의 설정을 서비스 전반의 표준으로 채택하여 모든 사용자 데이터에 동일한 보호를 제공하십시오." },
      { step: "03", title: "주기적 검토", desc: "암호화 기술은 계속 발전합니다. 현재 설정이 최신 보안 권고 기준을 충족하는지 주기적으로 검토하십시오." }
    ]
  };
};