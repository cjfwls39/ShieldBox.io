/**
 * ShieldBox.io - Full Spectrum Logic Validator
 * [구현 목표]
 * 1. 알고리즘 상세 설정(Cost, Memory, Iterations)의 수치적 영향력을 검증합니다.
 * 2. 하드웨어별(CPU vs GPU vs ASIC) 해독 성능 차이를 시뮬레이션합니다.
 * 3. 사용자 입력(Password)과 생성된 암호(isGenerated)의 보안 등급 차이를 판별합니다.
 */

const attackCore = require('./engines/attackCore');
const bruteForce = require('./engines/attacks/bruteForce');
const dictionary = require('./engines/attacks/dictionary');
const rainbowTable = require('./engines/attacks/rainbowTable');
const sideChannel = require('./engines/attacks/sideChannel');

// 결과 출력을 위한 포맷터
const logTestHeader = (name) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 SCENARIO: ${name}`);
  console.log(`${'-'.repeat(60)}`);
};

const printAnalysis = (res) => {
  console.log(`[결과] 등급: ${res.grade}`);
  console.log(`[지표] 보안 점수: ${res.score}%`);
  console.log(`[분석] ${res.cryptoAnalysis}`);
  console.log(`[벡터] ${res.attackVector}`);
  console.log(`[로그]`);
  res.simulationLogs.forEach(l => console.log(`   > ${l}`));
};

// ─────────────────────────────────────────────────────────────────────────────
// 시나리오 1: MD5 + 짧은 암호 + 고성능 하드웨어 (수학적 페널티 검증)
// ─────────────────────────────────────────────────────────────────────────────
logTestHeader("MD5 취약성 및 하드웨어 가속 시뮬레이션");
const md5Data = {
  shieldConfig: { 
    algorithm: 'md5', 
    useSalt: false, 
    usePepper: false 
  },
  pwLen: 8,
  password: 'pass1234',
  hardware: 'gpu_cluster', // 8x RTX 4090급 성능
  threads: 1024,
  isGenerated: false,
  targetHash: 'md5$s=$6f1ed002ab5595859014ebf0951522d9'
};
printAnalysis(bruteForce.analyze(md5Data));


// ─────────────────────────────────────────────────────────────────────────────
// 시나리오 2: Argon2id + 고부하 설정 (최신 보안 표준 검증)
// ─────────────────────────────────────────────────────────────────────────────
logTestHeader("Argon2id 상세 파라미터 저항력 분석");
const argon2Data = {
  shieldConfig: { 
    algorithm: 'argon2id', 
    memoryCost: 256,   // 256MB 할당
    timeCost: 5,       // 5 Iterations
    parallelism: 8,    // 8 Threads
    useSalt: true, 
    usePepper: true,
    pepperValue: 'SECRET_PEPPER_KEY_2024'
  },
  pwLen: 12,
  password: 'ComplexPassword123!',
  hardware: 'asic',    // 맞춤형 ASIC 장비 공격 가정
  threads: 4096,
  isGenerated: true
};
printAnalysis(bruteForce.analyze(argon2Data));


// ─────────────────────────────────────────────────────────────────────────────
// 시나리오 3: SHA-256 + Salt 부재 (레인보우 테이블 취약점 검증)
// ─────────────────────────────────────────────────────────────────────────────
logTestHeader("SHA-256 Salt 미사용 시 레인보우 테이블 노출");
const rainbowData = {
  shieldConfig: { 
    algorithm: 'sha256', 
    useSalt: false, // Salt가 꺼진 상태
    iterations: 100000 
  },
  targetHash: 'sha256$i=100000$s=$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
  hardware: 'gpu_single',
  password: 'password'
};
printAnalysis(rainbowTable.analyze(rainbowData));


// ─────────────────────────────────────────────────────────────────────────────
// 시나리오 4: SHA-512 + Side-Channel (타이밍 공격 검증)
// ─────────────────────────────────────────────────────────────────────────────
logTestHeader("SHA-512 타이밍 사이드채널 분석 (Fast Hash)");
const sideData = {
  shieldConfig: { algorithm: 'sha512' },
  hardware: 'single_cpu'
};
printAnalysis(sideChannel.analyze(sideData));


// ─────────────────────────────────────────────────────────────────────────────
// 시나리오 5: 복잡한 규칙 기반 공격 (Dictionary + Rules)
// ─────────────────────────────────────────────────────────────────────────────
logTestHeader("Dictionary + Leet Speak 변형 규칙 공격");
const dictData = {
  shieldConfig: { algorithm: 'bcrypt', costFactor: 12, useSalt: true },
  pwLen: 9,
  password: 'p@ssw0rd1', // Leet 변형된 암호
  hardware: 'cloud_farm',
  activeCategories: ['common_passwords', 'leet_variants'],
  isGenerated: false
};
printAnalysis(dictionary.analyze(dictData));

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ 모든 정밀 데이터 주입 테스트 완료.`);