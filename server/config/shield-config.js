/**
 * ShieldBox.io — Master Configuration
 * [위치] server/config/shield-config.js
 *
 * ██████████████████████████████████████████████████████
 *   이 파일 하나만 수정하면 서버 전체 동작이 바뀝니다.
 *   코드를 뒤지지 마세요. 숫자는 여기서만 관리합니다.
 * ██████████████████████████████████████████████████████
 *
 * 참조처:
 *   server.js, engines/hashing/*.js, engines/attacks/*.js
 *   core_logic/physicsEngine.js, core_logic/securityJudge.js
 *   data/configs/crypto_standards.json, physical_benchmarks.json
 */

'use strict';

const cfg = {

  /* ══════════════════════════════════════════════════════════
     1. SERVER — 기본 서버 환경
  ══════════════════════════════════════════════════════════ */
  server: {
    port:        process.env.PORT         || 4000,
    host:        process.env.HOST         || '0.0.0.0',   // Koyeb 필수
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    env:         process.env.NODE_ENV     || 'development',
  },

  /* ══════════════════════════════════════════════════════════
     2. SIMULATION — 시뮬레이션 동작
     출처: server.js
  ══════════════════════════════════════════════════════════ */
  simulation: {
    logDelayMs: 200,   // 공격 로그가 한 줄씩 출력되는 간격 (ms)
  },

  /* ══════════════════════════════════════════════════════════
     3. HASHING DEFAULTS — 엔진별 기본 파라미터
     출처: engines/hashing/*.js, physicsEngine.js
  ══════════════════════════════════════════════════════════ */
  hashing: {

    bcrypt: {
      defaultCostFactor: 12,      // physicsEngine 기준값과 동일하게 유지
      maxCostFactor:     14,      // 이 이상은 서버 응답이 수 초 초과
    },

    scrypt: {
      defaultMemoryCostMB: 32,    // UI 슬라이더 기본값 (MB)
      defaultBlockSize:    8,     // r 파라미터
      defaultParallelism:  1,     // p 파라미터
      outputBytes:         64,    // 해시 결과 바이트 길이
      // ⚠️  Render 무료 플랜 기준 — RSS 70MB 베이스, 안전 상한 64MB
      maxMemBytes:         64 * 1024 * 1024,   // 64MB
      // 사용자 요청 memoryCost 상한 (MB) — 이 이상이면 강제 하향
      maxMemoryCostMB:     64,
    },

    argon2: {
      defaultMemoryCostMB: 32,    // memoryCost (MB) — Render 무료 기준 절반으로 하향
      defaultTimeCost:     3,     // 반복 횟수 (iterations)
      defaultParallelism:  4,     // 병렬 스레드 수
      // 사용자 요청 상한 — 이 이상이면 강제 하향
      maxMemoryCostMB:     64,
      maxTimeCost:         5,
    },

    sha: {
      defaultIterations: 100_000, // physicsEngine 기준값 (PBKDF2 반복 횟수)
    },

  },

  /* ══════════════════════════════════════════════════════════
     4. PHYSICS ENGINE — 크랙 시간 계산 기준값
     출처: core_logic/physicsEngine.js
     ※ physicsEngine.js의 getParamPenalty 기준 분모값
  ══════════════════════════════════════════════════════════ */
  physics: {
    baseline: {
      bcrypt:   { costFactor: 12 },
      argon2id: { memoryCostMB: 64, timeCost: 3, parallelism: 4 },
      scrypt:   { memoryCostMB: 32 },
      sha:      { iterations: 100_000 },
    },
    credentialStuffingDbSize: 14_000_000_000,  // 다크웹 유출 DB 평균 건수
  },

  /* ══════════════════════════════════════════════════════════
     5. SECURITY JUDGE — 등급 산출 임계치 & 점수
     출처: data/configs/security_policy.json, securityJudge.js
  ══════════════════════════════════════════════════════════ */
  judge: {
    gradeThresholds: {
      S: 3_153_600_000,   // 100년 초과
      A: 31_536_000,      // 1년 초과
      B: 86_400,          // 1일 초과
      C: 3_600,           // 1시간 초과
      D: 60,              // 1분 초과
      // F: 60초 이하
    },
    scoreMapping: {
      S: 98,
      A: 90,
      B: 75,
      C: 55,
      D: 30,
      F: 5,
    },
    gradeOrder: ['F', 'D', 'C', 'B', 'A', 'S'],
    passwordLength: {
      criticalMinimum:   8,   // 이 미만 → 즉시 F등급
      recommendedMinimum: 10, // 이 미만 → 1등급 하향 패널티
    },
  },

  /* ══════════════════════════════════════════════════════════
     6. ATTACK ENGINES — 공격별 세부 파라미터
     출처: engines/attacks/*.js
  ══════════════════════════════════════════════════════════ */
  attacks: {

    bruteForce: {
      charsetSize:       72,       // a-z + A-Z + 0-9 + 특수문자
      realtimeMaxLen:    6,        // 실시간 충돌 테스트 대상 최대 길이
      realtimeMaxTries:  500_000,  // 실시간 테스트 최대 시도 횟수
    },

    dictionary: {
      defaultWordlistSize: 20_000,  // UI 기본 사전 크기
    },

    maskAttack: {
      // intensity 점수 → 탐색 공간 압축률 (%)
      reductionRate: {
        high:   99.9,   // intensity > 7
        medium: 85.0,   // intensity > 4
        low:    40.0,   // 그 외
      },
      // intensity 임계치 → 등급 Cap
      gradeCap: {
        threshold: 7,   // 이 이상이면 최대 C등급
        maxGrade: 'C',
      },
    },

    ruleBased: {
      crackTimeMultiplier: {
        match:   0.05,  // 단어 발견 시 brute_force 대비 효율
        noMatch: 0.60,  // 미발견 시
      },
      recoveryRate: {
        found:    '99.0',
        notFound: '15.0',
      },
    },

    collision: {
      // Birthday Paradox 기반 실효 충돌 복잡도 (bits)
      effectiveBits: {
        md5:      39,   // Wang et al.(2004) 차분 분석으로 단축된 값
        sha256:   128,  // 알려진 실용적 공격 없음 → Birthday Bound
        sha512:   256,
        bcrypt:   128,
        scrypt:   256,
        argon2id: 256,
      },
      // 충돌 공격 하드웨어 승수 (gpu_cluster = 1.0 기준)
      hwMultiplier: {
        single_cpu:  0.06,
        gpu_single:  0.45,
        gpu_cluster: 1.00,
        asic:        3.50,
        cloud_farm:  2.00,
      },
    },

    credentialStuffing: {
      // 기저 재사용 확률 공식: max(baseMin, baseMax - pwLen * lenWeight)
      probBase: {
        baseMin:   5,
        baseMax:   50,
        lenWeight: 2,
      },
      // 신호A — 문자 다양성 페널티 (점수)
      diversityPenalty: {
        oneKind: 30,
        twoKind: 15,
      },
      // 신호B — 반복/순차 패턴 페널티
      repetitionPenalty: {
        sameChar:    25,
        numSequence: 20,
        alphaSeq:    15,
        max:         40,
      },
      // 신호C — 개인정보 패턴 페널티
      personalInfoPenalty: {
        phoneNumber: 35,
        birthdate:   30,
        yearInclude: 10,
        pureDigit8:  25,
        max:         50,
      },
      // 신호D — 구조 예측성 페널티
      structurePenalty: {
        lengthExempt: 18,  // 이 이상이면 구조 페널티 면제
        max:          20,
      },
      // suffix 패턴 가산점
      suffixBonus: 20,
      // 등급 결정 임계치
      gradeThreshold: {
        D: 50,   // prob >= 50 → D
        C: 30,   // prob >= 30 → C
        A_minLen: 14,  // len >= 14 && prob < 15 → A
        A_maxProb: 15,
      },
    },

    sideChannel: {
      // 샘플 수 공식: 10^((intensity/2) + 2)
      sampleExponentBase: 2,   // intensity=0 → 10^2 = 100 샘플
      // 성공 확률 → 등급 임계치
      gradeThreshold: {
        S: 0.05,
        A: 0.20,
        B: 0.50,
        C: 0.80,
        // else → D
      },
    },

  },

  /* ══════════════════════════════════════════════════════════
     7. HASH RATES — 하드웨어별 초당 해시 속도 (H/s)
     출처: data/configs/crypto_standards.json
  ══════════════════════════════════════════════════════════ */
  hashRates: {
    md5:      { pc: 1_000_000_000,   gpu: 16_400_000_000,  quantum: 100_000_000_000_000 },
    sha256:   { pc:   500_000_000,   gpu:  3_500_000_000,  quantum:  10_000_000_000_000 },
    sha512:   { pc:   200_000_000,   gpu:  3_500_000_000,  quantum:  10_000_000_000_000 },
    bcrypt:   { pc:           100,   gpu:          5_000,  quantum:          10_000_000 },
    scrypt:   { pc:            50,   gpu:            500,  quantum:           1_000_000 },
    argon2id: { pc:            10,   gpu:             50,  quantum:             500_000 },
  },

  /* ══════════════════════════════════════════════════════════
     8. ALGO CEILING — 알고리즘별 보안 등급 상한
     출처: data/configs/crypto_standards.json
  ══════════════════════════════════════════════════════════ */
  algoCeiling: {
    md5:      'D',
    sha256:   'B',
    sha512:   'B',
    bcrypt:   'S',
    scrypt:   'S',
    argon2id: 'S',
  },

  /* ══════════════════════════════════════════════════════════
     9. ATTACK MULTIPLIERS — 공격 기법별 탐색 효율 승수
     출처: data/configs/crypto_standards.json
  ══════════════════════════════════════════════════════════ */
  attackMultipliers: {
    brute_force:          1.0,
    rainbow_table:        1e-8,
    mask_attack:          0.001,
    rule_based:           0.005,
    side_channel:         0.01,
    credential_stuffing:  1e-9,
    dictionary:           1.0,
    collision_attack:     1.0,
  },

  /* ══════════════════════════════════════════════════════════
     10. ALGO STRENGTH — 알고리즘 강도 지수
     출처: data/configs/crypto_standards.json
  ══════════════════════════════════════════════════════════ */
  algoStrength: {
    md5:      1e-9,
    sha256:   0.1,
    sha512:   0.2,
    bcrypt:   0.9,
    scrypt:   1.0,
    argon2id: 1.0,
  },

  /* ══════════════════════════════════════════════════════════
     11. TIMING PROFILES — Side-Channel 타이밍 프로파일
     출처: data/configs/physical_benchmarks.json
  ══════════════════════════════════════════════════════════ */
  timingProfiles: {
    algorithms: {
      md5:      { baseDeltaT: 5.25,   vulnerabilityType: 'Early Return (Byte-by-byte)',  description: '가장 단순한 비교 로직을 사용하여 비트별 시간 편차가 큽니다.' },
      sha256:   { baseDeltaT: 4.82,   vulnerabilityType: 'Early Return (Standard Lib)',  description: '표준 라이브러리의 비교 연산 중 발생하는 타이밍 정보 노출이 확인되었습니다.' },
      sha512:   { baseDeltaT: 4.51,   vulnerabilityType: 'Early Return (Standard Lib)',  description: 'SHA-256과 유사한 타이밍 취약점을 가지고 있습니다.' },
      bcrypt:   { baseDeltaT: 1.15,   vulnerabilityType: 'Internal State Leak',          description: '연산 부하가 크지만, 최종 비교 단계에서 미세한 신호가 발생합니다.' },
      scrypt:   { baseDeltaT: 1.12,   vulnerabilityType: 'Internal State Leak',          description: '메모리 하드 함수 특성상 신호가 매우 작으나 여전히 존재합니다.' },
      argon2id: { baseDeltaT: 0.0001, vulnerabilityType: 'Constant-Time Enforced',       description: '데이터 독립적 메모리 접근 및 상수 시간 연산으로 신호 누출이 사실상 불가능합니다.' },
      default:  { baseDeltaT: 5.0,    vulnerabilityType: 'Generic Timing Leak',          description: '일반적인 해싱 알고리즘에서 나타나는 평균적인 시간 편차입니다.' },
    },
    hardware: {
      pc:          { sigmaNoise: 4.2, precisionLabel: 'Standard PC Environment' },
      gpu_cluster: { sigmaNoise: 1.8, precisionLabel: 'High-Performance GPU Cluster' },
      cloud_farm:  { sigmaNoise: 0.8, precisionLabel: 'Isolated Analysis Instance' },
      quantum:     { sigmaNoise: 0.1, precisionLabel: 'Quantum-Level Precision Measurement' },
    },
  },

  /* ══════════════════════════════════════════════════════════
     12. GUARD — 메모리 세이프가드 & 서킷 브레이커 임계치
     출처: (신규) 2단계에서 memoryGuard.js가 이 값을 참조
  ══════════════════════════════════════════════════════════ */
  guard: {
    memory: {
      // 총 힙 기준 — 이 이상이면 요청 파라미터를 안전 수준으로 하향
      safeguardThreshold:  0.70,   // 70%
      // 이 이상이면 분석 요청 자체를 차단 (서킷 브레이커)
      circuitBreakerThreshold: 0.85,  // 85% (기획안 90% → 512MB 환경에서 보수적으로 하향)
      // 서킷 브레이커 해제 대기 시간 (ms)
      cooldownMs: 10_000,
    },
    rateLimit: {
      // start_attack 소켓 이벤트 — IP당 제한
      attackMaxPerWindow: 5,
      attackWindowMs:     60_000,  // 1분
      // start_hashing — 상대적으로 느슨하게
      hashMaxPerWindow:   20,
      hashWindowMs:       60_000,
    },
  },

};

module.exports = cfg;