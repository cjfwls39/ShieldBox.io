/**
 * ShieldBox.io - Intelligence Wordlist Generator v2
 *
 * [설계 원칙]
 * 1. 기저 단어 다양성 최우선 — 변형은 isInWordlist가 자동 처리하므로
 *    사전은 "다양한 기저 단어"를 담는 데 집중
 * 2. 실제 유출 DB 기반 — RockYou, HaveIBeenPwned, SecLists 상위권 반영
 * 3. 한국 맥락 강화 — 연예인/지역/서비스/군대/음식/인터넷 속어
 * 4. leet_variants 카테고리 제거 — wordlist.js의 restoreLeet()이 자동 처리
 * 5. 20자 초과 항목 제거 — 실제 사람이 기억해서 쓰는 암호 범위
 * 6. 카테고리 간 최종 중복 제거 — 탐지 정확도 보장
 * 7. numbers_dates는 구조 패턴 중심 — credentialStuffing의 신호와 역할 분리
 *
 * [변형 규칙 설계]
 * suffix 30개: 실제 유출 DB 통계 기반 가장 흔한 접미사 패턴
 * Capitalize: 첫 글자 대문자 (가장 흔한 암호 생성 습관)
 * ALLCAPS: 전체 대문자 (시스템 계정/임시암호에 많음)
 * 20자 초과 자동 필터링
 */

const fs = require('fs');

// ─────────────────────────────────────────────────────────────
// 변형 규칙
// ─────────────────────────────────────────────────────────────

// 실제 유출 DB 통계 기반 가장 흔한 접미사 패턴 (기존 10개 → 30개)
const SUFFIXES = [
  // 숫자 단순
  '1', '12', '123', '1234', '12345',
  // 연도
  '2023', '2024', '2025', '2026',
  // 특수문자
  '!', '!!', '!@#', '@', '#', '.',
  // 숫자+특수
  '1!', '123!', '1234!', '123#',
  // 흔한 숫자 조합
  '000', '007', '111', '777', '999',
  // 한국 특화
  '01', '0101', 'qwer',
];

/**
 * 기초 단어 리스트에 변형 규칙 적용
 * - 소문자 원형
 * - 첫 글자 대문자
 * - 전체 대문자 (시스템/임시 계정 패턴)
 * - 각각에 suffix 조합
 * - 20자 초과 자동 제거
 */
const applyRules = (baseList) => {
  const results = new Set();

  baseList.forEach(word => {
    const lower = word.toLowerCase();
    const cap   = lower.charAt(0).toUpperCase() + lower.slice(1);
    const upper = lower.toUpperCase();

    // 원형 3가지
    [lower, cap, upper].forEach(variant => {
      if(variant.length <= 20) results.add(variant);

      // suffix 조합
      SUFFIXES.forEach(s => {
        const combined = `${variant}${s}`;
        if(combined.length <= 20) results.add(combined);
      });
    });
  });

  return Array.from(results).sort();
};

// ─────────────────────────────────────────────────────────────
// 카테고리별 기저 데이터
// ─────────────────────────────────────────────────────────────

// [1] 흔한 비밀번호 — RockYou / HaveIBeenPwned / SecLists 상위권 기반
const COMMON_PASSWORDS = [
  // 절대 상위권
  'password', 'qwerty', 'qwer', 'admin', 'welcome', 'login', 'master', 'secret',
  'access', 'changeme', 'letmein', 'testing', 'default', 'pass',
  // 감성/인기 단어
  'iloveyou', 'sunshine', 'princess', 'dragon', 'monkey', 'shadow',
  'superman', 'batman', 'spider', 'naruto', 'pokemon', 'pikachu',
  'football', 'baseball', 'soccer', 'hockey', 'basketball',
  // SNS/서비스명
  'facebook', 'instagram', 'twitter', 'google', 'netflix', 'youtube',
  'linkedin', 'myspace', 'adobe', 'apple', 'microsoft', 'amazon',
  'discord', 'tiktok', 'twitch', 'steam',
  // 흔한 단어 조합형
  'abc', 'abcd', 'abcde', 'abcdef',
  'letmein', 'trustno1', 'monkey1', 'dragon1',
  'passw0rd', 'p@ssword',
  // 한국 서비스
  'naver', 'kakao', 'coupang', 'baemin', 'toss',
  'samsung', 'hyundai', 'lg', 'sk', 'kt',
  // 임시/테스트 계정
  'root', 'toor', 'guest', 'user', 'test', 'demo', 'dev', 'admin1',
  'administrator', 'superuser', 'service', 'support',
  // 기타 상위권
  'rockyou', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  'hello', 'world', 'flower', 'butter', 'cheese', 'cookie',
  'lovely', 'angel', 'devil', 'jesus', 'christ', 'god',
  'thunder', 'lightning', 'storm', 'fire', 'ice',
  'golden', 'silver', 'diamond', 'ruby', 'alpha', 'omega',
  'michael', 'jessica', 'ashley', 'charlie', 'andrew',
];

// [2] 영단어 — 테마별 다양성 (동물/자연/게임/IT/감정)
const ENGLISH_WORDS = [
  // 동물
  'tiger', 'lion', 'eagle', 'wolf', 'bear', 'shark', 'dolphin', 'falcon',
  'panther', 'cobra', 'viper', 'hawk', 'raven', 'phoenix', 'dragon',
  'panda', 'koala', 'jaguar', 'cheetah', 'gorilla',
  // 자연
  'water', 'fire', 'earth', 'wind', 'storm', 'cloud', 'thunder',
  'mountain', 'ocean', 'river', 'forest', 'desert', 'island', 'valley',
  'star', 'moon', 'sun', 'galaxy', 'comet', 'nebula',
  'winter', 'summer', 'autumn', 'spring',
  // 색상
  'blue', 'green', 'black', 'white', 'red', 'gold', 'silver',
  'purple', 'crimson', 'violet', 'amber', 'scarlet',
  // 감정/추상
  'happy', 'love', 'hope', 'dream', 'magic', 'power', 'glory',
  'brave', 'fierce', 'noble', 'shadow', 'ghost', 'legend',
  'freedom', 'victory', 'destiny', 'eternal', 'infinite',
  // 전투/판타지
  'warrior', 'hunter', 'ranger', 'wizard', 'knight', 'captain',
  'blade', 'sword', 'shield', 'arrow', 'flame', 'frost',
  'samurai', 'viking', 'ninja', 'pirate', 'rebel', 'rogue',
  'titan', 'golem', 'demon', 'angel',
  // IT/사이버
  'cyber', 'digital', 'matrix', 'system', 'network', 'server',
  'hacker', 'crypto', 'binary', 'quantum', 'plasma', 'laser',
  'robot', 'android', 'virus', 'trojan', 'cipher',
  // 게임
  'sonic', 'mario', 'zelda', 'halo', 'doom', 'quake', 'diablo',
  'warcraft', 'starcraft', 'minecraft', 'fortnite', 'valorant',
  // 음식
  'apple', 'banana', 'orange', 'grape', 'peach', 'cherry', 'lemon',
  'coffee', 'sugar', 'honey', 'butter', 'cookie', 'candy',
];

// [3] 이름 — 글로벌 + 한국 이름 로마자
const NAMES = [
  // 영미권 남성
  'james', 'john', 'robert', 'michael', 'william', 'david', 'richard',
  'joseph', 'thomas', 'charles', 'christopher', 'daniel', 'matthew',
  'anthony', 'donald', 'mark', 'paul', 'steven', 'george', 'kenneth',
  'andrew', 'joshua', 'kevin', 'brian', 'edward', 'ronald', 'timothy',
  'jason', 'jeffrey', 'ryan', 'jacob', 'gary', 'nicholas', 'eric',
  'stephen', 'jonathan', 'larry', 'justin', 'scott', 'brandon',
  // 영미권 여성
  'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth',
  'susan', 'jessica', 'sarah', 'karen', 'nancy', 'lisa', 'betty',
  'margaret', 'ashley', 'emily', 'kimberly', 'amanda', 'melissa',
  'stephanie', 'samantha', 'rachel', 'hannah', 'chelsea', 'amanda',
  // 한국 성씨 로마자
  'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon',
  'jang', 'lim', 'han', 'oh', 'seo', 'shin', 'kwon', 'hwang',
  'ahn', 'song', 'hong', 'jeon', 'ko', 'moon', 'yang', 'son',
  // 한국 이름 로마자 (흔한 이름)
  'minjun', 'jihun', 'junho', 'jungwoo', 'minsoo', 'jisoo', 'minsu',
  'seongjun', 'hyunwoo', 'dongwoo', 'seungwoo', 'taehyun', 'jaewon',
  'minji', 'jiyeon', 'jiyoon', 'seoyeon', 'seojun', 'yuna', 'chaeyeon',
  'jieun', 'hyunjin', 'sooyeon', 'haerin', 'dahyun', 'nayeon',
  // 성씨+이름 조합
  'kimjun', 'leejun', 'parkjun', 'choijun', 'jungmin', 'kangmin',
  // 글로벌 성씨
  'smith', 'jones', 'williams', 'brown', 'taylor', 'davies', 'evans',
  'wilson', 'johnson', 'walker', 'wright', 'thompson', 'white',
];

// [4] 한국어 발음 표기 — 대폭 강화
const KOREAN_ROMANIZED = [
  // 감정/일상
  'sarang', 'haengbok', 'annyeong', 'gamsahamnida', 'mianhae',
  'bogoshipda', 'saranghae', 'joahae', 'silhae', 'bulsang',
  'daebak', 'hwaiting', 'jinjja', 'heol', 'aigoo', 'eotteokhae',
  'gwenchana', 'arasso', 'mollayo', 'mworago', 'waeyo',
  'michin', 'baboya', '멍청이romanized', 'hajima', 'gaseo',
  // 지역명
  'hanguk', 'korea', 'seoul', 'busan', 'incheon', 'daegu',
  'gwangju', 'daejeon', 'ulsan', 'suwon', 'goyang', 'seongnam',
  'bucheon', 'cheongju', 'ansan', 'jeonju', 'cheonan', 'jeju',
  'gangnam', 'hongdae', 'sinchon', 'itaewon', 'insadong',
  'namsan', 'hangang', 'bukhansan', 'gyeongbokgung',
  // 음식
  'kimchi', 'bibimbap', 'bulgogi', 'samgyupsal', 'tteokbokki',
  'japchae', 'galbi', 'doenjang', 'ramyeon', 'gimbap', 'sundae',
  'chimaek', 'soju', 'makgeolli', 'sikhye', 'patbingsu',
  // 기업/서비스
  'samsung', 'hyundai', 'lg', 'sk', 'kt', 'lotte',
  'naver', 'kakao', 'coupang', 'baemin', 'toss', 'line',
  'kakaotalk', 'naverblog', 'instagrammer',
  // 연예인/문화 (그룹명)
  'bts', 'exo', 'twice', 'blackpink', 'bigbang', 'shinee',
  'iu', 'taeyeon', 'yoona', 'suzy', 'hyuna',
  'kpop', 'kdrama', 'webtoon', 'manhwa', 'hallyu',
  // 게임/인터넷 용어
  'nexon', 'ncsoft', 'maplestory', 'lineage', 'suddenattack',
  'lol', 'pubg', 'overwatch', 'battleground',
  'gamer', 'noob', 'pro', 'hacker', 'cheat',
  // 군대 관련 (한국 남성 특화)
  'roka', 'rokn', 'rokaf', 'army', 'navy', 'airforce',
  'military', 'soldier', 'recruit', 'sergeant', 'captain',
  'gunbari', 'ildung', 'ibdae', 'jeonwi', 'byeong',
  // 학교/학번 패턴
  'hakbun', 'student', 'school', 'university', 'college',
  'yonsei', 'korea', 'snu', 'kaist', 'postech',
  // 인터넷 속어
  'gg', 'lol', 'wtf', 'omg', 'brb', 'afk', 'irl',
  'kkk', 'ㅋㅋㅋ', 'heuheu', 'kekeke',
];

// [5] 키보드 패턴 — 한글 자판 로마자 포함
const KEYBOARD_BASES = [
  // 가로 행 패턴
  'qwerty', 'qwertyuiop', 'asdfgh', 'asdfghjkl', 'zxcvbn', 'zxcvbnm',
  // 세로 열 패턴
  'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm', 'qazwsx', 'qazwsxedc',
  '1qaz', '2wsx', '3edc', '1qaz2wsx', '1qaz2wsx3edc',
  // 대각선
  'qweasd', 'asdqwe', 'zxcasd', 'qweasdzxc',
  // 역방향
  'ytrewq', 'lkjhgfdsa', 'mnbvcxz', 'poiuytrewq',
  // 숫자행+문자 조합
  '1q2w3e', '1q2w3e4r', '1q2w3e4r5t', 'q1w2e3r4', 'q1w2e3r4t5',
  // 반복/연속
  'aaa', 'aaaaaa', 'aaaaaaa', '111', '1111', '11111111',
  'abc', 'abcd', 'abcde', 'abcdef', 'abcdefg',
  '123', '1234', '12345', '123456', '1234567', '12345678',
  // 한글 자판 로마자 (두벌식)
  // 한글 "ㅂㅈㄷㄱ" 행 = 영자 qwerty 위치에서 치면
  'rkskdmld',  // 사랑한다
  'dkssudgktpdy',  // 사랑해요 (근사치)
  'tnals',    // 비밀
  'qkrtjdwls', // 현지
  'wjdqh',   // 왜요
  'dyswkdtk', // 보고싶다
  // 숫자패드
  '147258369', '789456123', '159357',
  // 기타 흔한 패턴
  'passpass', 'testtest', '112233', '121212',
  '123123', '321321', '654321', '987654321',
];

// 키보드 패턴은 자체 + 역방향 + 주요 suffix 적용
// (qwer2024, qwerty123 같은 흔한 조합 커버)
const KEYBOARD_SUFFIXES = ['1', '123', '!', '2024', '2025', '12', '1234'];

const generateKeyboardPatterns = () => {
  const results = new Set();
  KEYBOARD_BASES.forEach(p => {
    if(p.length <= 20) {
      results.add(p);
      results.add(p.split('').reverse().join('')); // 역방향
      // 첫글자 대문자
      const cap = p.charAt(0).toUpperCase() + p.slice(1);
      if(cap.length <= 20) results.add(cap);
      // 주요 suffix 조합 (짧은 패턴에만 — 20자 초과 방지)
      if(p.length <= 12) {
        KEYBOARD_SUFFIXES.forEach(s => {
          const combined = `${p}${s}`;
          if(combined.length <= 20) results.add(combined);
        });
      }
    }
  });
  return Array.from(results).sort();
};

// [6] 숫자/날짜 — 한국 특화 구조 패턴 중심
// (credentialStuffing의 personalInfoPenalty 정규식 신호와 역할 분리:
//  정규식은 "전화번호/생년월일 구조"를 잡고,
//  사전은 "실제로 많이 쓰이는 숫자 조합"을 직접 보유)
const generateNumbersDates = () => {
  const results = new Set();

  // 연도 단독 (1970~2030)
  for(let y = 1970; y <= 2030; y++) {
    results.add(String(y));
  }

  // 연도+월일 (주요 연도만)
  const popularYears = ['1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000'];
  const months = ['01','06','12'];
  const days   = ['01','15'];
  popularYears.forEach(y => {
    months.forEach(m => {
      days.forEach(d => {
        const ym   = `${y}${m}`;
        const ymd  = `${y}${m}${d}`;
        const mmdd = `${m}${d}`;
        [ym, ymd, mmdd].forEach(v => {
          if(v.length <= 20) results.add(v);
        });
      });
    });
  });

  // 한국 특화 숫자 패턴
  const koreanSpecial = [
    // 행운/불행의 수
    '1004', '8282', '1212', '0000', '9999', '5959', '7979', '4242',
    '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888',
    // 군번 패턴 (8자리)
    '00000000', '11111111', '12345678', '87654321',
    // 학번 패턴 (20XX + 순번)
    '20200001', '20210001', '20220001', '20230001', '20240001',
    // 전화번호 패턴 (일부)
    '01000000000', '01012345678', '01087654321',
    '0101234', '0107777', '0108888',
    // 우편번호/지역코드
    '06141', '03000', '48058',
  ];
  koreanSpecial.forEach(v => {
    if(v.length <= 20) results.add(v);
  });

  // 반복 패턴
  ['12','123','1234','abc','ab'].forEach(base => {
    results.add(base + base);       // 1212, 123123
    results.add(base + base + base); // 121212
  });

  return Array.from(results).sort();
};

// ─────────────────────────────────────────────────────────────
// 조립 및 최종 처리
// ─────────────────────────────────────────────────────────────
function generateShieldBoxWordlist() {

  console.log('ShieldBox.io Wordlist Generator v2 시작...\n');

  const raw = {
    common_passwords: applyRules(COMMON_PASSWORDS),
    english_words:    applyRules(ENGLISH_WORDS),
    names:            applyRules(NAMES),
    korean_romanized: applyRules(KOREAN_ROMANIZED),
    keyboard_patterns:generateKeyboardPatterns(),
    numbers_dates:    generateNumbersDates(),
    // leet_variants 제거 — wordlist.js restoreLeet()이 자동 처리
  };

  // ── 카테고리 간 중복 제거 ──────────────────────────────────
  // 우선순위: common > english > names > korean > keyboard > numbers
  const finalData = {};
  const globalSeen = new Set();

  const priority = [
    'common_passwords',
    'english_words',
    'names',
    'korean_romanized',
    'keyboard_patterns',
    'numbers_dates',
  ];

  priority.forEach(cat => {
    const deduped = raw[cat].filter(w => !globalSeen.has(w));
    deduped.forEach(w => globalSeen.add(w));
    finalData[cat] = deduped;
  });

  // ── 통계 출력 ──────────────────────────────────────────────
  const totalCount = Object.values(finalData).reduce((a, c) => a + c.length, 0);
  const baseCounts = {
    common_passwords: COMMON_PASSWORDS.length,
    english_words:    ENGLISH_WORDS.length,
    names:            NAMES.length,
    korean_romanized: KOREAN_ROMANIZED.length,
    keyboard_patterns:KEYBOARD_BASES.length,
    numbers_dates:    '자동생성',
  };

  console.log('카테고리별 결과:');
  priority.forEach(cat => {
    const base = baseCounts[cat];
    const count = finalData[cat].length;
    console.log(`  ${cat.padEnd(22)}: 기저 ${String(base).padStart(3)}개 → ${count.toLocaleString().padStart(5)}개`);
  });
  console.log(`\n  ${'총계'.padEnd(22)}: ${totalCount.toLocaleString()}개`);
  console.log(`  ${'(중복 제거 후)'.padEnd(22)}: ${new Set(Object.values(finalData).flat()).size.toLocaleString()}개`);

  // ── 파일 저장 ──────────────────────────────────────────────
  try {
    fs.writeFileSync('words.json', JSON.stringify(finalData, null, 2), 'utf-8');
    console.log('\n\x1b[32m✔ SUCCESS: words.json 생성 완료\x1b[0m');
  } catch(err) {
    console.error('\x1b[31m✘ ERROR:', err.message, '\x1b[0m');
  }
}

generateShieldBoxWordlist();
