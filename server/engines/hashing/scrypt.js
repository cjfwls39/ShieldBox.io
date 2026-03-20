/**
 * ShieldBox.io - Scrypt Hashing Engine (Physics Fixed)
 * [위치] server/engines/hashing/scrypt.js
 * [수정 사항] 
 * 1. 🚨 [BUG FIX] 메모리 연산 공식 수정 (MB 설정값과 실제 N 파라미터 동기화)
 * 2. 서버 안전을 위한 maxmem 제한 수치 현실화
 */

const crypto = require('crypto');
const cfg    = require('../../config/shield-config');
const { promisify } = require('util');

// Node.js의 내장 scrypt 함수를 Promise 기반으로 변환하여 비동기 처리를 지원합니다.
const scrypt = promisify(crypto.scrypt);

/**
 * Scrypt 해시 연산 실행
 * @param {string} pw - 평문 비밀번호
 * @param {object} config - 사용자 설정 (memoryCost, blockSize, parallelism, usePepper 등)
 */
const run = async (pw, config) => {
    try {
        // 1. Pepper 결합
        // 사용자가 Pepper를 활성화했다면 평문 뒤에 결합하여 1차 방어선을 구축합니다.
        const targetInput = config.usePepper && config.pepperValue 
            ? pw + config.pepperValue 
            : pw;

        // 2. Salt 생성 (16바이트 무작위 데이터)
        // Scrypt는 레인보우 테이블 방어를 위해 사용자별 고유 Salt가 필수입니다.
        const salt = crypto.randomBytes(16).toString('hex');

        /**
         * 3. Scrypt 옵션 설정
         * 🚨 [BUG FIX]
         * Scrypt의 메모리 사용량 공식: 128 * N * r * p (바이트)
         * r=8(기본값)일 때, 128 * N * 8 = 1024 * N입니다.
         * 즉, N을 (MB * 1024)로 설정해야 사용자가 의도한 메모리(MB)가 정확히 점유됩니다.
         */
        const targetMB = config.memoryCost || cfg.hashing.scrypt.defaultMemoryCostMB;
        const options = {
            // UI 슬라이더 수치(MB)를 2의 거듭제곱인 N 파라미터로 정밀 변환
            N: Math.pow(2, Math.floor(Math.log2(targetMB * 1024))), 
            r: config.blockSize || cfg.hashing.scrypt.defaultBlockSize,
            p: config.parallelism || cfg.hashing.scrypt.defaultParallelism,
            // config에서 관리 (기본 256MB — Koyeb 512MB 환경 기준)
            maxmem: cfg.hashing.scrypt.maxMemBytes
        };

        // 4. 실제 해시 연산 수행 (64바이트 길이의 결과물 생성)
        const derivedKey = await scrypt(targetInput, salt, cfg.hashing.scrypt.outputBytes, options);

        const hash = derivedKey.toString('hex');

        // 5. 결과 반환 (검증기 및 분석 엔진용 표준 포맷)
        // N, r, p 파라미터와 솔트를 포함하여 나중에 동일한 조건으로 검증할 수 있게 합니다.
        return `scrypt$${options.N}$${options.r}$${options.p}$${salt}$${hash}`;
    } catch (error) {
        throw new Error(`Scrypt 엔진 연산 중 오류 발생: ${error.message}`);
    }
};

module.exports = {
    id: 'scrypt',
    run
};