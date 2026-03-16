/**
 * ShieldBox.io - SHA-256 (PBKDF2) Hashing Engine
 * [위치] server/engines/hashing/sha256.js
 * [특징] 
 * 1. PBKDF2 표준을 사용하여 CPU 기반 반복 연산(Key Stretching) 수행
 * 2. 해시 결과에 반복 횟수와 솔트를 포함하여 나중에 검증 가능하도록 설계
 */

const crypto = require('crypto');
const { promisify } = require('util');

// Node.js의 내장 pbkdf2 함수를 Promise 기반으로 변환하여 비동기 처리를 지원합니다.
const pbkdf2 = promisify(crypto.pbkdf2);

/**
 * SHA-256 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (iterations, useSalt, usePepper 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper 결합
        // 사용자가 Pepper를 활성화했다면 평문 뒤에 결합하여 데이터베이스 유출 시에도 안전성을 제공합니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        // 2. Salt 처리
        // 레인보우 테이블 방어를 위해 16바이트(128비트) 무작위 솔트를 생성합니다.
        const salt = config.useSalt 
            ? crypto.randomBytes(16).toString('hex') 
            : "";

        // 3. PBKDF2 기반 반복 해싱 연산
        // - iterations: 사용자가 UI 슬라이더로 조절한 값 (예: 100,000회) 반영
        // - keylen: 32 (SHA-256의 출력 길이인 256비트/32바이트 생성)
        // - digest: 'sha256' 알고리즘 명시
        const derivedKey = await pbkdf2(
            targetInput, 
            salt, 
            config.iterations || 100000, 
            32, 
            'sha256'
        );

        const hash = derivedKey.toString('hex');

        // 4. 결과 반환 (분석 엔진 및 검증기용 표준 포맷)
        // i={반복횟수}와 s={솔트}를 명확히 기록하여 hashInspector가 나중에 이를 재구성할 수 있게 합니다.
        return `sha256$i=${config.iterations || 100000}$s=${salt}$${hash}`;
    } catch (error) {
        throw new Error(`SHA-256 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'sha256',
    run
};