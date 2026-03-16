# 🛡️ ShieldBox.io: Full-stack Real-time Security Simulator

[cite_start]추상적인 암호학 워크플로우를 시각화하고, **Socket.io**를 활용해 백엔드 처리 과정을 실시간 스트리밍하는 엔지니어링 중심의 보안 샌드박스 프로젝트입니다. [cite: 1]

---

## 🏗️ 시스템 아키텍처 (System Architecture)

[cite_start]본 프로젝트는 고부하 보안 연산 과정을 사용자에게 실시간으로 피드백하기 위해 **Event-Driven 아키텍처**를 채택했습니다. [cite: 2]

1. [cite_start]**Client:** 특정 공격 시나리오 시뮬레이션이나 암호화 요청을 서버로 `emit`. [cite: 3]
2. [cite_start]**Server (Node.js):** 요청을 수신하여 실제 암호학적 연산(Hashing, Entropy Analysis 등) 수행. [cite: 3]
3. [cite_start]**Real-time Broadcasting:** 연산의 중간 과정 및 상세 로그 데이터를 **Socket.io**를 통해 100ms 단위로 클라이언트에 전송. [cite: 4]
4. [cite_start]**Reactive UI:** 수신된 스트림 데이터를 바탕으로 실시간 그래프 및 터미널 인터페이스 업데이트. [cite: 5]

---

## 🚀 핵심 엔지니어링 모듈 (Core Engineering)

### 1. 🔐 고도화된 비밀번호 보안 파이프라인
[cite_start]단순 라이브러리 호출을 넘어, 실무 수준의 보안 설계를 시각화합니다. [cite: 6]
* [cite_start]**Defense in Depth:** `Plaintext` → `SHA-256` → `Salting/Peppering` → `bcrypt/Argon2id` 단계별 구현을 통한 다층 방어 체계 증명. [cite: 7]
* [cite_start]**Zero-Knowledge Implementation:** 서버가 원본 비밀번호를 저장하지 않으며, **Pepper**를 소스 코드와 분리된 환경 변수(`.env`)로 관리하여 DB 유출 시에도 레인보우 테이블 공격을 원천 차단합니다. [cite: 8]
* [cite_start]**Brute-force 시뮬레이션:** 서버의 연산 과정을 소켓으로 중계하여 암호 엔트로피에 따른 해킹 소요 시간을 실시간으로 증명합니다. [cite: 9]

### 2. ⚔️ 취약점 공격 및 방어 샌드박스
[cite_start]현대 웹 취약점의 메커니즘을 분석하고 방어 로직을 테스트합니다. [cite: 10]
* [cite_start]**SQL Injection & XSS:** 사용자 입력값이 쿼리문이나 DOM에 미치는 영향을 실시간 렌더링하고, **Sanitization** 적용 전후의 안전성 비교. [cite: 11]
* [cite_start]**JWT Integrity Check:** 발급된 JWT의 Payload를 의도적으로 변조하여, 서버 측의 `Signature` 검증 실패 과정을 시각적으로 트래킹. [cite: 12]

### 3. 🖼️ 바이너리 데이터 핸들링 (Steganography)
[cite_start]픽셀 단위의 데이터 조작을 통해 정보 은닉 기술을 구현합니다. [cite: 13]
* [cite_start]**LSB(Least Significant Bit) 알고리즘:** 이미지의 RGBA 픽셀 데이터 중 최하위 비트를 조작하여 데이터를 은닉합니다. [cite: 14]
* [cite_start]**Canvas API 활용:** `Uint8ClampedArray`를 직접 핸들링하여 브라우저 환경에서의 바이너리 데이터 처리 능력을 구현했습니다. [cite: 15]

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 | 사용 목적 |
| --- | --- | --- |
| **Frontend** | React, Next.js | [cite_start]컴포넌트 기반 아키텍처 및 UI 렌더링 최적화 [cite: 16, 17] |
| **Styling** | Tailwind CSS | [cite_start]다크 모드 터미널 인터페이스 및 고대비 UI 스타일링 [cite: 17] |
| **Animation** | Framer Motion | [cite_start]데이터 흐름 및 보안 프로세스의 시각적 전환 효과 [cite: 18] |
| **Real-time** | **Socket.io** | [cite_start]전이중 통신을 이용한 실시간 공격 로그 스트리밍 [cite: 19] |
| **Security** | bcrypt, CryptoJS, JWT | [cite_start]암호학 표준 알고리즘 및 인증 로직 구현 [cite: 20] |

---

## 💡 프로젝트 핵심 가치 (Key Learnings)

* [cite_start]**실시간 성능 최적화:** HTTP 단방향 통신의 한계를 극복하고 실시간 통신을 통해 고부하 연산 과정의 사용자 경험(UX)을 극대화했습니다. [cite: 21]
* [cite_start]**엔지니어링 사고:** 단순히 기능을 구현하는 것이 아니라, 보안 취약점이 발생하는 근본적인 원인과 이를 방어하기 위한 암호학적 구조를 설계에 반영했습니다. [cite: 21]
* [cite_start]**보안 관행 준수:** Pepper 분리 관리, Key Stretching, JWT 서명 검증 등 실무 표준 보안 관행을 준수했습니다. [cite: 22]

---

## 📂 시작하기 (Getting Started)

### 1. 로컬 환경 설치
```bash
# 레포지토리 클론
git clone [https://github.com/cjfwls39/ShieldBox.io.git](https://github.com/cjfwls39/ShieldBox.io.git)

# 패키지 설치
npm install

# .env 설정
# 프로젝트 루트에 .env 파일을 생성하고 아래 환경 변수를 설정하세요.
# PEPPER_KEY=your_secret_pepper
# JWT_SECRET=your_jwt_secret
```

### 2. 실행 및 깃허브 업로드 가이드
```bash
# 서버 및 클라이언트 실행
npm run dev

# 깃허브 첫 업로드 시 (Initial Push)
git init
git add .
git commit -m "Initial commit: Core security simulator logic & modular UI"
git branch -M main
git remote add origin [https://github.com/cjfwls39/ShieldBox.io.git](https://github.com/cjfwls39/ShieldBox.io.git)
git push -u origin main