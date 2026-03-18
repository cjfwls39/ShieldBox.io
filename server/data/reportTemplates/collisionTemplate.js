/**
 * Collision Attack Report Module
 * [위치] server/data/reportTemplates/collisionTemplate.js
 *
 * [분기 설계]
 * 충돌 공격의 취약성은 오직 알고리즘의 해시 비트 수와 알려진 수학적 공격으로 결정.
 * pwLen과 Salt는 이 공격과 무관하여 등급 계산에서 완전히 제외됨.
 *
 * CASE 1: !isVulnerable                     → KDF 구조적 면역 (bcrypt/scrypt/argon2id)
 * CASE 2: isVulnerable && grade F/D         → 실용적 위협 (MD5 등 파쇄된 알고리즘)
 * CASE 3: isVulnerable && grade C/B         → 이론적 위협 (현실적으로 어려움)
 * CASE 4: isVulnerable && grade A/S         → 충돌 저항 안전 (SHA-256/512 등)
 */

module.exports = (res) => {
  const {
    isVulnerable,
    algorithm,
    hashBits,
    effectiveBits,
    collisionLabel,
    birthdayOps,
    knownAttack,
    grade,
  } = res;

  const algoName = algorithm?.toUpperCase() || 'UNKNOWN';

  // ─── [CASE 1] KDF 구조적 면역 (bcrypt / scrypt / argon2id) ──────────
  // 이 알고리즘들은 비밀번호 검증에 전용 비교 함수를 사용하므로
  // 수학적으로 충돌값을 찾더라도 실제 인증 우회가 불가능
  if (!isVulnerable) {
    return {
      summary: `구조적 충돌 면역: ${algoName}은(는) 설계 단계부터 충돌 공격의 영향 밖에 있습니다.`,
      attackVector: `Collision Attack | KDF Structural Immunity | ${algoName}`,
      cryptoAnalysis: `${algoName} is a Key Derivation Function (KDF). Even if a mathematical collision H(x)=H(y) exists, the authentication system uses constant-time dedicated comparison — collision exploitation is architecturally impossible.`,
      metaphor: {
        title: '🧬 지문 인식기에 사진을 들이미는 공격',
        description: `자물쇠 모양이 똑같은 가짜 열쇠를 만들어도 지문 인식 잠금장치 앞에서는 무용지물인 것처럼, ${algoName}의 검증 방식은 해시값 자체가 아닌 원본 비밀번호의 고유한 암호학적 특성을 비교합니다.`,
      },
      vulnerability: {
        type: 'Collision-Immune by Design',
        reason: `${algoName}은(는) 비밀번호 검증 전용 KDF입니다. 사용자별 고유 Salt가 내장되어 동일한 비밀번호도 항상 다른 해시를 생성하며, bcrypt.compare()나 argon2.verify() 같은 전용 함수만이 검증을 수행합니다. 수학적 충돌값을 찾더라도 이 구조를 우회할 방법이 없습니다.`,
      },
      evidence: [
        { label: 'DESIGN TYPE',      value: 'Key Derivation Function', unit: '' },
        { label: 'COLLISION IMPACT', value: 'None — Immune',           unit: '' },
        { label: 'SALT STATUS',      value: 'Built-in (Enforced)',      unit: '' },
        { label: 'SECURITY TIER',    value: 'Architectural S-Class',    unit: '' },
      ],
      narrative: [
        { step: '01', title: '설계 원칙 분석', desc: `${algoName}은(는) 범용 해시 함수가 아닌 비밀번호 저장 전용으로 설계되었습니다. 내부적으로 무작위 Salt를 포함하여 같은 비밀번호라도 항상 다른 해시를 생성합니다.` },
        { step: '02', title: '충돌 공격 무효화', desc: `H(x) = H(y)를 만족하는 쌍을 찾아도 ${algoName}의 전용 검증 함수를 통과하려면 실제 비밀번호 원문이 필요합니다. 충돌값은 이 검증을 우회할 수 없습니다.` },
        { step: '03', title: '충돌 공격의 대상 부재', desc: `충돌 공격은 같은 해시를 가진 두 값이 '동등하게 취급'되는 시스템을 노립니다. ${algoName}은(는) 이 전제 자체가 성립하지 않습니다.` },
      ],
      mitigation: [
        { step: '01', title: '현재 알고리즘 유지', desc: `${algoName}은(는) 충돌 공격에 대해 완전한 구조적 면역을 보유합니다. 이 설계를 유지하십시오.` },
        { step: '02', title: '다른 공격 벡터 점검', desc: `충돌 공격에는 안전하더라도 무차별 대입, 사전 공격 등 다른 공격 벡터에 대한 설정을 함께 점검하십시오.` },
        { step: '03', title: '서비스 전반 표준화', desc: `비밀번호 저장이 필요한 모든 곳에 이와 같은 KDF를 표준으로 적용하십시오.` },
      ],
    };
  }

  // ─── [CASE 2] 실용적 위협 — 파쇄된 알고리즘 (grade F 또는 D) ─────────
  if (grade === 'F' || grade === 'D') {
    return {
      summary: `알고리즘 충돌 저항성 붕괴: ${algoName}의 충돌을 현실적인 시간 내에 생성할 수 있습니다.`,
      attackVector: `Collision Attack | Practical Cryptanalysis | ${algoName}`,
      cryptoAnalysis: `CRITICAL: ${algoName} collision resistance has been broken. Known attack: ${knownAttack}. Effective complexity reduced to 2^${effectiveBits} (theoretical Birthday: 2^${hashBits / 2}). Collision achievable in ${collisionLabel} on ${res.hardware}.`,
      metaphor: {
        title: '🗝️ 진짜 열쇠와 구분할 수 없는 가짜 열쇠',
        description: `자물쇠(해시 함수)의 설계 도면에서 치명적인 수학적 허점이 발견되었습니다. 공격자는 당신의 원래 비밀번호를 전혀 모른 채, 자물쇠가 "맞다"고 판단하는 전혀 다른 열쇠를 ${collisionLabel} 안에 만들어낼 수 있습니다.`,
      },
      vulnerability: {
        type: 'Broken Collision Resistance',
        reason: `${knownAttack}에 의해 ${algoName}의 충돌 저항성이 수학적으로 파쇄되었습니다. 이론적 안전성(2^${hashBits / 2})이 2^${effectiveBits}으로 단축되어 현대 GPU로 ${collisionLabel} 내에 충돌 쌍 생성이 가능합니다. 전자서명, 파일 무결성 검증, 인증 토큰 등 해시값의 일치 여부에 의존하는 모든 시스템이 위험합니다.`,
      },
      evidence: [
        { label: 'HASH BITS',         value: `${hashBits}`,             unit: 'bit' },
        { label: 'EFFECTIVE ATTACK',  value: `2^${effectiveBits}`,      unit: 'ops' },
        { label: 'COLLISION TIME',    value: collisionLabel,             unit: '' },
        { label: 'KNOWN ATTACK',      value: knownAttack.split(' ')[0], unit: '' },
      ],
      narrative: [
        { step: '01', title: '충돌 저항성 수학적 분석', desc: `${algoName}의 이론적 충돌 안전성은 2^${hashBits / 2} 연산입니다. 그러나 ${knownAttack}에 의해 실제 복잡도가 2^${effectiveBits}으로 극적으로 단축되었습니다.` },
        { step: '02', title: '실용적 공격 가능성 확인', desc: `현재 ${res.hardware} 환경에서 ${collisionLabel} 내에 H(x) = H(y)를 만족하는 충돌 쌍 (x ≠ y)을 생성할 수 있습니다. 이는 학술 연구가 아닌 실제 공격 도구로 구현 가능한 수준입니다.` },
        { step: '03', title: '파급 범위 평가', desc: `충돌 공격은 비밀번호 복구가 아닌 데이터 위변조와 서명 우회에 활용됩니다. ${algoName}으로 보호된 전자서명, SSL 인증서, 소프트웨어 배포 무결성 검증이 모두 위험합니다.` },
      ],
      mitigation: [
        { step: '01', title: `${algoName} 즉시 교체`, desc: `${algoName}은(는) 보안 목적으로 더 이상 사용해서는 안 됩니다. SHA-256 이상으로 즉시 마이그레이션하십시오.` },
        { step: '02', title: '영향 범위 감사', desc: `${algoName}이 사용된 모든 곳(전자서명, 파일 해시, 인증 토큰 등)을 전수 감사하고 재서명/재발급하십시오.` },
        { step: '03', title: '비밀번호 저장에는 KDF 사용', desc: `비밀번호 저장 목적이라면 ${algoName}은 물론 SHA-256도 아닌 Bcrypt, Argon2id 같은 전용 KDF를 사용하십시오.` },
      ],
    };
  }

  // ─── [CASE 3] 이론적 위협 — 매우 어려우나 이론적으로 가능 (grade B/C) ──
  if (grade === 'B' || grade === 'C') {
    return {
      summary: `충돌 저항성 주의 필요: 이론적으로 가능하나 현실적 공격은 극도로 어렵습니다.`,
      attackVector: `Collision Attack | Theoretical Boundary Analysis | ${algoName}`,
      cryptoAnalysis: `${algoName}: ${hashBits}-bit hash, effective collision complexity 2^${effectiveBits}. Birthday bound: ~${birthdayOps} operations. Estimated collision time: ${collisionLabel}. No known practical shortcut — Birthday Paradox bound applies.`,
      metaphor: {
        title: '⏳ 우주의 나이보다 긴 시간이 걸리는 자물쇠',
        description: `이 자물쇠의 가짜 열쇠를 수학적으로 만드는 것은 이론적으로 가능하지만, 그 작업에 필요한 시간이 ${collisionLabel}입니다. 현존하는 모든 컴퓨터를 동원해도 우주의 나이를 훌쩍 넘기는 시간이 필요합니다.`,
      },
      vulnerability: {
        type: 'Theoretical — Computationally Infeasible',
        reason: `${algoName}의 충돌 복잡도는 2^${effectiveBits}이며 알려진 실용적 단축 공격이 없습니다. 현재 기술로는 ${collisionLabel}이 소요되어 사실상 안전하지만, 이론적 한계가 존재함을 인지해야 합니다.`,
      },
      evidence: [
        { label: 'HASH BITS',         value: `${hashBits}`,        unit: 'bit' },
        { label: 'BIRTHDAY BOUND',    value: `2^${effectiveBits}`, unit: 'ops' },
        { label: 'EST. CRACK TIME',   value: collisionLabel,        unit: '' },
        { label: 'SECURITY STATUS',   value: 'Computationally Safe', unit: '' },
      ],
      narrative: [
        { step: '01', title: '충돌 저항성 수학적 검증', desc: `${algoName}의 ${hashBits}-bit 출력 공간에서 50% 확률로 충돌을 찾으려면 약 ${birthdayOps}회의 연산(Birthday Paradox 기준)이 필요합니다.` },
        { step: '02', title: '현실적 안전성 평가', desc: `알려진 실용적 충돌 알고리즘이 없으며, 예상 충돌 생성 시간은 ${collisionLabel}입니다. 현재의 모든 컴퓨팅 환경에서 실용적 공격은 불가능합니다.` },
        { step: '03', title: '장기 안전성 권고', desc: `현재는 안전하지만, 양자 컴퓨팅의 발전이나 새로운 수학적 공격 발견 가능성에 대비하여 최신 권고 기준을 지속적으로 모니터링하십시오.` },
      ],
      mitigation: [
        { step: '01', title: '현재 알고리즘 유지 가능', desc: `${algoName}은(는) 현재 충돌 공격에 대해 충분히 안전합니다.` },
        { step: '02', title: '장기 관점에서 SHA-3 고려', desc: `완전히 다른 설계 철학(Keccak 스펀지 구조)의 SHA-3은 향후 알려지지 않은 수학적 취약점에 대한 추가 보험을 제공합니다.` },
        { step: '03', title: '비밀번호 저장은 KDF로', desc: `데이터 무결성 검증에는 ${algoName}이 적합하지만, 비밀번호 저장에는 반드시 Argon2id 같은 KDF를 사용하십시오.` },
      ],
    };
  }

  // ─── [CASE 4] 충돌 저항 안전 (grade A / S) ─────────────────────────────
  return {
    summary: `충돌 저항성 최상위 등급: ${algoName}은(는) 현존하는 어떤 충돌 공격도 통하지 않습니다.`,
    attackVector: `Collision Attack | Maximum Resistance Verified | ${algoName}`,
    cryptoAnalysis: `${algoName}: ${hashBits}-bit hash output space of 2^${hashBits}. Collision complexity: 2^${effectiveBits}. Estimated time: ${collisionLabel}. No known attack shortcut exists. Exceeds all current computational capabilities by astronomical margin.`,
    metaphor: {
      title: '🌌 모래사장에서 특정 원자 하나를 찾는 작업',
      description: `${algoName}에서 충돌을 찾으려면 우주에 존재하는 원자 수보다 많은 시도(${birthdayOps}회)가 필요합니다. 인류의 모든 컴퓨터를 수십억 년 동안 돌려도 완료할 수 없는 연산량입니다.`,
    },
    vulnerability: {
      type: 'Absolute Collision Resistance',
      reason: `${algoName}의 ${hashBits}-bit 출력 공간과 ${effectiveBits}-bit 충돌 복잡도는 현존하는 모든 컴퓨팅 파워를 수십억 년 동안 동원해도 충돌을 찾을 수 없는 수준입니다.`,
    },
    evidence: [
      { label: 'HASH BITS',         value: `${hashBits}`,         unit: 'bit' },
      { label: 'COLLISION COMPLEX', value: `2^${effectiveBits}`,  unit: 'ops' },
      { label: 'EST. CRACK TIME',   value: collisionLabel,         unit: '' },
      { label: 'SECURITY GRADE',    value: `${grade} — MAXIMUM`,  unit: '' },
    ],
    narrative: [
      { step: '01', title: '충돌 복잡도 최종 검증', desc: `${algoName}은(는) ${hashBits}-bit 출력을 가지며, Birthday Paradox 기준 충돌 탐색에 약 ${birthdayOps}회의 연산이 필요합니다. 이는 현존하는 모든 컴퓨팅 환경의 총합을 수십억 년 동안 가동해야 하는 수준입니다.` },
      { step: '02', title: '알려진 공격 부재 확인', desc: `${knownAttack}. 현재까지 알려진 실용적 충돌 알고리즘이 존재하지 않으며, 이론적 안전성과 실용적 안전성이 모두 보장됩니다.` },
      { step: '03', title: '충돌 공격 완전 면역 선언', desc: `예상 충돌 생성 시간 ${collisionLabel}은 우주의 나이(약 138억 년)를 압도적으로 초월합니다. 현재 및 예측 가능한 미래의 모든 공격 시나리오에 대해 안전합니다.` },
    ],
    mitigation: [
      { step: '01', title: '현재 알고리즘 유지', desc: `${algoName}은(는) 충돌 공격에 관한 한 최상위 등급입니다. 현재 설정을 유지하십시오.` },
      { step: '02', title: '다중 보안 레이어 유지', desc: `충돌 저항성이 완벽하더라도 무차별 대입, 사이드 채널 등 다른 공격 벡터에 대한 설정도 함께 점검하십시오.` },
      { step: '03', title: '양자 컴퓨팅 장기 모니터링', desc: `Grover 알고리즘 적용 시 충돌 복잡도가 2^(effectiveBits/2)으로 감소합니다. 양자 컴퓨팅의 실용화 수준을 주기적으로 모니터링하고 필요 시 SHA-3나 더 긴 비트 알고리즘으로 전환을 검토하십시오.` },
    ],
  };
};
