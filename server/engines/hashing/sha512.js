/**
 * ShieldBox.io - SHA-512 (PBKDF2) Hashing Engine
 * [위치] server/engines/hashing/sha512.js
 * [특징] 
 * 1. 512비트(64바이트) 결과물을 생성하여 SHA-256보다 더 높은 충돌 저항성 제공
 * 2. PBKDF2 반복 연산을 통해 오프라인 브루트포스 공격에 대한 시간적 장벽 구축
 */

const crypto = require('crypto');
const { promisify } = require('util');

// Node.js의 pbkdf2 함수를 Promise 기반으로 변환합니다.
const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * SHA-512 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (iterations, useSalt, usePepper 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper 결합
        // 비밀번호 뒤에 추가적인 비밀 키(Pepper)를 결합하여 데이터 유출 시의 2차 방어선을 형성합니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        // 2. Salt 처리
        // 사용자마다 고유한 16바이트 난수 솔트를 생성하여 레인보우 테이블 공격을 원천 차단합니다.
        const salt = config.useSalt 
            ? crypto.randomBytes(16).toString('hex') 
            : "";

        // 3. PBKDF2 기반 반복 해싱 연산 (SHA-512)
        // - iterations: UI에서 설정한 고부하 반복 횟수 반영 (최대 600,000회 권장)
        // - keylen: 64 (512비트 결과물 생성)
        // - digest: 'sha512'
        const derivedKey = await pbkdf2(
            targetInput, 
            salt, 
            config.iterations || 100000, 
            64, 
            'sha512'
        );

        const hash = derivedKey.toString('hex');

        // 4. 결과 반환 (분석기 및 hashInspector용 표준 포맷)
        // i=반복횟수와 s=솔트 정보를 포함하여 공격 엔진이 물리적 난이도를 정확히 측정하게 합니다.
        return `sha512$i=${config.iterations || 100000}$s=${salt}$${hash}`;
    } catch (error) {
        throw new Error(`SHA-512 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'sha512',
    run
};