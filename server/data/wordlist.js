/**
 * ShieldBox.io - Hacker-Level Aggressive Wordlist Engine (Rank-Aware)
 * [위치] server/data/wordlist.js
 */

const CATEGORIES = require('./configs/words.json');

const RULES = {
  leet: { 
    'a': ['@', '4'], 'e': ['3'], 'i': ['1', '!'], 'o': ['0'], 
    's': ['$', '5'], 't': ['7', '+'], 'l': ['1', '|'], 'g': ['9', '6'] 
  },
  suffix: ['1', '12', '123', '1234', '!', '!!', '#', '2023', '2024', '2025', '2026', '01'],
  prefix: ['!', 'my', 'the', '1', 'admin', 'user'],
};

// 사전 전체 크기 미리 계산
const wl = {
  lists: CATEGORIES,
  set: new Set(Object.values(CATEGORIES).flat()),
  totalSize: Object.values(CATEGORIES).flat().length
};

/**
 * 특정 단어의 사전 내 통합 순위(Rank)를 찾습니다.
 */
const getWordRank = (word) => {
  let currentRank = 0;
  for (const list of Object.values(wl.lists)) {
    const idx = list.indexOf(word);
    if (idx !== -1) return currentRank + idx;
    currentRank += list.length;
  }
  return -1;
};

const restoreLeet = (text) => {
  let restored = text.toLowerCase();
  for (const [char, variants] of Object.entries(RULES.leet)) {
    variants.forEach(v => {
      const escapedV = v.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
      restored = restored.replace(new RegExp(escapedV, 'g'), char);
    });
  }
  return restored;
};

const stripSymbols = (text) => text.replace(/[^a-zA-Z0-9]/g, '');
const stripDigits = (text) => text.replace(/[0-9]/g, '');

const isInWordlist = (rawPw) => {
  if (!rawPw || rawPw.length < 3) return { found: false };

  console.log(`[Wordlist Engine] 분석 가동: "${rawPw}"`);

  // 시나리오 정의
  const candidates = [
    { val: rawPw, note: 'Direct' },
    { val: rawPw.toLowerCase(), note: 'Lowercase' },
    { val: restoreLeet(rawPw), note: 'Leet Restored' },
    { val: stripSymbols(rawPw), note: 'Symbols Stripped' },
    { val: stripSymbols(restoreLeet(rawPw)), note: 'Leet+Symbols' }
  ];

  for (const cand of candidates) {
    let current = cand.val;

    // 1단계: 가공 결과 즉시 확인
    if (current.length >= 3 && wl.set.has(current)) {
      return { 
        found: true, 
        word: current, 
        method: cand.note, 
        rank: getWordRank(current), 
        totalSize: wl.totalSize 
      };
    }

    // 2단계: 접미사 제거 분석
    for (const s of RULES.suffix) {
      if (current.endsWith(s)) {
        const peeled = current.slice(0, -s.length);
        if (peeled.length >= 3 && wl.set.has(peeled)) {
          return { 
            found: true, 
            word: peeled, 
            method: `Suffix Peel (${cand.note})`, 
            rank: getWordRank(peeled), 
            totalSize: wl.totalSize 
          };
        }
        // 2-1단계: suffix 제거 후 digit strip 2차 시도 (예: "Qwer2024!" → suffix "!" 제거 → "Qwer2024" → digit strip → "qwer")
        const peeledNoDigits = stripDigits(peeled).toLowerCase();
        if (peeledNoDigits.length >= 3 && wl.set.has(peeledNoDigits)) {
          return {
            found: true,
            word: peeledNoDigits,
            method: `Suffix+Digit Strip (${cand.note})`,
            rank: getWordRank(peeledNoDigits),
            totalSize: wl.totalSize
          };
        }
      }
    }

    // 3단계: 숫자 제거 분석
    const noDigits = stripDigits(current);
    if (noDigits.length >= 3 && noDigits !== current && wl.set.has(noDigits)) {
      return { 
        found: true, 
        word: noDigits, 
        method: `Digit Strip (${cand.note})`, 
        rank: getWordRank(noDigits), 
        totalSize: wl.totalSize 
      };
    }
  }

  return { found: false, totalSize: wl.totalSize };
};

module.exports = { isInWordlist, RULES };