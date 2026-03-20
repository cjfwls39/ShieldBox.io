/**
 * ShieldBox.io - Collision Attack Engine
 * [위치] server/engines/attacks/collisionAttack.js
 *
 * [설계 원칙]
 * 충돌 공격은 기존 공격들과 근본적으로 다릅니다.
 *
 *   기존 공격: H(password) = targetHash → 평문을 찾는 것이 목표
 *   충돌 공격: H(x) = H(y), x ≠ y     → 같은 해시를 만드는 다른 입력을 찾는 것이 목표
 *
 * 따라서 비밀번호 길이(pwLen)와 Salt는 이 공격과 무관합니다.
 * 오직 알고리즘의 해시 출력 비트 수만이 저항력을 결정합니다.
 *
 * [수학적 모델: Birthday Paradox]
 * 해시 출력 공간 N = 2^hashBits 에서 충돌 확률 50% 도달에 필요한 시도 횟수:
 *   k ≈ 1.177 × √N = 1.177 × 2^(hashBits/2)
 *
 * MD5의 경우 Wang(2004) 차분 분석으로 실제 복잡도가 2^64(Birthday) → 2^39로 단축됨.
 * SHA-256/512는 알려진 실용적 충돌 알고리즘이 없어 Birthday Paradox 값(2^128, 2^256) 적용.
 *
 * [알고리즘별 취약성]
 * - MD5     : effectiveBits=39  → GPU(16.4G H/s)로 약 33초. 실용적 위협.
 * - SHA-256 : effectiveBits=128 → 3.08 × 10^21년. 현실적으로 불가능.
 * - SHA-512 : effectiveBits=256 → 1.05 × 10^60년. 물리적으로 불가능.
 * - bcrypt/scrypt/argon2id: 비밀번호 검증 전용 KDF. 충돌 자체가 인증 우회로 이어지지 않음.
 *   (내장 Salt로 인해 동일 입력도 항상 다른 해시 생성 → 충돌 공격 개념 비적용)
 */

const {
  HASH_RATES,
  scoreFromSeconds,
  formatSeconds,
  GRADE_ORDER,
  ALGO_CEILING,
} = require('../../core_logic/attackCore');
const { generateReport } = require('../../data/attackReportTemplates');
const cfg = require('../../config/shield-config');

// ─── 알고리즘별 충돌 취약성 프로파일 ──────────────────────────────────────
//
// effectiveBits: 실제 충돌을 만들기 위해 필요한 연산 복잡도 (비트 단위)
//   - MD5:    Wang(2004) 차분 분석 공격으로 64 → 39비트로 단축
//   - SHA256: 알려진 실용적 단축 공격 없음 → Birthday 기반 128비트 적용
//   - SHA512: 동일 → 256비트 적용
//
// isVulnerable: false이면 충돌 공격이 이 알고리즘의 보안에 영향을 줄 수 없음
//   - bcrypt/scrypt/argon2id는 비밀번호 검증에 전용 compare 함수를 사용하므로
//     충돌값이 있어도 실제 인증 우회가 불가능
const eb = cfg.attacks.collision.effectiveBits;
const COLLISION_PROFILES = {
  md5:      { hashBits: 128, effectiveBits: eb.md5,      isVulnerable: true,  knownAttack: 'Wang et al. (2004) — Differential Cryptanalysis' },
  sha256:   { hashBits: 256, effectiveBits: eb.sha256,   isVulnerable: true,  knownAttack: 'No known practical attack — Birthday Bound applies' },
  sha512:   { hashBits: 512, effectiveBits: eb.sha512,   isVulnerable: true,  knownAttack: 'No known practical attack — Birthday Bound applies' },
  bcrypt:   { hashBits: 128, effectiveBits: eb.bcrypt,   isVulnerable: false, knownAttack: 'N/A — KDF design prevents collision exploitation' },
  scrypt:   { hashBits: 256, effectiveBits: eb.scrypt,   isVulnerable: false, knownAttack: 'N/A — Salted KDF, collision has no exploitable impact' },
  argon2id: { hashBits: 256, effectiveBits: eb.argon2id, isVulnerable: false, knownAttack: 'N/A — DIAM design with mandatory unique salt per hash' },
};

// ─── 하드웨어별 해시 속도 매핑 (crypto_standards.json의 GPU 기준 값 사용) ──
// 충돌 공격은 GPU/ASIC 기반 병렬 연산이 핵심이므로 GPU 해시 속도를 기준으로 함
const getCollisionRate = (algorithm, hardware) => {
  const rates = HASH_RATES[algorithm] || HASH_RATES.md5;
  if (hardware === 'quantum') return rates.quantum;
  // ASIC, GPU Cluster, Cloud Farm은 GPU 속도 기준으로 하드웨어 계수 적용
  const hwMultiplier = cfg.attacks.collision.hwMultiplier;
  const mul = hwMultiplier[hardware] || 1.0;
  return rates.gpu * mul;
};

// ─── Birthday Paradox 기반 충돌 생성 필요 연산 수 계산 ──────────────────
// k ≈ 1.177 × 2^(effectiveBits/2)
// JavaScript의 Number는 2^53 이상 정밀도 손실이 있으므로
// 2^39 이하는 정상 계산, 이상은 Infinity로 처리 (포맷팅에서 ∞ 처리)
const calcBirthdayOps = (effectiveBits) => {
  if (effectiveBits > 52) return Infinity; // Number 정밀도 초과 → 사실상 무한
  return 1.177 * Math.pow(2, effectiveBits / 2);
};

// ─── 충돌 생성 예상 시간 계산 ────────────────────────────────────────────
// collisionSec = 2^effectiveBits / hashRate
// effectiveBits > 52이면 Math.pow(2, effectiveBits)가 Infinity로 수렴하므로
// 큰 값에는 로그 기반 계산 적용
const calcCollisionSec = (effectiveBits, hashRate) => {
  if (effectiveBits >= 100) return Infinity; // 우주적 스케일 → formatSeconds가 ∞ 처리
  const ops = Math.pow(2, effectiveBits);
  return ops / hashRate;
};

// ─── 충돌 전용 등급 판정 ─────────────────────────────────────────────────
// pwLen과 Salt는 충돌 공격에서 완전히 무관 — 알고리즘만이 변수
const gradeFromCollision = (isVulnerable, collisionSec, algorithm) => {
  // [Case 1] 구조적으로 충돌 공격이 해당되지 않는 알고리즘
  if (!isVulnerable) return { grade: 'S', penalties: [] };

  const ceiling = ALGO_CEILING[algorithm] || 'S';
  const penalties = [];

  let grade;
  if      (!isFinite(collisionSec) || collisionSec > 1e10) grade = 'S';
  else if (collisionSec > 3.15e7)   grade = 'A'; // 1년 초과
  else if (collisionSec > 86400)    grade = 'B'; // 1일 초과
  else if (collisionSec > 3600)     grade = 'C'; // 1시간 초과
  else if (collisionSec > 60)       grade = 'D'; // 1분 초과
  else                              grade = 'F'; // 즉각 위험

  // ALGO_CEILING 적용 (MD5는 최대 D등급)
  const gradeIdx    = GRADE_ORDER.indexOf(grade);
  const ceilingIdx  = GRADE_ORDER.indexOf(ceiling);
  if (gradeIdx > ceilingIdx) {
    grade = ceiling;
    if (algorithm === 'md5') {
      penalties.push('알고리즘 설계 결함: MD5는 2004년 Wang et al.의 차분 분석으로 충돌 저항성이 완전히 파쇄되었습니다.');
    }
  }

  if (grade === 'F' || grade === 'D') {
    penalties.push(`충돌 저항성 붕괴: ${algorithm.toUpperCase()}의 해시 충돌을 현실적인 시간 내에 생성할 수 있습니다.`);
    penalties.push('데이터 무결성 위협: 동일 해시를 가진 악성 데이터로 서명 및 무결성 검증을 우회할 수 있습니다.');
  }

  return { grade, penalties };
};

// ─── 메인 분석 로직 ──────────────────────────────────────────────────────
const analyze = (data) => {
  const { shieldConfig, hardware } = data;
  const algorithm = shieldConfig.algorithm;

  const profile = COLLISION_PROFILES[algorithm] || COLLISION_PROFILES.md5;
  const { hashBits, effectiveBits, isVulnerable, knownAttack } = profile;

  // 1. [Process] 터미널 로그 생성
  const logs = [
    `[Collision Attack] 대상 알고리즘: ${algorithm.toUpperCase()} (${hashBits}-bit hash)`,
    `[Collision Attack] 분석 모드: Birthday Paradox 기반 충돌 생성 가능성 산출`,
  ];

  // 2. [Physics] 충돌 생성 시간 계산
  const hashRate     = getCollisionRate(algorithm, hardware);
  const collisionSec = calcCollisionSec(effectiveBits, hashRate);
  const birthdayOps  = calcBirthdayOps(effectiveBits);
  const collisionLabel = formatSeconds(collisionSec);

  // 3. [Logic] 알고리즘 취약성 분기
  if (!isVulnerable) {
    logs.push(`[Collision Attack] 구조적 면역 확인: ${algorithm.toUpperCase()}은(는) 충돌 공격의 개념이 적용되지 않는 설계입니다.`);
    logs.push(`[Collision Attack] 이유: Key Derivation Function(KDF)은 비밀번호 검증에 전용 비교 함수를 사용하므로 충돌값이 있어도 인증 우회 불가능.`);
  } else if (!isFinite(collisionSec) || collisionSec > 1e10) {
    logs.push(`[Collision Attack] 충돌 저항성 검증: ${algorithm.toUpperCase()} — ${effectiveBits}비트 복잡도`);
    logs.push(`[Collision Attack] 현실적 불가 판정: 필요 연산 수가 우주적 스케일을 초과합니다.`);
    logs.push(`[Collision Attack] 알려진 공격: ${knownAttack}`);
  } else {
    logs.push(`[Collision Attack] ⚠ 취약점 감지: ${knownAttack}`);
    logs.push(`[Collision Attack] 실제 충돌 복잡도: 2^${effectiveBits} 연산 (Birthday 이론: 2^${hashBits / 2}에서 단축)`);
    logs.push(`[Collision Attack] ${hardware} 기준 충돌 생성 예상 시간: ${collisionLabel}`);
  }

  // 4. [Judgment] 등급 판정
  const { grade, penalties } = gradeFromCollision(isVulnerable, collisionSec, algorithm);
  const score = scoreFromSeconds(grade);

  logs.push(`[Collision Attack] 최종 판정: 충돌 저항 등급 ${grade} | 예상 충돌 생성 시간: ${collisionLabel}`);

  // 5. [Synthesis] 표준 리포트 데이터 구성
  const engineResult = {
    grade,
    score,
    algorithm,
    hardware,
    isVulnerable,
    hashBits,
    effectiveBits,
    collisionSec,
    collisionLabel,
    birthdayOps: isFinite(birthdayOps) ? birthdayOps.toExponential(2) : '∞',
    knownAttack,
    gradeLabel: collisionLabel, // 템플릿 호환
    attackVector: `Collision Attack | Birthday Paradox | ${hardware}`,
    cryptoAnalysis: `Algorithm: ${algorithm.toUpperCase()} | Hash Bits: ${hashBits} | Effective Complexity: 2^${effectiveBits} | Collision Time: ${collisionLabel}`,
    penalties,
    simulationLogs: logs,
  };

  return generateReport('collision_attack', engineResult);
};

module.exports = { id: 'collision_attack', analyze };