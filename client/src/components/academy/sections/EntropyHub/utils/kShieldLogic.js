/**
 * K-Shield Logic v7.3 — Deterministic Edition (Mnemonic Refined)
 * 원본 변환 및 보안 로직(v7.3)을 100% 보존하며 가이드 문구만 자모 단위로 정밀화했습니다.
 */

/* ═══════════════════════════════════════════════════
   1. 두벌식 매핑 테이블 (원본 유지)
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
  'ㄳ':['ㄱ','ㅅ'], 'ㄴ':['ㄴ'], 'ㄵ':['ㄴ','ㅈ'], 'ㄶ':['ㄴ','ㅎ'],
  'ㄺ':['ㄹ','ㄱ'], 'ㄻ':['ㄹ','ㅁ'], 'ㄼ':['ㄹ','ㅂ'],
  'ㄽ':['ㄹ','ㅅ'], 'ㄾ':['ㄹ','ㅌ'], 'ㄿ':['ㄹ','ㅍ'],
  'ㅀ':['ㄹ','ㅎ'], 'ㅄ':['ㅂ','ㅅ'],
};

const SYMBOLS = ['!','@','#','$','%','^','&','*','(',')','-','_','+','='];
const MIN_ENTROPY = 80;
const MAX_WORDS   = 5;

export const K_DICTIONARY = {
  SCIENCE: ['도데실벤젠설폰산', '나트륨', '트리포스페이트', '쿼크', '엔트로피', '양자역학', '이벤트호라이즌', '슈뢰딩거', '하이젠베르크', '블랙홀', '중력파', '플랑크상수', '파울리배타원리', '초전도체', '반데르발스', '맥스웰방정식', '보어모형', '드브로이', '페르마원리', '카오스이론'],
  INTENSE: ['떡볶이', '딱정벌레', '어깨너머', '쑥부쟁이', '뿔뿔이', '듬뿍듬뿍', '삐딱하게', '빡빡이', '꽃봉오리', '쫄깃쫄깃', '뚝딱뚝딱', '씩씩하게', '짝짝꿍', '빠릿빠릿', '똑똑하게', '꼬불꼬불', '쌩쌩하게', '빵빵하게', '씩씩이', '뚱뚱보'],
  NATURE: ['박하사탕', '무지개', '안드로메다', '사건의지평선', '까마득한', '미리내', '노을빛', '소나기', '하늘바라기', '달무리', '은하수', '별똥별', '반딧불이', '파도소리', '바람개비', '솔바람', '구름다리', '물안개', '새벽이슬', '가을하늘'],
  DAILY: ['삼겹살', '된장찌개', '비빔밥', '순대국밥', '김치찌개', '냉면', '불고기', '갈비탕', '닭볶음탕', '해물파전', '수박바', '참이슬', '허니버터', '뿌셔뿌셔', '꼬깔콘', '새우깡', '빼빼로', '초코파이', '홈런볼', '맛동산'],
};

/* ═══════════════════════════════════════════════════
   2. 핵심 변환 엔진 (원본 유지)
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
    result.push(CHOSUNG[cho], JUNGSUNG[jung]);
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
   3. 특수문자 주입 (원본 로직 절대 보존)
═══════════════════════════════════════════════════ */

function injectSymbols(segments, symbolSeed) {
  const pick = (offset) => SYMBOLS[(symbolSeed + offset) % SYMBOLS.length];
  let symIdx = 0; 

  function processWord(mapped) {
    if (mapped.length >= 7) {
      const pos = Math.floor(mapped.length / 3);
      return mapped.slice(0, pos) + pick(symIdx++) + mapped.slice(pos);
    }
    return mapped;
  }

  if (segments.length === 1) {
    const processed = processWord(segments[0].mapped);
    if (segments[0].mapped.length >= 7) {
      return processed + pick(symIdx++);
    }
    const mid = Math.floor(processed.length / 2);
    return processed.slice(0, mid) + pick(symIdx++) + processed.slice(mid);
  }

  let result = '';
  segments.forEach((seg, i) => {
    result += processWord(seg.mapped);
    if (i < segments.length - 1) result += pick(symIdx++);
  });
  return result;
}

/* ═══════════════════════════════════════════════════
   4. 가이드 문구 정밀화 (반ㄷ -> & -> ㅔ)
═══════════════════════════════════════════════════ */

function getSplitWord(word, splitPos) {
  const jamos = disassemble(word);
  let currentLen = 0;
  let splitIdx = jamos.length;
  for (let i = 0; i < jamos.length; i++) {
    currentLen += (HANGUL_MAP[jamos[i]] || jamos[i]).length;
    if (currentLen >= splitPos) { splitIdx = i + 1; break; }
  }
  return { head: jamos.slice(0, splitIdx).join(''), tail: jamos.slice(splitIdx).join('') };
}

/* ═══════════════════════════════════════════════════
   5. 메인 생성 함수 (v7.3 원본 리턴 구조 보존)
═══════════════════════════════════════════════════ */

export function generateKShieldPassword(options = {}) {
  const { category = 'RANDOM', wordCount = 2, includeSymbol = true, customWords = [] } = options;
  let selectedWords = customWords.map(w => w.trim()).filter(w => w.length > 0).slice(0, 3);

  if (selectedWords.length === 0) {
    const resCat = category === 'RANDOM' ? ['SCIENCE','INTENSE','NATURE','DAILY'][Math.floor(Math.random() * 4)] : category;
    const pool = K_DICTIONARY[resCat] ?? K_DICTIONARY.NATURE;
    selectedWords = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(wordCount, 3));
  }

  const segments = selectedWords.map(word => {
    const { mapped, length } = convertToRoman(word);
    return { word, mapped, length };
  });

  const autoAdded = [];
  let previewEntropy = calcEntropy(segments.map(s => s.mapped).join(''));
  while (previewEntropy < MIN_ENTROPY && segments.length < MAX_WORDS) {
    const usedWords = new Set(segments.map(s => s.word));
    let candidate;
    let attempts = 0;
    do { candidate = getRandomWord(); attempts++; } while (usedWords.has(candidate) && attempts < 20);
    const { mapped, length } = convertToRoman(candidate);
    segments.push({ word: candidate, mapped, length });
    autoAdded.push(candidate);
    previewEntropy = calcEntropy(segments.map(s => s.mapped).join(''));
  }

  const symbolSeed = segments[0].word.charCodeAt(0);
  const password = includeSymbol ? injectSymbols(segments, symbolSeed) : segments.map(s => s.mapped).join('');
  const entropy  = calcEntropy(password);
  const strength = getStrengthLabel(entropy);

  // 가이드 문구(mnemonic) 생성 부분만 수정
  let guideParts = [];
  const pick = (offset) => SYMBOLS[(symbolSeed + offset) % SYMBOLS.length];
  let symIdx = 0;

  if (includeSymbol) {
    if (segments.length === 1) {
      const seg = segments[0];
      if (seg.mapped.length >= 7) {
        const pos = Math.floor(seg.mapped.length / 3);
        const { head, tail } = getSplitWord(seg.word, pos);
        guideParts.push(`'${head}'`, `[${pick(symIdx++)}]`, `'${tail}'`, `[${pick(symIdx++)}]`);
      } else {
        const mid = Math.floor(seg.mapped.length / 2);
        const { head, tail } = getSplitWord(seg.word, mid);
        guideParts.push(`'${head}'`, `[${pick(symIdx++)}]`, `'${tail}'`);
      }
    } else {
      segments.forEach((seg, i) => {
        if (seg.mapped.length >= 7) {
          const pos = Math.floor(seg.mapped.length / 3);
          const { head, tail } = getSplitWord(seg.word, pos);
          guideParts.push(`'${head}'`, `[${pick(symIdx++)}]`, `'${tail}'`);
        } else {
          guideParts.push(`'${seg.word}'`);
        }
        if (i < segments.length - 1) guideParts.push(`[${pick(symIdx++)}]`);
      });
    }
  } else {
    guideParts = segments.map(s => `'${s.word}'`);
  }

  const charsetInfo = {
    hasLower:    /[a-z]/.test(password),
    hasUpper:    /[A-Z]/.test(password),
    hasSymbol:   /[^a-zA-Z0-9]/.test(password),
    charsetSize: getCharsetSize(password),
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
    mnemonic: {
      instruction: guideParts.join(' → '),
      breakdown: segments.map(seg => ({ korean: seg.word, english: seg.mapped, length: seg.length })),
    },
    autoAdded,
    wasGuarded: autoAdded.length > 0,
  };
}

/* ═══════════════════════════════════════════════════
   기타 분석 로직 (원본 보존)
═══════════════════════════════════════════════════ */
function getCharsetSize(password) {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 32;
  return Math.max(size, 26);
}
function calcEntropy(password) { return Math.floor(password.length * Math.log2(getCharsetSize(password))); }
function formatCrackTime(seconds) {
  if (!isFinite(seconds) || seconds > 1e25) return '∞ (우주적 한계)';
  if (seconds < 1) return '1초 미만';
  const years = seconds / 31536000;
  if (years < 10000) return `${Math.floor(years).toLocaleString()}년`;
  return '∞ (현실적 한계)';
}
function getBenchmarks(entropy) {
  const combinations = Math.pow(2, entropy);
  return [
    { name: 'RTX 4090 (단독)', opsPerSec: 1e10, icon: '🖥️' },
    { name: '해커 봇넷', opsPerSec: 1e13, icon: '🌐' },
    { name: 'NSA급 슈퍼컴', opsPerSec: 1e17, icon: '🏛️' },
  ].map(b => {
    const s = combinations / b.opsPerSec / 2;
    return { name: b.name, icon: b.icon, label: formatCrackTime(s), isSafe: s > 86400 * 365 };
  });
}
function getStrengthLabel(entropy) {
  if (entropy >= 128) return { label: 'UNBREAKABLE', color: 'emerald', grade: 'S' };
  if (entropy >= 80)  return { label: 'VERY STRONG',  color: 'blue',    grade: 'A' };
  if (entropy >= 60)  return { label: 'STRONG',        color: 'indigo',  grade: 'B' };
  if (entropy >= 40)  return { label: 'MODERATE',      color: 'yellow',  grade: 'C' };
  return               { label: 'WEAK',          color: 'red',     grade: 'F' };
}
export function getRandomWord(category = 'RANDOM') {
  const pool = K_DICTIONARY[category] || K_DICTIONARY.NATURE;
  return pool[Math.floor(Math.random() * pool.length)];
}