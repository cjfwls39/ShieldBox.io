/**
 * ShieldBox.io - Argon2id Hashing Engine (State-of-the-Art)
 * [위치] server/engines/hashing/argon2.js
 * [특징] 
 * 1. 2015 암호 해싱 대회(PHC) 우승 알고리즘으로, 현존하는 가장 강력한 보안성 제공
 * 2. 사이드 채널 공격 방어(Argon2i)와 GPU 공격 방어(Argon2d)의 장점을 결합한 'id' 모드 사용
 */

const argon2 = require('argon2');

/**
 * Argon2id 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (memoryCost, timeCost, parallelism, usePepper 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper 결합 (Zero-Knowledge 보안 레이어)
        // 사용자가 입력한 Pepper 값을 평문 뒤에 결합하여 데이터베이스 유출 시에도 안전성을 보장합니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        /**
         * 2. Argon2id 상세 옵션 구성
         * - memoryCost: MB 단위를 라이브러리 표준인 KiB로 변환 (예: 64MB -> 65536KiB)
         * - timeCost: 반복 횟수 (Iterations)
         * - parallelism: 병렬 연산에 사용할 스레드 수
         * - type: 보안성이 가장 검증된 argon2id 모드 강제 적용
         */
        const options = {
            memoryCost: (config.memoryCost || 64) * 1024, 
            timeCost: config.timeCost || 3,
            parallelism: config.parallelism || 4,
            type: argon2.argon2id 
        };

        // 3. 실제 해시 연산 수행
        // argon2 라이브러리는 내부적으로 고유 Salt 생성을 처리하며,
        // 결과값에 알고리즘 버전, 파라미터, 솔트 정보를 모두 포함한 표준 포맷을 반환합니다.
        const hash = await argon2.hash(targetInput, options);

        // 4. 결과 반환 (예: $argon2id$v=19$m=65536,t=3,p=4$...)
        // hashInspector.js와 sideChannel.js 분석 시 이 포맷을 기반으로 보안성을 판정합니다.
        return hash;
    } catch (error) {
        throw new Error(`Argon2id 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'argon2id',
    run
};