# 🛡️ ShieldBox.io: Real-time Password Security Simulator

추상적인 암호학 개념을 직접 체험할 수 있는 **인터랙티브 보안 교육 플랫폼**입니다.  
실제 해싱 알고리즘을 브라우저에서 직접 실행하고, 8가지 공격 시나리오 시뮬레이션을 통해 비밀번호 보안의 원리를 실시간으로 확인할 수 있습니다.

🔗 **[shieldbox-io.onrender.com](https://shieldbox-io.onrender.com)**

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