/**
 * ShieldBox.io - MD5 Hashing Engine (Legacy/Deprecated)
 * [위치] server/engines/hashing/md5.js
 * [특징] 단일 라운드 해싱으로 연산 속도가 매우 빠르나 충돌 공격에 취약함
 */

const crypto = require('crypto');

/**
 * MD5 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (usePepper, pepperValue, useSalt 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper(추가 보안 키) 결합
        // 사용자가 Pepper를 활성화하고 값을 입력했다면 평문 뒤에 붙여 Zero-Knowledge를 강화합니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        // 2. Salt 처리
        // 레인보우 테이블 방어를 위해 8바이트 무작위 솔트를 생성합니다.
        // 솔트 미사용 설정 시 빈 문자열을 사용하며, 이는 보안 등급 하락의 원인이 됩니다.
        const salt = config.useSalt 
            ? crypto.randomBytes(8).toString('hex') 
            : "";

        // 3. MD5 단일 해시 연산 수행
        // MD5는 키 스트레칭(반복) 기능이 없으므로 즉시 결과가 도출됩니다.
        const hash = crypto
            .createHash('md5')
            .update(targetInput + salt)
            .digest('hex');

        // 4. 결과 반환 (분석 엔진 파싱용 표준 포맷)
        // 이 포맷은 hashInspector.js에서 솔트를 분리해내는 데 사용됩니다.
        return `md5$s=${salt}$${hash}`;
    } catch (error) {
        // 오류 발생 시 상위 server.js로 에러를 전달합니다.
        throw new Error(`MD5 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'md5',
    run
};