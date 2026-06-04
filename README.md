# 🛡️ ShieldBox.io: Real-time Password Security Simulator

추상적인 암호학 개념을 직접 체험할 수 있는 **인터랙티브 보안 교육 플랫폼**입니다.  
실제 해싱 알고리즘을 브라우저에서 직접 실행하고, 8가지 공격 시나리오 시뮬레이션을 통해 비밀번호 보안의 원리를 실시간으로 확인할 수 있습니다.

🔗 **[shieldbox-io.onrender.com](https://shieldbox-io.onrender.com)**

> 💡 **이 프로젝트의 핵심은 [🔒 보안 설계](#-보안-설계)와 [🔬 physicsEngine 수치 검증](#-physicsengine-수치-검증)입니다.**
> Hashcat 실측 벤치마크 대비 **오차 0.1%까지 교정한 과정**과, 검증 불가능한 영역을 "정밀한 척 포장하지 않은" 설계 판단을 담았습니다.

## 📑 목차

1. [🏗️ 시스템 아키텍처](#️-시스템-아키텍처)
2. [🚀 핵심 기능](#-핵심-기능)
3. [🔒 보안 설계](#-보안-설계) ⭐
4. [🔬 physicsEngine 수치 검증](#-physicsengine-수치-검증) ⭐
5. [🛠️ 기술 스택](#️-기술-스택)
6. [📂 시작하기](#-시작하기)
7. [📁 프로젝트 구조](#-프로젝트-구조)
8. [📄 라이선스](#-라이선스)

---

## 🏗️ 시스템 아키텍처

본 프로젝트는 **Hybrid Client-Server 아키텍처**를 채택했습니다.

```
브라우저 (Client)
  ├── hash-wasm으로 실제 해싱 연산 수행 (scrypt / argon2id / bcrypt / sha / md5)
  ├── 기기 사양 자동 감지 → 파라미터 안전 상한 적용
  └── 해시값만 서버로 전달 (평문은 네트워크를 타지 않음)

서버 (Node.js + Express + Socket.io)
  ├── 수신한 해시값 포맷 검증 (hashInspector)
  ├── 8가지 공격 시뮬레이션 엔진 실행 (physicsEngine 기반 수식 계산)
  ├── 실시간 공격 로그 소켓 스트리밍
  └── 정적 파일 서빙 (React 빌드 결과물)
```

**핵심 설계 원칙**
- 해싱은 브라우저에서 — 서버 메모리 압박 없이 어떤 파라미터 조합도 처리 가능
- 평문 비밀번호는 네트워크를 타지 않음
- 공격 분석은 서버에서 — 물리 기반 수식으로 정확한 크랙 시간 계산

---

## 🚀 핵심 기능

### 1. 🔐 실시간 해싱 파이프라인
브라우저에서 직접 6가지 알고리즘으로 해싱을 수행합니다.

| 알고리즘 | 등급 | 특징 |
|---------|------|------|
| Argon2id | S | NIST 권고. 메모리 하드 함수. GPU/ASIC 공격 구조적 무력화 |
| scrypt | S | N·r·p 파라미터로 메모리 비용 독립 조절. ASIC 공격에 강함 |
| bcrypt | A | Cost Factor 기반 적응형 해싱. 미래 하드웨어 발전에 유연하게 대응 |
| SHA-512 | B | 범용 해시. Salt 병행 필수 |
| SHA-256 | B | 인터넷 표준 해시. 단독 사용 시 취약 |
| MD5 | D | 충돌 저항성 붕괴. 레거시 용도로만 존재 |

**파라미터 설정**
- memoryCost, timeCost, parallelism, blockSize, costFactor 등 알고리즘별 세부 조정
- Salt / Pepper 독립 제어
- 기기 사양 자동 감지 → 저사양 환경에서 파라미터 자동 하향 안내

### 2. ⚔️ 8가지 공격 시뮬레이션
물리 기반 수식(physicsEngine)으로 실제 크랙 시간을 계산합니다.

| 공격 기법 | 설명 |
|---------|------|
| Brute Force | 94^n 전수 조사. Entropy 기반 소요 시간 산출 |
| Dictionary Attack | 96,000개 사전 패턴 매칭. 변형 규칙 포함 |
| Rainbow Table | Salt 유무에 따른 TMTO 리스크 진단 |
| Mask Attack | 비밀번호 구조 패턴 분석. 탐색 공간 압축률 계산 |
| Rule-Based | Leet Speak / Suffix 변형 패턴 역추적 |
| Side-Channel | 타이밍 공격 통계 모델링 (가우시안 확률 밀도) |
| Credential Stuffing | 다크웹 유출 DB 140억 건 기반 재사용 위험도 분석 |
| Collision Attack | Birthday Paradox 기반 충돌 저항성 검증 |

**하드웨어 옵션**: Single CPU / GPU Single / GPU Cluster / ASIC / Cloud Farm / Quantum

### 3. 📚 보안 아카데미
4개 섹션으로 구성된 인터랙티브 학습 콘텐츠

- **EntropyHub** — 비밀번호 엔트로피 분석 및 등급 산출 (F~S)
- **AlgorithmLibrary** — 알고리즘별 보안 강도 비교 및 상세 분석
- **AttackVectors** — 공격 기법 원리 설명 및 취약성 평가
- **ScenarioLab** — Salt / Pepper / Rainbow Table 시나리오 시각화

---

## 🔒 보안 설계

**왜 해싱 엔진을 서버가 아닌 브라우저에서 실행하나요?**

초기 설계는 서버(Node.js)에서 직접 해싱을 수행하는 구조였습니다. 그러나 실제 배포 환경에서 두 가지 문제가 발견됐습니다.

첫째, **메모리 한계**입니다. scrypt와 argon2id는 설계상 메모리를 대량 소비합니다. 예를 들어 scrypt를 `memoryCost=256MB, blockSize=32, parallelism=8`로 설정하면 실제 연산에 수 GB의 메모리가 필요합니다. Render 무료 플랜(512MB RAM)에서는 파라미터를 극도로 제한하거나 서버가 다운되는 문제가 반복됐습니다.

둘째, **파라미터 제한이 시뮬레이션 정확도를 저해**합니다. 서버 메모리를 보호하기 위해 사용자의 파라미터를 강제로 낮추면, ShieldBox의 핵심 목적인 "내가 설정한 값이 실제로 얼마나 안전한지 체험"이 불가능해집니다.

해결책은 연산 주체를 바꾸는 것이었습니다. 브라우저는 사용자의 로컬 RAM을 사용하므로 서버 메모리와 무관합니다. `hash-wasm` 라이브러리는 동일한 알고리즘의 C 레퍼런스 구현을 WebAssembly로 컴파일한 것이라 서버 측 결과와 수학적으로 동일합니다. 덕분에 어떤 파라미터 조합을 설정해도 서버가 죽지 않으며, 시뮬레이션 정확도도 그대로 유지됩니다.

**평문 보호**
- 해싱은 브라우저(hash-wasm)에서 수행 — 평문이 서버로 전송되지 않음
- 서버는 해시값의 포맷과 파라미터 일관성만 검증

**서버 보호 (Shield Guard)**
- 메모리 세이프가드: RSS 70% 초과 시 파라미터 자동 하향
- 서킷 브레이커: RSS 85% 초과 시 요청 차단 (10초 후 자동 해제)
- Rate Limit: 공격 시뮬레이션 5회/분, 해싱 20회/분 (IP별)

**환경 변수 분리**
- `SYSTEM_SECRET_PEPPER` — 서버 환경 변수로만 관리, 코드에 미포함
- `.env` gitignore 처리

---

## 🔬 physicsEngine 수치 검증

ShieldBox의 크랙 시간 계산은 physicsEngine이 담당합니다. 이 엔진이 출력하는 수치가 실제 공격 환경과 얼마나 일치하는지 검증하고 교정한 과정을 기록합니다.

### 검증 방법

`server/debug-tester.js`를 작성해 physicsEngine의 계산값을 **Hashcat v6.2.6 RTX 4090 공개 벤치마크** ([Chick3nman, 2022](https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd))와 직접 비교했습니다.

```bash
node server/debug-tester.js
```

### 발견된 문제 (v1)

초기 `hashRates` 설정에는 두 가지 구조적 문제가 있었습니다.

| 문제 | 내용 | 영향 |
|------|------|------|
| 하드웨어 미분리 | `gpu_single` (RTX 4090 × 1)과 `gpu_cluster` (× 8)가 동일한 `rates.gpu` 단일값 사용 | Single과 Cluster 선택 시 동일한 크랙 시간 출력 |
| 속도값 부정확 | MD5: 16.4 GH/s (실측 164.1), scrypt: 500 H/s (실측 3,563) 등 최대 80x 오차 | 일부 알고리즘을 실제보다 과도하게 안전하게 평가 |

### 수정 내용

**`shield-config.js` — hashRates 구조 변경 및 Hashcat 실측값 적용**

| 알고리즘 | 항목 | v1 (구) | v2 (교정) | 출처 |
|---------|------|---------|----------|------|
| MD5 | GPU Single | 16.4 GH/s | **164.1 GH/s** | Hashcat Mode 0 실측 |
| MD5 | GPU Cluster | 16.4 GH/s | **1.31 TH/s** | × 8 선형 스케일 |
| SHA-256 | GPU Single | 3.5 GH/s | **21.97 GH/s** | Hashcat Mode 1400 실측 |
| SHA-512 | GPU Single | 3.5 GH/s | **7.48 GH/s** | Hashcat Mode 1700 실측 |
| bcrypt CF=12 | GPU Single | 5,000 H/s | **1,437 H/s** | Hashcat Mode 3200 (CF=5: 184kH/s ÷ 2⁷) |
| scrypt 32MB | GPU Single | 500 H/s | **3,563 H/s** | Hashcat Mode 8900 (N=16384: 7,126 ÷ 2) |

**`physicsEngine.js` — hwRate 매핑 변경**

```js
// v1: 모든 GPU 계열을 단일 rates.gpu로 처리
const hwRate = hardware.includes('gpu') ? rates.gpu : rates.pc;

// v2: hardware key를 rates 객체에서 직접 참조
const hwRate = rates[hardware] ?? (hardware.includes('gpu') ? rates.gpu_single : rates.pc);
```

### 교정 후 검증 결과

기준: 11자 비밀번호(`password123`), 탐색 공간: 94¹¹

| 알고리즘 | 하드웨어 | ShieldBox 예상 | Hashcat 기반 실측 | 배율 |
|---------|---------|--------------|----------------|------|
| MD5 | GPU Single (RTX 4090) | 25.71분 | 25.71분 | **1.00x** |
| MD5 | GPU Cluster (× 8) | 3.21분 | 3.21분 | **1.00x** |
| SHA-256 | GPU Single | 3,650년 | 3,650년 | **1.00x** |
| SHA-256 | GPU Cluster | 456년 | 456년 | **1.00x** |
| SHA-512 | GPU Single | 1.07만년 | 1.07만년 | **1.00x** |
| bcrypt CF=12 | GPU Single | 558억년 | 558억년 | **1.00x** |
| bcrypt CF=12 | GPU Cluster | 69.75억년 | 69.73억년 | **1.00x** |
| scrypt 32MB | GPU Single | 225억년 | 225억년 | **1.00x** |
| scrypt 32MB | GPU Cluster | 28.15억년 | 28.14억년 | **1.00x** |

비교 가능한 5개 알고리즘(MD5·SHA-256·SHA-512·bcrypt·scrypt) 전 하드웨어 조합에서 **Hashcat 실측 대비 오차 0.1% 이내**를 달성했습니다.

> **argon2id**: Hashcat 공개 벤치마크에 GPU 크래킹 데이터가 없어 비교 불가. 메모리 하드 설계 특성상 GPU 가속이 구조적으로 제한되며, 현행 추정값 유지.

### 하드웨어 티어별 산출 근거

6개 하드웨어 옵션은 **실측 교정값(GPU)을 기준점**으로 삼고, 나머지를 명시적 근거에 따라 파생·추정했습니다. "어디까지가 실측이고 어디부터가 추정인가"를 구분하는 것이 핵심입니다.

| 하드웨어 | 산출 근거 | 분류 |
|---------|---------|------|
| GPU Single (RTX 4090) | Hashcat v6.2.6 실측 벤치마크 | ✅ Calibrated |
| GPU Cluster (8× RTX 4090) | GPU Single × 8 (선형 스케일) | ✅ Calibrated |
| Cloud Farm (AWS p4d.24xl) | 8× A100 ≈ GPU 클러스터 동급으로 매핑 | 〰 Derived |
| ASIC Rig | 빠른 해시(MD5/SHA): GPU 클러스터 ×2.3 / 메모리 하드(bcrypt·scrypt·argon2id): ASIC 이점 없어 클러스터와 동일 | 〰 Derived |
| Single CPU (Ryzen 9 7950X) | 알고리즘별 CPU 단일 코어 추정치 (Hashcat CPU 벤치 미반영) | 〰 Estimated |
| Quantum (이론) | 이론적 상한 상수 (실측 calibration 불가 — 아래 참조) | ⚠ Theoretical |

> **ASIC가 메모리 하드 함수에 이점이 없는 이유**: bcrypt·scrypt·argon2id는 설계상 대량의 메모리 대역폭을 요구하므로, 연산 회로를 특화해도 메모리 병목이 그대로 남습니다. ASIC의 강점은 연산이 단순한 MD5/SHA 계열에만 적용됩니다.

### Quantum 하드웨어를 "교정"하지 않은 이유

하드웨어 옵션에는 `Quantum (이론)`이 포함되어 있습니다. 이 항목은 **의도적으로 실측 교정 대상에서 제외**했으며, 그 이유 자체가 하나의 설계 판단입니다.

**핵심: 교정할 실측 데이터가 존재하지 않습니다.**

CPU·GPU 속도는 Hashcat이라는 실측 기준이 있어 오차 0.1%까지 맞출 수 있었습니다. 그러나 양자 컴퓨터의 실제 해시 크래킹 벤치마크는 **세상에 존재하지 않습니다.** 따라서 어떤 수치를 넣어도 그것은 추측입니다.

**그렇다면 Grover 알고리즘으로 √N을 구현하면 되지 않나?**

Grover 알고리즘은 탐색 공간을 제곱근으로 줄여줍니다(94¹¹ ≈ 2⁷² → 2³⁶). 하지만 실제 크랙 시간을 계산하려면 결국 **양자 게이트의 처리 속도**라는 상수가 필요한데, 이 값은 학계에서도 수십 자릿수 단위로 추정이 엇갈립니다. 즉, √N 공식을 넣더라도 그 안의 게이트 속도는 여전히 임의의 추측값이며, 결과적으로 **"정밀한 수학"으로 포장된 추측**이 될 뿐입니다.

게다가 ShieldBox가 보안 강화를 권장하는 **메모리 하드 함수(argon2id, scrypt)는 Grover 오라클을 구성하는 것 자체가 비현실적**이라고 평가됩니다. 순진하게 √N을 적용하면 정작 가장 안전한 알고리즘들의 위협을 과장하게 됩니다.

**결론: 거짓 정밀도(false precision)보다 명시적 이론 상수를 선택했습니다.**

Quantum은 calibration된 실측값이 아니라, "이론적 미래 하드웨어에서도 강력한 암호는 즉시 뚫리지 않는다"는 **방향성을 전달하는 교육용 상한 지표**입니다. UI에 `(이론)` 라벨을 붙여 calibration된 다른 하드웨어와 명확히 구분했습니다. 검증할 수 없는 값을 정밀한 척 포장하지 않는 것 — 이것이 calibration 섹션과 동일한 원칙입니다.

---

## 🛠️ 기술 스택

| 구분 | 기술 | 사용 목적 |
|------|------|---------|
| **Frontend** | React 19 + Vite | 컴포넌트 기반 UI |
| **Styling** | Tailwind CSS v4 | 라이트/다크 테마 디자인 시스템 |
| **Animation** | Framer Motion | 실시간 데이터 흐름 시각화 |
| **Hashing** | hash-wasm | 브라우저 WASM 기반 실제 해싱 연산 |
| **Real-time** | Socket.io | 공격 로그 실시간 스트리밍 |
| **Server** | Node.js + Express | 공격 시뮬레이션 엔진 / 정적 파일 서빙 |
| **배포** | Render (Free) | 서버 + 프론트 통합 배포 |

---

## 📂 시작하기

### 로컬 개발 환경

```bash
# 레포지토리 클론
git clone https://github.com/cjfwls39/ShieldBox.io.git
cd ShieldBox.io

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 SYSTEM_SECRET_PEPPER 값 생성 후 입력
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 서버 패키지 설치
npm install

# 클라이언트 패키지 설치
npm install --prefix client

# 서버 실행 (포트 4000)
npm run dev:server

# 클라이언트 실행 (포트 5173) — 별도 터미널
npm run dev:client
```

### 배포 빌드

```bash
# 프론트엔드 빌드 (client/dist/ 생성)
npm run build

# 서버 실행 (빌드된 프론트 포함 서빙)
npm start
```

### 환경 변수 (.env)

```
VITE_BACKEND_URL=http://localhost:4000   # 프론트엔드용
PORT=4000                                 # 서버 포트
FRONTEND_URL=http://localhost:5173        # CORS 허용 주소
SYSTEM_SECRET_PEPPER=                     # 32자 이상 무작위 문자열
```

---

## 📁 프로젝트 구조

```
ShieldBox.io/
├── .env                          # 통합 환경 변수 (gitignore)
├── .env.example                  # 환경 변수 템플릿
├── package.json                  # 루트 (서버용 commonjs)
├── client/                       # 프론트엔드 (Vite + React)
│   ├── package.json              # 클라이언트용 (module)
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useShieldEngine.js  # 소켓 + 상태 관리
│   │   │   └── useHashEngine.js    # hash-wasm 해싱 로직
│   │   ├── components/
│   │   └── constants/
│   └── vite.config.js
└── server/
    ├── server.js                 # 메인 서버 진입점
    ├── config/
    │   └── shield-config.js      # 전체 수치 중앙 관리
    ├── guards/
    │   └── memoryGuard.js        # 메모리 세이프가드
    ├── core_logic/               # 물리 엔진 / 판정 / 레지스트리
    ├── engines/attacks/          # 8가지 공격 엔진
    └── data/                     # 사전 / 리포트 템플릿
```

---

## 📄 라이선스

본 프로젝트는 **MIT License** 하에 배포됩니다.

- 아이디어, 설계, 기획 및 구현 방향 — 저작자 창작
- 코드 작성 과정에서 AI 도구(Claude by Anthropic) 활용
- 출처 표기 시 자유롭게 사용 가능

자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.