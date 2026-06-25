/**
 * ShieldBox.io — Client-Side Hash Engine
 * [위치] client/src/hooks/useHashEngine.js
 *
 * hash-wasm을 사용하여 브라우저에서 직접 해싱 연산을 수행합니다.
 * 서버로는 해시값만 전달하고 평문은 네트워크를 타지 않습니다.
 */

import {
  argon2id,
  scrypt,
  bcrypt,
  md5,
  sha256,
  sha512,
  createMD5,
} from 'hash-wasm';

// ── 브라우저 환경 감지 ────────────────────────────────────────────────────
// navigator.deviceMemory: GB 단위 (Chrome만 지원, 없으면 undefined)
const getDeviceProfile = () => {
  const memory = navigator.deviceMemory; // GB
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  if (isMobile)           return 'mobile';
  if (!memory)            return 'desktop_mid'; // 알 수 없으면 중간으로
  if (memory >= 8)        return 'desktop_high';
  if (memory >= 4)        return 'desktop_mid';
  return 'desktop_low';
};

// ── 기기별 파라미터 안전 상한 ─────────────────────────────────────────────
const PARAM_LIMITS = {
  desktop_high: {
    scrypt:  { memoryCost: 256, blockSize: 32, parallelism: 8 },
    argon2:  { memoryCost: 512, timeCost: 10,  parallelism: 16 },
    bcrypt:  { costFactor: 16 },
  },
  desktop_mid: {
    scrypt:  { memoryCost: 128, blockSize: 16, parallelism: 4 },
    argon2:  { memoryCost: 256, timeCost: 5,   parallelism: 8 },
    bcrypt:  { costFactor: 14 },
  },
  desktop_low: {
    scrypt:  { memoryCost: 64,  blockSize: 8,  parallelism: 2 },
    argon2:  { memoryCost: 128, timeCost: 3,   parallelism: 4 },
    bcrypt:  { costFactor: 12 },
  },
  mobile: {
    scrypt:  { memoryCost: 32,  blockSize: 8,  parallelism: 1 },
    argon2:  { memoryCost: 64,  timeCost: 3,   parallelism: 4 },
    bcrypt:  { costFactor: 10 },
  },
};

// ── 파라미터 clamp ────────────────────────────────────────────────────────
const clampParams = (algorithm, config) => {
  const profile = getDeviceProfile();
  const limits  = PARAM_LIMITS[profile];
  const clamped = { ...config };
  const warnings = [];

  if (algorithm === 'scrypt') {
    const lim = limits.scrypt;
    // scrypt 실제 메모리 = 128 * N * r * p
    // N = 2^floor(log2(memoryCost * 1024))
    const calcActualMB = (mem, r, p) => {
      const N = Math.pow(2, Math.floor(Math.log2(mem * 1024)));
      return (128 * N * r * p) / 1024 / 1024;
    };

    if (clamped.memoryCost > lim.memoryCost) {
      warnings.push(`memoryCost ${clamped.memoryCost}MB → ${lim.memoryCost}MB`);
      clamped.memoryCost = lim.memoryCost;
    }
    if (clamped.blockSize > lim.blockSize) {
      warnings.push(`blockSize ${clamped.blockSize} → ${lim.blockSize}`);
      clamped.blockSize = lim.blockSize;
    }
    if (clamped.parallelism > lim.parallelism) {
      warnings.push(`parallelism ${clamped.parallelism} → ${lim.parallelism}`);
      clamped.parallelism = lim.parallelism;
    }

    // 조합 후 실제 메모리 재확인
    const actualMB = calcActualMB(
      clamped.memoryCost,
      clamped.blockSize  || 8,
      clamped.parallelism || 1
    );
    if (actualMB > lim.memoryCost * 2) {
      // blockSize * parallelism 조합이 여전히 위험하면 추가 하향
      clamped.blockSize   = 8;
      clamped.parallelism = 1;
      warnings.push(`조합 메모리 초과 → blockSize/parallelism 기본값으로 재조정`);
    }
  }

  if (algorithm === 'argon2id') {
    const lim = limits.argon2;
    if (clamped.memoryCost > lim.memoryCost) {
      warnings.push(`memoryCost ${clamped.memoryCost}MB → ${lim.memoryCost}MB`);
      clamped.memoryCost = lim.memoryCost;
    }
    if (clamped.timeCost > lim.timeCost) {
      warnings.push(`timeCost ${clamped.timeCost} → ${lim.timeCost}`);
      clamped.timeCost = lim.timeCost;
    }
    if (clamped.parallelism > lim.parallelism) {
      warnings.push(`parallelism ${clamped.parallelism} → ${lim.parallelism}`);
      clamped.parallelism = lim.parallelism;
    }
  }

  if (algorithm === 'bcrypt') {
    const lim = limits.bcrypt;
    if (clamped.costFactor > lim.costFactor) {
      warnings.push(`costFactor ${clamped.costFactor} → ${lim.costFactor}`);
      clamped.costFactor = lim.costFactor;
    }
  }

  return { clamped, warnings, profile };
};

// ── 랜덤 Salt 생성 헬퍼 ──────────────────────────────────────────────────
const randomBytes = (size) => {
  const buf = new Uint8Array(size);
  crypto.getRandomValues(buf);
  return buf;
};

const toHex = (buf) =>
  Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');

// ── 메인 해싱 함수 ────────────────────────────────────────────────────────
/**
 * 브라우저에서 직접 해싱을 수행합니다.
 *
 * @param {string} password  — 평문 비밀번호
 * @param {object} config    — 알고리즘 설정 (algorithm, memoryCost, costFactor 등)
 * @returns {Promise<{
 *   hash: string,
 *   algorithm: string,
 *   config: object,
 *   warnings: string[],
 *   profile: string,
 * }>}
 */
export const computeHash = async (password, config) => {
  const { algorithm, usePepper, pepperValue, ...params } = config;

  // 1. Pepper 결합
  const input = usePepper && pepperValue ? password + pepperValue : password;

  // 2. 파라미터 clamp (기기 사양 기준)
  const { clamped, warnings, profile } = clampParams(algorithm, params);

  // 3. 알고리즘별 해싱
  let hash;

  switch (algorithm) {

    case 'scrypt': {
      const memoryCost  = clamped.memoryCost  || 32;
      const blockSize   = clamped.blockSize   || 8;
      const parallelism = clamped.parallelism || 1;
      const salt        = randomBytes(16);

      // N = 2^floor(log2(memoryCost * 1024))
      const N = Math.pow(2, Math.floor(Math.log2(memoryCost * 1024)));

      const derived = await scrypt({
        password:    input,
        salt,
        costFactor:  N,
        blockSize,
        parallelism,
        hashLength:  64,
        outputType:  'hex',
      });

      hash = `scrypt$${N}$${blockSize}$${parallelism}$${toHex(salt)}$${derived}`;
      break;
    }

    case 'argon2id': {
      const memoryCost  = clamped.memoryCost  || 32;
      const timeCost    = clamped.timeCost    || 3;
      const parallelism = clamped.parallelism || 4;
      const salt        = randomBytes(16);

      hash = await argon2id({
        password:       input,
        salt,
        iterations:     timeCost,
        memorySize:     memoryCost * 1024, // MB → KiB
        parallelism,
        hashLength:     32,
        outputType:     'encoded',         // $argon2id$v=19$... 표준 포맷
      });
      break;
    }

    case 'bcrypt': {
      const costFactor = clamped.costFactor || 12;
      const salt       = randomBytes(16);

      hash = await bcrypt({
        password:   input,
        salt,
        costFactor,
        outputType: 'encoded',             // $2b$12$... 표준 포맷
      });
      break;
    }

    case 'sha256': {
      const useSalt   = config.useSalt !== false;
      const saltHex   = useSalt ? toHex(randomBytes(16)) : '';
      const iterations = clamped.iterations || 100000;

      // PBKDF2 방식 반복 (hash-wasm SHA-256 반복)
      let current = input + saltHex;
      for (let i = 0; i < Math.min(iterations, 1000); i++) {
        current = await sha256(current);
      }
      hash = `sha256$${saltHex}$${current}`;
      break;
    }

    case 'sha512': {
      const useSalt    = config.useSalt !== false;
      const saltHex    = useSalt ? toHex(randomBytes(16)) : '';
      const iterations = clamped.iterations || 100000;

      let current = input + saltHex;
      for (let i = 0; i < Math.min(iterations, 1000); i++) {
        current = await sha512(current);
      }
      hash = `sha512$${saltHex}$${current}`;
      break;
    }

    case 'md5': {
      const useSalt = config.useSalt !== false;
      const saltHex = useSalt ? toHex(randomBytes(16)) : '';
      const digest  = await md5(input + saltHex);
      hash = `md5$${saltHex}$${digest}`;
      break;
    }

    default:
      throw new Error(`지원하지 않는 알고리즘: ${algorithm}`);
  }

  return {
    hash,
    algorithm,
    // pepperValue는 salt와 동일하게 세션 동안만 쓰이는 값 — 서버에도 그대로 전달해야
    // 실시간 충돌 테스트(actualBruteForce)가 pepper를 반영해 검증할 수 있음
    config: { ...clamped, algorithm, usePepper, pepperValue },
    warnings,
    profile,
  };
};