/**
 * K-Shield Logic v7.3 — Deterministic Edition
 * 수정: [이슈1] 단어1개 심볼 중간 삽입 / [이슈2] customWords 빈값 방어
 * 추가: [안전장치] 80bits 미만 시 랜덤 단어 자동 보강 + UI 알림 데이터
 * 개선: [특수문자] 경계만 → 단어 내부(1/3지점) + 경계 동시 삽입으로 밀도 향상
 *
 * 핵심 원칙:
 * 1. 결정론: 같은 입력 + 같은 옵션 = 항상 같은 출력
 *    → Math.random()은 단어 선택 / 안전장치 보강에서만 허용
 * 2. 순수 두벌식 변환: K-Leet 제거, 변환의 명확성 유지
 * 3. 사용자 직접 입력 지원: 내장 사전 + 커스텀 단어 모두 처리
 * 4. 안전장치: 80bits(A등급) 미만이면 기준 충족까지 랜덤 단어 자동 추가
 */


/* ═══════════════════════════════════════════════════
   1. 두벌식 매핑 테이블
═══════════════════════════════════════════════════ */
const HANGUL_MAP = {
  'ㄱ':'r', 'ㄲ':'R', 'ㄴ':'s', 'ㄷ':'e', 'ㄸ':'E',
  'ㄹ':'f', 'ㅁ':'a', 'ㅂ':'q', 'ㅃ':'Q', 'ㅅ':'t',
  'ㅆ':'T', 'ㅇ':'d', 'ㅈ':'w', 'ㅉ':'W', 'ㅊ':'c',
  'ㅋ':'z', 'ㅌ':'x', 'ㅍ':'v', 'ㅎ':'g',
  'ㅏ':'k', 'ㅐ':'o', 'ㅑ':'i', 'ㅒ':'O', 'ㅓ':'j',
  'ㅔ':'p', 'ㅕ':'u', 'ㅖ':'P', 'ㅗ':'h', 'ㅛ':'y',
  'ㅜ':'n', 'ㅠ':'b', 'ㅡ':'m', 'ㅣ':'l',
  'ㅘ':'hk', 'ㅙ':'ho', 'ㅚ':'hl',
  'ㅝ':'nj', 'ㅞ':'np', 'ㅟ':'nl', 'ㅢ':'ml',
};

const COMPLEX_JONGSEONG = {
  'ㄳ':['ㄱ','ㅅ'], 'ㄵ':['ㄴ','ㅈ'], 'ㄶ':['ㄴ','ㅎ'],
  'ㄺ':['ㄹ','ㄱ'], 'ㄻ':['ㄹ','ㅁ'], 'ㄼ':['ㄹ','ㅂ'],
  'ㄽ':['ㄹ','ㅅ'], 'ㄾ':['ㄹ','ㅌ'], 'ㄿ':['ㄹ','ㅍ'],
  'ㅀ':['ㄹ','ㅎ'], 'ㅄ':['ㅂ','ㅅ'],
};

const SYMBOLS = ['!','@','#','$','%','^','&','*','(',')','-','_','+','='];

// 안전장치 기준
const MIN_ENTROPY = 80;  // A등급 — 이 미만이면 단어 자동 보강
const MAX_WORDS   = 5;   // 무한루프 방지 상한


/* ═══════════════════════════════════════════════════
   2. 단어 사전 (카테고리별 20개)
═══════════════════════════════════════════════════ */
export const K_DICTIONARY = {
  SCIENCE: [
    '도데실벤젠설폰산', '나트륨', '트리포스페이트', '쿼크', '엔트로피',
    '양자역학', '이벤트호라이즌', '슈뢰딩거', '하이젠베르크', '블랙홀',
    '중력파', '플랑크상수', '파울리배타원리', '초전도체', '반데르발스',
    '맥스웰방정식', '보어모형', '드브로이', '페르마원리', '카오스이론',
  ],
  INTENSE: [
    '떡볶이', '딱정벌레', '어깨너머', '쑥부쟁이', '뿔뿔이',
    '듬뿍듬뿍', '삐딱하게', '빡빡이', '꽃봉오리', '쫄깃쫄깃',
    '뚝딱뚝딱', '씩씩하게', '짝짝꿍', '빠릿빠릿', '똑똑하게',
    '꼬불꼬불', '쌩쌩하게', '빵빵하게', '씩씩이', '뚱뚱보',
  ],
  NATURE: [
    '박하사탕', '무지개', '안드로메다', '사건의지평선', '까마득한',
    '미리내', '노을빛', '소나기', '하늘바라기', '달무리',
    '은하수', '별똥별', '반딧불이', '파도소리', '바람개비',
    '솔바람', '구름다리', '물안개', '새벽이슬', '가을하늘',
  ],
  DAILY: [
    '삼겹살', '된장찌개', '비빔밥', '순대국밥', '김치찌개',
    '냉면', '불고기', '갈비탕', '닭볶음탕', '해물파전',
    '수박바', '참이슬', '허니버터', '뿌셔뿌셔', '꼬깔콘',
    '새우깡', '빼빼로', '초코파이', '홈런볼', '맛동산',
  ],
};


/* ═══════════════════════════════════════════════════
   3. 핵심 변환 엔진
═══════════════════════════════════════════════════ */

function disassemble(str) {
  const result = [];
  const BASE = 44032;

  for (const char of str) {
    const code = char.charCodeAt(0) - BASE;
    if (code < 0 || code > 11171) { result.push(char); continue; }

    const CHOSUNG  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    const JUNGSUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
    const JONGSUNG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

    const cho  = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;

    result.push(CHOSUNG[cho]);
    result.push(JUNGSUNG[jung]);

    if (JONGSUNG[jong]) {
      const jongChar = JONGSUNG[jong];
      if (COMPLEX_JONGSEONG[jongChar]) result.push(...COMPLEX_JONGSEONG[jongChar]);
      else result.push(jongChar);
    }
  }
  return result;
}

export function convertToRoman(word) {
  const jamos = disassemble(word);
  const mapped = jamos.map(j => HANGUL_MAP[j] ?? j).join('');
  return { mapped, length: mapped.length };
}


/* ═══════════════════════════════════════════════════
   4. 엔트로피 및 보안 분석
═══════════════════════════════════════════════════ */

function getCharsetSize(password) {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 32;
  return Math.max(size, 26);
}

function calcEntropy(password) {
  const R = getCharsetSize(password);
  const L = password.length;
  return Math.floor(L * Math.log2(R));
}

function formatCrackTime(seconds) {
  if (!isFinite(seconds) || seconds > 1e25) return '∞ (우주적 한계)';
  if (seconds < 1)           return '1초 미만';
  if (seconds < 60)          return `${Math.floor(seconds)}초`;
  if (seconds < 3600)        return `${Math.floor(seconds / 60)}분`;
  if (seconds < 86400)       return `${Math.floor(seconds / 3600)}시간`;
  if (seconds < 31536000)    return `${Math.floor(seconds / 86400)}일`;
  const years = seconds / 31536000;
  if (years < 10000)         return `${Math.floor(years).toLocaleString()}년`;
  if (years < 1e8)           return `${(years / 1e4).toFixed(1)}만년`;
  if (years < 1e12)          return `${(years / 1e8).toFixed(1)}억년`;
  return '∞ (현실적 한계)';
}

function getBenchmarks(entropy) {
  const combinations = Math.pow(2, entropy);
  return [
    { name: 'RTX 4090 (단독)',   opsPerSec: 1e10, icon: '🖥️' },
    { name: 'GPU 클러스터 (8×)', opsPerSec: 8e10, icon: '⚡' },
    { name: '해커 봇넷',         opsPerSec: 1e13, icon: '🌐' },
    { name: 'NSA급 슈퍼컴',      opsPerSec: 1e17, icon: '🏛️' },
  ].map(({ name, opsPerSec, icon }) => {
    const seconds = combinations / opsPerSec / 2;
    return {
      name, icon, seconds,
      label: formatCrackTime(seconds),
      isSafe: seconds > 86400 * 365,
    };
  });
}

function getStrengthLabel(entropy) {
  if (entropy >= 128) return { label: 'UNBREAKABLE', color: 'emerald', grade: 'S' };
  if (entropy >= 80)  return { label: 'VERY STRONG',  color: 'blue',    grade: 'A' };
  if (entropy >= 60)  return { label: 'STRONG',        color: 'indigo',  grade: 'B' };
  if (entropy >= 40)  return { label: 'MODERATE',      color: 'yellow',  grade: 'C' };
  return               { label: 'WEAK',          color: 'red',     grade: 'F' };
}


/* ═══════════════════════════════════════════════════
   5. 특수문자 주입 — 단어 경계 삽입
   결정론: 첫 단어 첫 글자 charCode를 seed로 사용
═══════════════════════════════════════════════════ */
function injectSymbols(segments, symbolSeed) {
  const pick = (offset) => SYMBOLS[(symbolSeed + offset) % SYMBOLS.length];
  let symIdx = 0; // 매 삽입마다 다른 특수문자를 결정론적으로 선택

  // 단어 내부 삽입: 7자 이상이면 1/3 지점에 특수문자 추가
  // → 경계 삽입만으로는 특수문자 비율이 너무 낮아지는 문제 해결
  function processWord(mapped) {
    if (mapped.length >= 7) {
      const pos = Math.floor(mapped.length / 3);
      return mapped.slice(0, pos) + pick(symIdx++) + mapped.slice(pos);
    }
    return mapped;
  }

  if (segments.length === 1) {
    const processed = processWord(segments[0].mapped);
    // 단어 내부 삽입이 됐으면 끝에 1개 추가, 짧으면 중간 삽입
    if (segments[0].mapped.length >= 7) {
      return processed + pick(symIdx++);
    }
    const mid = Math.floor(processed.length / 2);
    return processed.slice(0, mid) + pick(symIdx++) + processed.slice(mid);
  }

  // 단어 2개 이상: 각 단어 내부 처리 + 단어 경계에 삽입
  let result = '';
  segments.forEach((seg, i) => {
    result += processWord(seg.mapped);
    if (i < segments.length - 1) result += pick(symIdx++);
  });
  return result;
}


/* ═══════════════════════════════════════════════════
   6. 유틸리티
═══════════════════════════════════════════════════ */

export function getRandomWord(category = 'RANDOM') {
  const resolvedCategory = category === 'RANDOM'
    ? ['SCIENCE','INTENSE','NATURE','DAILY'][Math.floor(Math.random() * 4)]
    : category;
  const pool = K_DICTIONARY[resolvedCategory] ?? K_DICTIONARY.NATURE;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function previewConvert(koreanWord) {
  if (!koreanWord) return { mapped: '', entropy: 0, strength: getStrengthLabel(0) };
  const { mapped } = convertToRoman(koreanWord);
  const entropy = calcEntropy(mapped);
  return { mapped, entropy, strength: getStrengthLabel(entropy) };
}

export function describeEntropy(entropy) {
  const combinations = Math.pow(2, entropy);
  const yearsToBreak = (combinations / 2) / (1e13 * 31536000);
  return {
    entropy,
    combinations: combinations > 1e30 ? '10^' + Math.floor(Math.log10(combinations)) : combinations.toLocaleString(),
    yearsToBreak: formatCrackTime(yearsToBreak * 31536000),
    strength: getStrengthLabel(entropy),
  };
}


/* ═══════════════════════════════════════════════════
   7. 메인 생성 함수
═══════════════════════════════════════════════════ */

/**
 * @param {Object}   options
 * @param {string}   options.category       - 'SCIENCE'|'INTENSE'|'NATURE'|'DAILY'|'RANDOM'
 * @param {number}   options.wordCount       - 사전 모드 단어 수 (1~3)
 * @param {boolean}  options.includeSymbol   - 특수문자 삽입 여부
 * @param {string[]} options.customWords     - 사용자 직접 입력 단어 (있으면 사전 무시)
 */
export function generateKShieldPassword(options = {}) {
  const {
    category      = 'RANDOM',
    wordCount     = 2,
    includeSymbol = true,
    customWords   = [],
  } = options;

  // ── 1. 단어 선택 ───────────────────────────────────────────
  let selectedWords;

  if (customWords.length > 0) {
    // 사용자 직접 입력 — 빈 문자열/공백 필터링 후 사전으로 fallback
    selectedWords = customWords
      .map(w => w.trim())
      .filter(w => w.length > 0)
      .slice(0, 3);
  }

  if (!selectedWords || selectedWords.length === 0) {
    // 내장 사전에서 무작위 선택 (이 부분만 random 허용)
    const resolvedCategory = category === 'RANDOM'
      ? ['SCIENCE','INTENSE','NATURE','DAILY'][Math.floor(Math.random() * 4)]
      : category;
    const pool = K_DICTIONARY[resolvedCategory] ?? K_DICTIONARY.NATURE;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selectedWords = shuffled.slice(0, Math.min(wordCount, 3));
  }

  // ── 2. 두벌식 변환 (완전 결정론) ────────────────────────────
  const segments = selectedWords.map(word => {
    const { mapped, length } = convertToRoman(word);
    return { word, mapped, length };
  });

  // ── 3. 안전장치: 80bits 미만이면 랜덤 단어 추가 ──────────────
  //    특수문자 없는 상태로 미리 엔트로피 추정
  //    (특수문자 추가 시 charset +32 → 실제는 더 높아짐, 보수적 판단)
  const autoAdded = [];

  {
    let previewEntropy = calcEntropy(segments.map(s => s.mapped).join(''));

    while (previewEntropy < MIN_ENTROPY && segments.length < MAX_WORDS) {
      // 이미 선택된 단어와 중복되지 않는 후보 선택
      const usedWords = new Set(segments.map(s => s.word));
      let candidate;
      let attempts = 0;
      do {
        candidate = getRandomWord();
        attempts++;
      } while (usedWords.has(candidate) && attempts < 20);

      const { mapped, length } = convertToRoman(candidate);
      segments.push({ word: candidate, mapped, length });
      autoAdded.push(candidate);

      previewEntropy = calcEntropy(segments.map(s => s.mapped).join(''));
    }
  }

  // ── 4. 특수문자 삽입 ─────────────────────────────────────────
  let password;
  const symbolSeed = segments[0].word.charCodeAt(0);

  if (includeSymbol) {
    password = injectSymbols(segments, symbolSeed);
  } else {
    password = segments.map(s => s.mapped).join('');
  }

  // ── 5. 분석 ──────────────────────────────────────────────────
  const entropy  = calcEntropy(password);
  const strength = getStrengthLabel(entropy);

  const charsetInfo = {
    hasLower:    /[a-z]/.test(password),
    hasUpper:    /[A-Z]/.test(password),
    hasSymbol:   /[^a-zA-Z0-9]/.test(password),
    charsetSize: getCharsetSize(password),
  };

  const mnemonic = {
    instruction: `한글 입력 모드를 끄고, ${segments.map(s=>s.word).join(' → ')} 를 그대로 영문 키보드로 타이핑하세요.`,
    breakdown: segments.map(seg => ({
      korean:  seg.word,
      english: seg.mapped,
      length:  seg.length,
    })),
  };

  return {
    password,
    words:    segments.map(s => s.word),
    segments,

    analysis: {
      entropy,
      length: password.length,
      strength,
      charsetInfo,
      charsetSize: charsetInfo.charsetSize,
    },

    benchmarks: getBenchmarks(entropy),
    mnemonic,

    // 안전장치 발동 정보 (UI 알림용)
    autoAdded,                       // 자동 추가된 단어 배열 (빈 배열이면 발동 안 됨)
    wasGuarded: autoAdded.length > 0, // boolean — UI에서 알림 표시 여부
  };
}