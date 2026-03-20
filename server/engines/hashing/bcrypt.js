/**
 * ShieldBox.io - Bcrypt Hashing Engine
 * [위치] server/engines/hashing/bcrypt.js
 * [특징] 
 * 1. Adaptive Hashing: 하드웨어 발전에 맞춰 Cost Factor를 높여 보안 강도 유지 가능
 * 2. 내장 솔트: 해시 문자열 자체에 솔트가 포함되어 별도의 DB 필드가 필요 없음
 */

const bcrypt = require('bcryptjs');
const cfg    = require('../../config/shield-config');

/**
 * Bcrypt 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (costFactor, usePepper, pepperValue 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper 결합 로직
        // 사용자가 Pepper를 활성화하고 값을 입력했다면 비밀번호 뒤에 결합합니다.
        // 이는 데이터베이스가 유출되더라도 소스 코드 내의 Pepper 없이는 해독을 불가능하게 만드는 Zero-Knowledge 보안 레이어입니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        // 2. Salt 생성 및 Cost Factor 적용
        // - costFactor: 2^n회 반복을 의미하며, 1을 올릴 때마다 연산 시간이 2배로 증가합니다.
        // - physicsEngine.js의 기준값인 12를 기본값으로 사용합니다.
        const salt = await bcrypt.genSalt(config.costFactor || cfg.hashing.bcrypt.defaultCostFactor);

        // 3. 실제 해시 연산 수행
        // bcrypt는 내부적으로 salt를 해시 결과값($2b$12$...)에 포함시킵니다.
        const hash = await bcrypt.hash(targetInput, salt);

        // 4. 결과 반환
        // hashInspector.js는 이 결과값에서 알고리즘 정보와 솔트를 자동으로 식별합니다.
        return hash;
    } catch (error) {
        throw new Error(`Bcrypt 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'bcrypt',
    run
};