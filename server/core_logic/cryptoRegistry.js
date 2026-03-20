/**
 * ShieldBox.io - Crypto Registry (Final Version)
 * [위치] server/core_logic/cryptoRegistry.js
 * [역할] JSON 설정 파일로부터 알고리즘 성능 지표 및 공격 기술 데이터를 로드하여 제공
 */

// 1. 마스터 config에서 모든 수치 로드 (crypto_standards.json → shield-config.js로 통합)
const cfg = require('../config/shield-config');

/**
 * 2. 통합 데이터 익스포트
 * 각 엔진(physicsEngine, attackCore 등)에서 필요한 상수를 표준화된 이름으로 제공합니다.
 */
module.exports = {
  HASH_RATES:         cfg.hashRates,
  ALGO_STRENGTH:      cfg.algoStrength,
  ALGO_CEILING:       cfg.algoCeiling,
  ATTACK_MULTIPLIERS: cfg.attackMultipliers,
};