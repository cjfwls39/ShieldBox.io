/**
 * ShieldBox.io - Hash Inspection Utility (Final Version)
 * [위치] server/core_logic/hashInspector.js
 * [역할] 해시 문자열 파싱, 솔트 추출 및 안전한 실시간 해시 일치 여부 검증
 */

const crypto = require('crypto');

/**
 * 1. 구조적 솔트 알고리즘 정의
 * Bcrypt, Scrypt, Argon2id는 설계상 솔트가 내장되어 있어 레인보우 테이블 공격이 불가능합니다.
 */
const ALWAYS_HAS_SALT = new Set(['bcrypt', 'scrypt', 'argon2id']);

/**
 * 2. 해시 문자열에서 솔트 존재 여부 및 값 추출
 *
 * md5 / sha256 / sha512는 모두 useHashEngine.js(클라이언트)가 만드는
 * `<algo>$<saltHex>$<digestHex>` 3등분 포맷을 그대로 따른다 (salt 미사용 시 saltHex는 빈 문자열).
 *
 * @param {string} targetHash - 분석 대상 해시 문자열
 * @param {string} algorithm - 사용된 알고리즘 ID
 * @returns {{ hasSalt: boolean, salt: string|null }}
 */
const parseSaltFromHash = (targetHash, algorithm) => {
  if (!targetHash) return { hasSalt: false, salt: null };

  try {
    // 현대적 알고리즘은 포맷 내부에 솔트가 표준으로 포함되거나 알고리즘이 강제합니다.
    if (algorithm === 'bcrypt' || algorithm === 'argon2id') {
      return { hasSalt: true, salt: 'internal' };
    }

    const parts = targetHash.split('$');
    let saltVal = '';

    if (algorithm === 'md5' || algorithm === 'sha256' || algorithm === 'sha512') {
      saltVal = parts[1] || '';
    } else if (algorithm === 'scrypt') {
      // scrypt$N$r$p$salt$hash 포맷 대응
      saltVal = parts[4] || '';
    }

    // 빈 문자열이 아니어야 실제 솔트가 존재하는 것으로 간주합니다.
    return { hasSalt: saltVal.length > 0, salt: saltVal || null };
  } catch {
    return { hasSalt: false, salt: null };
  }
};

/**
 * 3. 평문 후보와 타겟 해시의 일치 여부 검증
 * 보안을 위해 timingSafeEqual을 사용하여 정보 누출을 방지합니다.
 *
 * md5/sha256/sha512는 클라이언트(useHashEngine.js)가 실제로 만드는 해시와
 * 동일한 알고리즘·포맷으로 재계산해야 한다:
 *   - md5:           digest = md5(input + salt)                       (1회)
 *   - sha256/sha512:  digest = 반복 체이닝 — sha(sha(...(input+salt)))   (최대 1000회, PBKDF2 아님)
 */
const verifyHash = (candidate, targetHash, algorithm, config = {}) => {
  // 내장 솔트 알고리즘은 실시간 대입 검증 속도가 너무 느려 시뮬레이션에서 제외합니다.
  if (ALWAYS_HAS_SALT.has(algorithm) || !targetHash) return false;

  try {
    const input = config.usePepper && config.pepperValue ? candidate + config.pepperValue : candidate;
    const parts = targetHash.split('$');
    const salt  = parts[1] || '';
    const actual = Buffer.from(parts[2] || '', 'hex');

    let expected;

    if (algorithm === 'md5') {
      expected = Buffer.from(crypto.createHash('md5').update(input + salt).digest('hex'), 'hex');
    } else if (algorithm === 'sha256' || algorithm === 'sha512') {
      const loopCount = Math.min(config.iterations || 100000, 1000);
      let current = input + salt;
      for (let i = 0; i < loopCount; i++) {
        current = crypto.createHash(algorithm).update(current).digest('hex');
      }
      expected = Buffer.from(current, 'hex');
    } else {
      return false;
    }

    // 길이가 다르면 timingSafeEqual이 예외를 던지므로 명시적으로 먼저 걸러낸다.
    if (actual.length !== expected.length) return false;

    // 나노초 단위 시간 차를 이용한 타이밍 공격 방어
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
};

/**
 * 4. 실시간 해시 대입(Brute Force) 가능 여부 판단
 * 브라우저 환경이나 서버 부하를 고려해 6자 이하의 짧은 암호만 실제 검증을 수행합니다.
 */
const canActuallyVerify = (algorithm, pwLen) => 
  !ALWAYS_HAS_SALT.has(algorithm) && pwLen <= 6;

module.exports = {
  ALWAYS_HAS_SALT,
  parseSaltFromHash,
  verifyHash,
  canActuallyVerify,
};