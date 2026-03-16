/**
 * ShieldBox.io - Advanced Intelligence Analysis Engine v2.0
 * 방어와 공격의 인과관계를 암호학적으로 분석합니다.
 * mitigation은 배열로 반환하여 UI에서 구조적으로 렌더링 가능하게 개편
 */
const analyzeAttack = (data) => {
    const { method, hardware, threads, shieldConfig, pwLen, intensity = 5, wordlistSize = 'large', ruleSet = 'default', useProxy = false, stealthMode = false } = data;

    const pepperActive = shieldConfig.usePepper && shieldConfig.pepperValue && shieldConfig.pepperValue.length > 0;
    const pepperLen = pepperActive ? shieldConfig.pepperValue.length : 0;
    const pepperDesc = pepperActive
        ? `서버 Pepper(${pepperLen}자) 적용 — DB 유출 시 오프라인 공격 원천 차단.`
        : 'Pepper 미적용 — DB 유출 시 오프라인 크래킹 시도 가능.';

    // 하드웨어 레이블 매핑
    const hwLabels = {
      single_cpu: 'Single CPU (Ryzen 9 7950X)',
      gpu_single: 'GPU Single (RTX 4090)',
      gpu_cluster: 'GPU Cluster (8× RTX 4090)',
      asic: 'ASIC Rig (Custom)',
      cloud_farm: 'Cloud Farm (AWS p4d)',
      quantum: 'Quantum Computer (이론)',
    };
    const hwLabel = hwLabels[hardware] || hardware || 'GPU Cluster';

    // 공격 방식 레이블 매핑
    const methodLabels = {
      brute_force: 'Brute Force',
      dictionary: 'Dictionary Attack',
      rainbow_table: 'Rainbow Table',
      credential_stuffing: 'Credential Stuffing',
      mask_attack: 'Mask Attack',
      rule_based: 'Rule-Based Attack',
      side_channel: 'Side-Channel',
    };
    const methodLabel = methodLabels[method] || method || 'Brute Force';

    let isSuccess = false;
    let report = {
        grade: "", score: 0, reason: "", interaction: "", bottleneck: "",
        dynamics: "", mitigation: [], verdict: "",
        technicalDepth: "", attackVector: "", cryptoAnalysis: ""
    };

    // Side-Channel은 알고리즘 무관 별도 처리
    if (method === 'side_channel') {
        isSuccess = shieldConfig.algorithm === 'md5' || shieldConfig.algorithm === 'sha256';
        report.grade = isSuccess ? "D (VULNERABLE)" : "B (STABLE)";
        report.score = isSuccess ? 35 : 72;
        report.reason = isSuccess ? "타이밍 사이드채널 공격 성공 — 구현 취약점 노출" : "사이드채널 저항성 확인 — Memory-Hard 설계가 타이밍 패턴을 은폐";
        report.interaction = `사이드채널 공격은 알고리즘의 수학적 강도가 아닌 '구현의 물리적 특성'을 공격합니다. ${shieldConfig.algorithm.toUpperCase()}의 연산 시간 패턴이 ${isSuccess ? '규칙적이어서 타이밍 분석으로 내부 상태를 추론할 수 있습니다.' : 'Memory-Hard 특성으로 인해 불규칙하게 분산되어 패턴 분석이 불가능합니다.'}`;
        report.bottleneck = `측정 정밀도(나노초 단위)와 네트워크 지터가 주요 병목입니다. ${stealthMode ? '스텔스 모드로 탐지 회피를 시도했으나,' : ''} 통계적 유의성 확보를 위해 수천~수만 회의 반복 측정이 필요합니다.`;
        report.dynamics = `공격은 3단계로 진행됩니다. 1단계: 수만 건의 인증 요청을 전송하며 응답 시간을 마이크로초 단위로 기록합니다. 2단계: 통계 분석으로 응답 시간 분포에서 패턴을 추출합니다. 3단계: 패턴을 기반으로 내부 키 정보를 역산합니다. ${useProxy ? 'Proxy를 통해 출처를 분산시켜 탐지를 지연시켰습니다.' : ''}`;
        report.mitigation = [
            { step: "01", title: "일정 시간 응답(Constant-Time) 구현", desc: "암호 비교 함수를 항상 동일한 시간이 소요되도록 구현합니다. Node.js의 crypto.timingSafeEqual()을 활용하십시오." },
            { step: "02", title: "응답 시간 노이즈 추가", desc: "인증 응답에 무작위 지연(jitter)을 추가하여 타이밍 패턴을 은폐합니다." },
            { step: "03", title: "요청 속도 제한(Rate Limiting)", desc: "반복적 측정 시도를 차단하기 위해 IP 기반 요청 속도 제한을 적용합니다." },
        ];
        report.verdict = isSuccess ? "구현 레벨의 취약점은 알고리즘을 교체해도 해결되지 않습니다. Constant-Time 구현이 필수입니다." : "현재 알고리즘의 Memory-Hard 특성이 타이밍 패턴을 자연스럽게 은폐합니다.";
        report.technicalDepth = "Kocher(1996)의 타이밍 공격 논문은 RSA 개인키를 시간 측정만으로 추출 가능함을 증명했습니다. Bernstein(2005)은 AES 캐시 타이밍 공격을 통해 128비트 키를 복구했습니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | Intensity ${intensity}/10`;
        report.cryptoAnalysis = `타이밍 노출: ${isSuccess ? '취약' : '은폐됨'} | Constant-Time: ${isSuccess ? '미적용' : '적용'} | 물리적 격리: 미확인`;
        return { isSuccess, ...report };
    }

    // Credential Stuffing
    if (method === 'credential_stuffing') {
        isSuccess = pwLen < 12 || !shieldConfig.useSalt;
        report.grade = isSuccess ? "D (VULNERABLE)" : "C (MARGINAL)";
        report.score = isSuccess ? 32 : 61;
        report.reason = isSuccess ? "유출 자격증명 재사용 공격 성공 — 암호 재사용 습관이 치명적" : "자격증명 스터핑 차단 — 고유 암호 정책이 방어선 구축";
        report.interaction = `다크웹에 유통되는 수십억 건의 유출 (이메일, 암호) 쌍을 자동화 봇으로 대입합니다. ${wordlistSize === 'custom' ? '커스텀 DB' : wordlistSize === 'large' ? '14억 건 규모의 Rockyou2024' : '1,400만 건 규모 기본 사전'}을 사용했습니다. 사용자가 다른 서비스와 동일한 암호를 쓴다면 해시 알고리즘과 무관하게 즉시 접근이 가능합니다.`;
        report.bottleneck = `네트워크 요청 속도와 ${useProxy ? 'Proxy 로테이션 효율' : '계정 잠금 정책'}이 주요 병목입니다. ${stealthMode ? '스텔스 모드로 요청 패턴을 분산시켜 WAF 탐지를 우회했습니다.' : '비정상적인 요청 패턴이 WAF에 탐지될 수 있습니다.'}`;
        report.dynamics = `공격은 자동화 봇이 초당 수백~수천 건의 로그인을 시도하는 방식으로 진행됩니다. ${wordlistSize === 'large' ? 'Rockyou2024 14억 건' : '소규모 사전'} 기반으로 이메일+암호 쌍을 순차 대입합니다. 성공 시 해당 계정의 세션을 탈취하며, 2FA가 없다면 즉시 권한을 획득합니다.`;
        report.mitigation = [
            { step: "01", title: "Multi-Factor Authentication", desc: "2FA/MFA를 필수 적용합니다. 자격증명이 유출되어도 두 번째 인증 수단 없이는 접근 불가합니다." },
            { step: "02", title: "유출 암호 탐지", desc: "Have I Been Pwned API를 연동하여 유출된 암호 사용 시 즉시 경고 및 변경을 강제합니다." },
            { step: "03", title: "행동 기반 봇 탐지", desc: "요청 패턴, 디바이스 핑거프린트, 마우스 이동 등을 분석하여 봇 트래픽을 차단합니다." },
        ];
        report.verdict = "Credential Stuffing은 암호화 강도와 무관한 공격입니다. 사용자 교육과 MFA가 유일한 근본 해결책입니다.";
        report.technicalDepth = "OWASP Automated Threat AT-008은 Credential Stuffing을 최고 위험 자동화 위협으로 분류합니다. Akamai 2023 보고서에 따르면 전체 로그인 트래픽의 34%가 자격증명 스터핑 공격입니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | ${threads} Threads | Wordlist: ${wordlistSize}`;
        report.cryptoAnalysis = `암호화 우회 공격 | MFA: 미확인 | 암호 재사용 위험: ${isSuccess ? '높음' : '낮음'}`;
        return { isSuccess, ...report };
    }

    // 기존 케이스들 (method id 기반으로 재매핑)
    const isRainbow = method === 'rainbow_table';
    const isMask = method === 'mask_attack';
    const isRuleBased = method === 'rule_based';

    // 1. 치명적 보안 결함 (MD5 혹은 짧은 암호 + Salt 없음)
    if (shieldConfig.algorithm === 'md5' || (pwLen < 8 && !shieldConfig.useSalt)) {
        isSuccess = true;
        report.grade = "F (CRITICAL)";
        report.score = 15;
        report.reason = "시스템 보안 무결성 완전 붕괴 — 암호학적 방어 체계 전무";
        report.interaction = "MD5는 1991년 설계 당시부터 충돌 저항성(Collision Resistance)이 결여된 알고리즘입니다. 현대 GPU의 CUDA 병렬 아키텍처는 단일 RTX 4090 기준 초당 약 164억 개(16.4 GH/s)의 MD5 해시를 연산할 수 있으며, 이는 전체 8자 암호 공간(약 7,200억 가지)을 43초 내에 전수 탐색할 수 있음을 의미합니다. 방어자의 해싱 속도와 공격자의 크래킹 속도 간 비대칭이 10억 배 이상 벌어져, 사실상 평문 저장과 동일한 보안 수준입니다.";
        report.bottleneck = "병목 현상 없음 — 공격이 메모리 대역폭(~900 GB/s)에 의해서만 제한됩니다. MD5의 단순한 비트 연산 구조(XOR, AND, OR 조합)는 GPU의 SIMD(Single Instruction Multiple Data) 유닛과 완벽하게 호환되어, 파이프라인 지연(Pipeline Stall) 없이 풀 스로틀 연산이 가능합니다.";
        report.dynamics = "공격 진행은 3단계로 분류됩니다. 1단계(0~2초): GPU 클러스터가 워밍업되며 해시 테이블을 VRAM에 사전 적재합니다. 2단계(2~45초): 브루트포스 엔진이 소문자→대문자→숫자→특수문자 순서로 키 공간을 탐색하며, 레인보우 테이블이 병렬로 조회됩니다. 3단계(45초 이후): 암호 발견 시 즉시 역방향 조회를 통해 평문을 추출합니다.";
        report.mitigation = [
            { step: "01", title: "MD5 즉시 폐기", desc: "현재 운영 중인 모든 MD5 해시를 즉시 무효화하고, 신규 로그인 시 강제 재설정을 트리거합니다." },
            { step: "02", title: "Argon2id 마이그레이션", desc: "NIST SP 800-63b 기준에 따라 Argon2id(m=64MB, t=3, p=4)로 전환합니다." },
            { step: "03", title: "전체 세션 무효화", desc: "현재 활성화된 모든 세션 토큰을 즉시 만료시키고 침해 범위를 산정합니다." },
            { step: "04", title: "침해 지표(IoC) 감사", desc: "로그인 이력을 역추적하여 KISA 등 규제 기관에 신고합니다." }
        ];
        report.verdict = "MD5는 암호학적으로 파산한 알고리즘으로, '언제 해킹되는가'의 문제입니다. 즉각적인 전체 인프라 교체가 시급합니다.";
        report.technicalDepth = "MD5의 128비트 출력과 생일 역설(Birthday Paradox)에 의해 약 2^64회 연산으로 충돌 쌍을 발견할 수 있습니다. Wang et al.(2004)의 연구 이후 차분 공격으로 충돌 생성이 현대 PC에서 수 초 내에 가능합니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | ${threads} Threads | ~16.4 GH/s`;
        report.cryptoAnalysis = "충돌 저항성: 붕괴 | 역상 저항성: 취약 | 제2역상 저항성: 취약";
    } 
    // 2. Salt 부재 - 레인보우 테이블 공격
    else if (isRainbow && !shieldConfig.useSalt) {
        isSuccess = true;
        report.grade = "D (VULNERABLE)";
        report.score = 38;
        report.reason = "사전 계산 데이터베이스에 의한 즉시 복호화 — Salt 부재의 치명적 대가";
        report.interaction = "Salt가 없는 경우, 공격자는 수억 개의 (평문→해시) 쌍을 사전에 계산하여 저장한 레인보우 테이블을 단순 조회하는 것만으로 즉시 복호화합니다. 연산이 전혀 필요 없으며, 오직 I/O 속도만이 공격 속도를 결정합니다.";
        report.bottleneck = `스토리지 I/O 대역폭이 유일한 병목입니다. ${wordlistSize === 'large' ? 'Rockyou2024 기반 14억 건' : '기본'} 테이블 조회 시 NVMe SSD 순차 읽기(~7 GB/s)가 한계입니다.`;
        report.dynamics = "레인보우 테이블 공격은 시간-메모리 트레이드오프(TMTO) 원리를 이용합니다. 사전 계산 비용이 실제 공격 단계에서 0에 수렴하여, 전체 DB 덤프를 수 분 내에 해독합니다.";
        report.mitigation = [
            { step: "01", title: "사용자별 무작위 Salt 도입", desc: "128비트 이상의 CSPRNG 난수를 각 사용자마다 생성하여 해시와 함께 저장합니다." },
            { step: "02", title: "기존 해시 점진적 교체", desc: "사용자 재로그인 시 즉시 Salt와 함께 재해시하여 교체합니다." },
            { step: "03", title: "알고리즘 업그레이드 병행", desc: "bcrypt(cost≥12) 또는 Argon2id로 업그레이드하여 브루트포스 저항성도 확보합니다." }
        ];
        report.verdict = "Salt는 암호학의 가장 기초적인 위생 조치입니다. 개인정보보호법 위반 소지가 있는 중대한 취약점입니다.";
        report.technicalDepth = "Philippe Oechslin(2003)의 레인보우 테이블 논문에 따르면 TMTO로 일반 해시테이블 대비 메모리를 1/3로 줄이면서 동일 커버리지를 달성합니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | 테이블 조회 기반 (연산 無)`;
        report.cryptoAnalysis = "Salt 엔트로피: 0비트 | 사전 계산 방어: 완전 실패";
    }
    // 3. 최상위 방어 (Argon2id + 고강도 설정)
    else if (shieldConfig.algorithm === 'argon2id' && pwLen >= 14 && shieldConfig.memoryCost >= 64) {
        isSuccess = false;
        report.grade = "S (FORTIFIED)";
        report.score = 98;
        report.reason = "군사 등급 Memory-Hard 방어벽 — 현대 암호학의 정점";
        report.interaction = `Argon2id는 2015년 Password Hashing Competition(PHC) 우승 알고리즘으로, 단 1회 해시 연산에 ${shieldConfig.memoryCost}MB 메모리 완전 점유를 강제합니다. ${hwLabel}의 병렬 코어 수천 개가 각각 수십 MB를 동시 점유해야 하므로 실질적으로 수십 개 코어만 사용 가능하여 GPU 이점이 구조적으로 무효화됩니다.`;
        report.bottleneck = `메모리 대역폭 포화가 압도적 병목입니다. ${shieldConfig.memoryCost}MB × 동시 연산 수가 VRAM 대역폭을 포화시켜 초당 시도 횟수가 SHA-256 대비 10만~100만분의 1로 급감합니다.`;
        report.dynamics = "Argon2id 방어는 3개 레이어로 구성됩니다. ① Time Cost로 기본 연산량 선형 증가 ② Memory Cost로 RAM 점유 강제하여 병렬화 억제 ③ 데이터 의존적 메모리 접근으로 사이드채널 동시 방어. ASIC 전용 하드웨어도 DRAM 탑재가 필수이므로 비용 효율이 근본적으로 제한됩니다.";
        report.mitigation = [
            { step: "✓", title: "현재 설정 유지", desc: `Argon2id(m=${shieldConfig.memoryCost}MB)는 현재 기술 수준 최상의 방어입니다.` },
            { step: "→", title: "하드웨어 발전 모니터링", desc: "DRAM 가격 하락에 따라 m_cost를 주기적으로 상향합니다. 응답 시간 300ms 이내를 기준으로 조정합니다." },
            { step: pepperActive ? "✓" : "→", title: "Pepper 레이어", desc: pepperActive ? `${pepperLen}자 Pepper 적용 중 — DB 단독 유출 시 오프라인 공격 불가. 환경변수 보안 관리를 유지하십시오.` : "HMAC 기반 서버 Pepper를 추가하면 DB 유출 시 오프라인 공격 자체가 불가능합니다." }
        ];
        report.verdict = `현재 기술로 해독에 수백 년이 소요됩니다. ${pepperActive ? `Pepper(${pepperLen}자)까지 적용된 이중 방어로 DB 유출 시나리오도 완벽 차단됩니다.` : '추가 투자보다 물리적 서버 보안과 운영 보안(OpSec)에 집중하십시오.'}`;
        report.technicalDepth = "Biryukov et al.(2016)에 따르면 Argon2는 TMTO 공격에 대해 증명 가능한 비용 하한(Provable Lower Bound)을 제공합니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | ${threads} Threads | ~수십 H/s`;
        report.cryptoAnalysis = `Memory-Hard: 활성(${shieldConfig.memoryCost}MB) | TMTO 저항: 증명됨 | ${pepperActive ? `Pepper: ${pepperLen}자 활성` : 'Pepper: 미적용'}`;
    }
    // 4. SHA 계열
    else if (shieldConfig.algorithm === 'sha256' || shieldConfig.algorithm === 'sha512') {
        isSuccess = false;
        report.grade = "C (MARGINAL)";
        report.score = 58;
        report.reason = "암호 전용 알고리즘 부재 — 속도 최적화가 역으로 취약점";
        report.interaction = `SHA 계열은 '가능한 한 빠르게' 동작하도록 설계된 범용 해시입니다. ${hwLabel} 기준 초당 약 35억 개 연산이 가능한 반면, bcrypt(cost=12)는 5,000회에 불과합니다. Salt가 있어 레인보우 테이블은 무력화되지만 브루트포스 저항성이 전무합니다.`;
        report.bottleneck = `GPU 연산 파이프라인 포화가 유일한 제약입니다. ${threads}개 스레드를 늘리는 것만으로 선형적 성능 향상이 가능합니다.`;
        report.dynamics = `${isMask ? 'Mask Attack으로 대문자+소문자+숫자 패턴을 우선 탐색합니다.' : isRuleBased ? 'Rule-Based로 leet speak, 숫자 접미사 등 변환 규칙을 적용합니다.' : '브루트포스로'} Salt가 있어 각 사용자마다 개별 크래킹이 필요하지만, 8자 이하 암호는 수 분~수 시간 내에 해독됩니다.`;
        report.mitigation = [
            { step: "01", title: "bcrypt/Argon2id 마이그레이션", desc: "bcrypt(cost≥12) 또는 Argon2id로 전환하면 공격 속도를 10만 배 이상 감소시킵니다." },
            { step: "02", title: "최소 길이 16자 강제", desc: "현재 알고리즘 유지 시 16자 이상 무작위 암호는 현실적 해독이 어렵습니다." },
            { step: "03", title: "서버 사이드 Pepper", desc: "HSM 기반 Pepper 키로 DB 단독 유출 시 오프라인 공격을 원천 차단합니다." }
        ];
        report.verdict = "SHA 계열의 속도 장점이 비밀번호 보안에서는 치명적 약점입니다. 전용 해싱 알고리즘으로의 전환이 시급합니다.";
        report.technicalDepth = "NIST SP 800-132는 비밀번호 해싱에 PBKDF2, bcrypt, scrypt, Argon2를 권고하며 SHA 직접 사용을 금지합니다.";
        report.attackVector = `${methodLabel} | ${hwLabel} | ${threads} Threads | ~3.5 GH/s`;
        report.cryptoAnalysis = `속도 설계: 공격자 친화적 | 브루트포스 저항: 미흡 | ${pepperActive ? `Pepper: ${pepperLen}자 활성` : "Pepper: 미적용"}`;
    }
    // 5. 표준 보안 (Bcrypt/Scrypt 등)
    else {
        isSuccess = false;
        report.grade = "B (STABLE)";
        report.score = 78;
        report.reason = "공격 경제성 붕괴로 인한 침투 실패 — 연산 비용 장벽이 방어선 확립";
        report.interaction = `${shieldConfig.algorithm === 'scrypt' ? 'Scrypt' : 'Bcrypt'}의 핵심 방어는 키 스트레칭(Key Stretching)입니다. ${shieldConfig.stretching}라운드 설정으로 1회 검증에 수십 밀리초 지연을 강제하여 ${hwLabel}의 초당 시도 횟수를 수십억에서 수천~수만 회로 격감시킵니다.`;
        report.bottleneck = `연산 사이클 소모가 지배적 병목입니다. ${shieldConfig.stretching}라운드 반복이 각 시도당 시간을 강제 연장하며, ${threads}개 스레드를 동원해도 초당 시도율이 수천 회 수준에 머뭅니다.`;
        report.dynamics = `${isRuleBased ? 'Rule-Based 공격이 leet speak·숫자 접미사·대소문자 치환 규칙을 적용하여' : isMask ? 'Mask Attack이 패턴 기반으로' : '공격이'} 공격 경제성(Attack Economics) 관점에서 ${hwLabel} 1시간 운용 비용($5~50)을 초과하는 해독 기대 비용이 발생합니다. 12자 이상 무작위 암호는 수억 달러를 초과하여 경제적으로 무의미합니다.`;
        report.mitigation = [
            { step: "01", title: "암호 최소 길이 16자", desc: `현재 ${pwLen}자 암호는 공격 가능 범위입니다. 16자 이상에서 방어력이 현실적 해독 불가 수준에 도달합니다.` },
            { step: "02", title: "Stretching 라운드 상향", desc: `응답 시간 100~300ms 기준으로 현재 ${shieldConfig.stretching}에서 단계적 상향합니다.` },
            { step: "03", title: "Argon2id 마이그레이션 계획", desc: "중장기적으로 Argon2id 전환을 준비합니다." }
        ];
        report.verdict = `OWASP ASVS Level 2 표준을 충족합니다. 암호 길이 정책을 16자 이상으로 강화하면 충분히 안전합니다.`;
        report.technicalDepth = `${shieldConfig.algorithm === 'scrypt' ? 'Colin Percival(2009)의 Scrypt 논문은 Sequential Memory-Hard 함수를 정의하며 TMTO 비용 하한을 수학적으로 증명합니다.' : 'Bcrypt(Provos & Mazieres, 1999)는 Blowfish 키 확장 비용을 해싱에 활용하며 2^cost 연산을 강제합니다.'}`;
        report.attackVector = `${methodLabel} | ${hwLabel} | ${threads} Threads | ~수천 H/s`;
        report.cryptoAnalysis = `키 스트레칭: ${shieldConfig.stretching}라운드 | Salt: ${shieldConfig.useSalt ? '적용' : '미적용'} | ${pepperActive ? `Pepper: ${pepperLen}자 활성` : 'Pepper: 미적용'}`;
    }

    return { isSuccess, ...report };
};

module.exports = { analyzeAttack };