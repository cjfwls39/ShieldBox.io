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

    // 알고리즘별 커스텀 포맷에 따른 솔트 위치 탐색
    if (algorithm === 'md5') {
      saltVal = parts[1]?.replace('s=', '') || '';
    } else if (algorithm === 'sha256' || algorithm === 'sha512') {
      saltVal = parts[2]?.replace('s=', '') || '';
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
 */
const verifyHash = (candidate, targetHash, algorithm, config = {}) => {
  // 내장 솔트 알고리즘은 실시간 대입 검증 속도가 너무 느려 시뮬레이션에서 제외합니다.
  if (ALWAYS_HAS_SALT.has(algorithm) || !targetHash) return false;
  
  try {
    const input = config.usePepper && config.pepperValue ? candidate + config.pepperValue : candidate;
    
    if (algorithm === 'md5') {
      const parts = targetHash.split('$');
      const salt = parts[1]?.replace('s=', '') || '';
      const expected = Buffer.from(crypto.createHash('md5').update(input + salt).digest('hex'), 'hex');
      const actual = Buffer.from(parts[2] || '', 'hex');
      // 나노초 단위 시간 차를 이용한 타이밍 공격 방어
      return crypto.timingSafeEqual(actual, expected);
    }
    
    if (algorithm === 'sha256' || algorithm === 'sha512') {
      const parts = targetHash.split('$');
      const iterations = parseInt(parts[1]?.replace('i=', '') || '100000');
      const salt = parts[2]?.replace('s=', '') || '';
      const digest = algorithm === 'sha256' ? 'sha256' : 'sha512';
      const keylen = algorithm === 'sha256' ? 32 : 64;
      
      const expected = crypto.pbkdf2Sync(input, salt, iterations, keylen, digest);
      const actual = Buffer.from(parts[3] || '', 'hex');
      return crypto.timingSafeEqual(actual, expected);
    }
  } catch {
    return false;
  }
  return false;
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