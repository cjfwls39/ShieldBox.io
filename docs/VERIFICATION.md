# physicsEngine 수치 교정 — 상세 기록

[README.md](../README.md)의 [🔬 physicsEngine 수치 검증](../README.md#-physicsengine-수치-검증) 섹션에서 요약한 내용의 전체 데이터입니다.

## 교정 전/후 비교

`shield-config.js`의 `hashRates`를 하드웨어별로 분리하고, Hashcat 실측값으로 교체했습니다.

| 알고리즘 | 항목 | v1 (구) | v2 (교정) | 출처 |
|---------|------|---------|----------|------|
| MD5 | GPU Single | 16.4 GH/s | **164.1 GH/s** | Hashcat Mode 0 실측 |
| MD5 | GPU Cluster | 16.4 GH/s | **1.31 TH/s** | × 8 선형 스케일 |
| SHA-256 | GPU Single | 3.5 GH/s | **21.97 GH/s** | Hashcat Mode 1400 실측 |
| SHA-512 | GPU Single | 3.5 GH/s | **7.48 GH/s** | Hashcat Mode 1700 실측 |
| bcrypt CF=12 | GPU Single | 5,000 H/s | **1,437 H/s** | Hashcat Mode 3200 (CF=5: 184kH/s ÷ 2⁷) |
| scrypt 32MB | GPU Single | 500 H/s | **3,563 H/s** | Hashcat Mode 8900 (N=16384: 7,126 ÷ 2) |

`physicsEngine.js`의 하드웨어 속도 매핑도 함께 바꿨습니다.

```js
// v1: 모든 GPU 계열을 단일 rates.gpu로 처리 (Single과 Cluster가 같은 값이 됨)
const hwRate = hardware.includes('gpu') ? rates.gpu : rates.pc;

// v2: hardware key를 rates 객체에서 직접 참조
const hwRate = rates[hardware] ?? (hardware.includes('gpu') ? rates.gpu_single : rates.pc);
```

## 교정 후 수치

기준: 11자 비밀번호(`password123`), 탐색 공간 94¹¹. "Hashcat 기반 실측"은 Hashcat이 측정한 해시 속도를 physicsEngine과 동일한 수식에 그대로 대입한 값입니다 — 같은 rate로 같은 공식을 두 번 돌린 것이므로 일치하는 게 당연하지만, v1에서는 rate 자체가 틀려서 이마저도 안 맞았습니다.

| 알고리즘 | 하드웨어 | ShieldBox 추정 | Hashcat 수치 대입 | 배율 |
|---------|---------|--------------|----------------|------|
| MD5 | GPU Single (RTX 4090) | 25.71분 | 25.71분 | 1.00x |
| MD5 | GPU Cluster (× 8) | 3.21분 | 3.21분 | 1.00x |
| SHA-256 | GPU Single | 3,650년 | 3,650년 | 1.00x |
| SHA-256 | GPU Cluster | 456년 | 456년 | 1.00x |
| SHA-512 | GPU Single | 1.07만년 | 1.07만년 | 1.00x |
| bcrypt CF=12 | GPU Single | 558억년 | 558억년 | 1.00x |
| bcrypt CF=12 | GPU Cluster | 69.75억년 | 69.73억년 | 1.00x |
| scrypt 32MB | GPU Single | 225억년 | 225억년 | 1.00x |
| scrypt 32MB | GPU Cluster | 28.15억년 | 28.14억년 | 1.00x |

## 하드웨어 티어별 산출 근거

6개 하드웨어 옵션 중 실제로 Hashcat 실측값에 기반한 건 GPU Single/Cluster뿐입니다. 나머지는 명시적인 근거를 두고 파생하거나 추정했습니다. "어디까지가 실측이고 어디부터가 추정인가"를 구분하는 게 핵심입니다.

| 하드웨어 | 산출 근거 | 분류 |
|---------|---------|------|
| GPU Single (RTX 4090) | Hashcat v6.2.6 실측 벤치마크 | 실측 |
| GPU Cluster (8× RTX 4090) | GPU Single × 8 (선형 스케일) | 실측 기반 스케일 |
| Cloud Farm (AWS p4d.24xl) | 8× A100 ≈ GPU 클러스터 동급으로 매핑 | 추정(파생) |
| ASIC Rig | 빠른 해시(MD5/SHA): GPU 클러스터 × 2.3 / 메모리 하드(bcrypt·scrypt·argon2id): ASIC 이점 없어 클러스터와 동일 | 추정(파생) |
| Single CPU (Ryzen 9 7950X) | 알고리즘별 CPU 단일 코어 추정치 (Hashcat CPU 벤치마크 미반영) | 추정 |
| Quantum (이론) | 이론적 상한 상수 — 아래 참조 | 이론적 가정 |

**ASIC가 메모리 하드 함수에 이점이 없는 이유**: bcrypt·scrypt·argon2id는 설계상 대량의 메모리 대역폭을 요구하므로, 연산 회로를 특화해도 메모리 병목이 그대로 남습니다. ASIC의 강점은 연산이 단순한 MD5/SHA 계열에만 적용됩니다.

## Quantum 하드웨어를 교정하지 않은 이유

CPU·GPU 속도는 Hashcat이라는 실측 기준이 있어서 교정할 수 있었습니다. 양자 컴퓨터의 해시 크래킹 벤치마크는 존재하지 않으므로, 어떤 수치를 넣어도 그건 추측입니다.

Grover 알고리즘을 적용하면 탐색 공간을 제곱근으로 줄일 수 있습니다(94¹¹ ≈ 2⁷² → 2³⁶). 하지만 실제 크랙 시간을 계산하려면 결국 양자 게이트의 처리 속도라는 상수가 필요한데, 이 값은 학계에서도 추정이 크게 엇갈립니다. √N 공식을 적용해도 그 안의 게이트 속도는 여전히 임의의 추측값이라서, 결과적으로 정밀한 수학으로 포장된 추측이 됩니다.

게다가 ShieldBox가 권장하는 메모리 하드 함수(argon2id, scrypt)는 Grover 오라클을 구성하는 것 자체가 비현실적이라고 평가됩니다. 단순하게 √N만 적용하면 가장 안전한 알고리즘들의 위협을 과장하게 됩니다.

그래서 Quantum 값은 calibration된 실측값이 아니라, "이론적 미래 하드웨어에서도 강력한 암호는 즉시 뚫리지 않는다"는 방향성을 전달하는 교육용 상한 지표로 남겨뒀습니다. UI에도 `(이론)` 라벨을 붙여 calibration된 다른 하드웨어와 구분했습니다.
