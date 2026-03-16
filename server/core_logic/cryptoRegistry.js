/**
 * ShieldBox.io - Crypto Registry (Final Version)
 * [위치] server/core_logic/cryptoRegistry.js
 * [역할] JSON 설정 파일로부터 알고리즘 성능 지표 및 공격 기술 데이터를 로드하여 제공
 */

// 1. 데이터 폴더 내의 알고리즘 표준 지표 JSON 로드
// 경로가 server/data/configs/crypto_standards.json을 바라보도록 설정되어 있습니다.
const standards = require('../data/configs/crypto_standards.json');

/**
 * 2. 통합 데이터 익스포트
 * 각 엔진(physicsEngine, attackCore 등)에서 필요한 상수를 표준화된 이름으로 제공합니다.
 */
module.exports = {
  // 하드웨어별 초당 해시 속도 (H/s)
  HASH_RATES:         standards.hash_rates,
  
  // 알고리즘별 가중치 및 강도 지표
  ALGO_STRENGTH:      standards.algo_strength,
  
  // 보안 정책에 따른 알고리즘별 등급 상한선 (Ceiling)
  ALGO_CEILING:       standards.algo_ceiling,
  
  // 공격 기법별 탐색 효율성 승수
  ATTACK_MULTIPLIERS: standards.attack_multipliers,
};