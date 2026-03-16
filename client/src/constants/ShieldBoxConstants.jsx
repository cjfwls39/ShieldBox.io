import React from 'react';
import { 
  Flame, BookOpen, Layers, Network, GitBranch, Radio, Wifi, 
  Cpu, Server, HardDrive, Binary, Fingerprint, Database, History, Zap
} from 'lucide-react';

/**
 * 1. 공격 기법 마스터 데이터 (7종 완전 복구)
 */
export const ATTACK_METHODS = [
  { 
    id: 'brute_force', label: 'Brute Force', icon: <Flame size={16}/>,
    color: 'text-red-500', border: 'border-red-500/40', bg: 'bg-red-500/5',
    tip: '가능한 모든 조합을 순차 대입하여 키 공간 전체를 탐색합니다. 짧은 암호에 치명적입니다.' 
  },
  { 
    id: 'dictionary', label: 'Dictionary Attack', icon: <BookOpen size={16}/>,
    color: 'text-orange-400', border: 'border-orange-400/40', bg: 'bg-orange-400/5',
    tip: '유출된 암호 DB나 사전 단어를 기반으로 패턴을 우선 탐색합니다. 사람이 만든 암호에 효과적입니다.' 
  },
  { 
    id: 'rainbow_table', label: 'Rainbow Table', icon: <Layers size={16}/>,
    color: 'text-purple-400', border: 'border-purple-400/40', bg: 'bg-purple-400/5',
    tip: '미리 계산된 해시 역조회 테이블을 사용해 즉각적으로 평문을 찾습니다. Salt가 없는 시스템에 효과적입니다.' 
  },
  { 
    id: 'credential_stuffing', label: 'Credential Stuffing', icon: <Network size={16}/>,
    color: 'text-yellow-400', border: 'border-yellow-400/40', bg: 'bg-yellow-400/5',
    tip: '다른 사이트에서 유출된 계정 정보를 재사용하여 로그인을 시도하는 공격입니다.' 
  },
  { 
    id: 'mask_attack', label: 'Mask Attack', icon: <GitBranch size={16}/>,
    color: 'text-cyan-400', border: 'border-cyan-400/40', bg: 'bg-cyan-400/5',
    tip: '특정 구조 패턴(예: 대문자 시작+숫자 종료)을 지정하여 효율적으로 탐색하는 지능형 공격입니다.' 
  },
  { 
    id: 'rule_based', label: 'Rule-Based Attack', icon: <Radio size={16}/>,
    color: 'text-pink-400', border: 'border-pink-400/40', bg: 'bg-pink-400/5',
    tip: 'leet speak, 대소문자 혼합 등 다양한 변형 규칙을 적용하여 탐색하는 하이브리드 공격입니다.' 
  },
  { 
    id: 'side_channel', label: 'Side-Channel', icon: <Wifi size={16}/>,
    color: 'text-slate-400', border: 'border-slate-400/40', bg: 'bg-slate-400/5',
    tip: '알고리즘의 실행 시간이나 전력 소모 등 물리적 신호를 분석하여 암호 키를 유추합니다.' 
  }
];

/**
 * 2. 공격 방식별 세부 파라미터 (7종 전체 ranges 설정)
 */
export const ATTACK_PARAMS = {
  brute_force: { 
    params: ['intensity', 'threads'],
    ranges: {
      intensity: { min: 1, max: 10, step: 1, unit: '', label: '공격 강도' },
      threads: { min: 64, max: 4096, step: 64, unit: 'T', label: '병렬 스레드' }
    }
  },
  dictionary: { 
    params: ['intensity', 'threads', 'wordlistSize'],
    ranges: {
      intensity: { min: 1, max: 10, step: 1, unit: '', label: '변형 규칙 강도' },
      threads: { min: 64, max: 2048, step: 64, unit: 'T', label: '스레드 수' },
      wordlistSize: { min: 1000, max: 100000, step: 5000, unit: 'W', label: '사전 크기' }
    }
  },
  rainbow_table: { 
    params: ['wordlistSize'],
    ranges: {
      wordlistSize: { min: 10000, max: 500000, step: 10000, unit: 'H', label: '테이블 밀도' }
    }
  },
  credential_stuffing: { 
    params: ['threads', 'wordlistSize'],
    ranges: {
      threads: { min: 1, max: 512, step: 1, unit: 'T', label: '동시 접속' },
      wordlistSize: { min: 1000, max: 50000, step: 1000, unit: 'DB', label: '유출 데이터 크기' }
    }
  },
  mask_attack: { 
    params: ['intensity', 'threads'],
    ranges: {
      intensity: { min: 1, max: 10, step: 1, unit: '', label: '패턴 복잡도' },
      threads: { min: 64, max: 2048, step: 64, unit: 'T', label: '연산 스레드' }
    }
  },
  rule_based: { 
    params: ['intensity', 'threads'],
    ranges: {
      intensity: { min: 1, max: 10, step: 1, unit: '', label: '규칙 강도' },
      threads: { min: 64, max: 2048, step: 64, unit: 'T', label: '병렬 처리' }
    }
  },
  side_channel: { 
    params: ['intensity'],
    ranges: {
      intensity: { min: 1, max: 10, step: 1, unit: '', label: '샘플링 정밀도' }
    }
  }
};

/**
 * 3. 하드웨어 옵션
 */
export const HARDWARE_OPTIONS = [
  { id: 'single_cpu', label: 'Single CPU', sub: 'Ryzen 9 7950X', icon: <Cpu size={14}/>, threads: 32 },
  { id: 'gpu_single', label: 'GPU (Single)', sub: 'RTX 4090', icon: <Server size={14}/>, threads: 128 },
  { id: 'gpu_cluster', label: 'GPU Cluster', sub: '8× RTX 4090', icon: <Network size={14}/>, threads: 1024 },
  { id: 'asic', label: 'ASIC Rig', sub: 'Custom Logic', icon: <Zap size={14}/>, threads: 4096 },
  { id: 'cloud_farm', label: 'Cloud Farm', sub: 'AWS p4d.24xl', icon: <HardDrive size={14}/>, threads: 2048 },
  { id: 'quantum', label: 'Quantum (이론)', sub: 'Grover\'s Engine', icon: <Binary size={14}/>, threads: 9999 }
];

/**
 * 4. 알고리즘 튜닝 파라미터
 */
export const ALGO_PARAMS = {
  argon2id: { params: ['memoryCost','timeCost','parallelism'], ranges: { memoryCost: { min:16, max:512, step:16, unit:'MB', label:'Memory Cost' }, timeCost: { min:1, max:10, step:1, unit:'iter', label:'Time Cost' }, parallelism: { min:1, max:16, step:1, unit:'T', label:'Parallelism' } } },
  bcrypt: { params: ['costFactor'], ranges: { costFactor: { min:4, max:16, step:1, unit:'', label:'Cost Factor' } } },
  scrypt: { params: ['memoryCost','blockSize','parallelism'], ranges: { memoryCost: { min:8, max:256, step:8, unit:'MB', label:'Memory Cost' }, blockSize: { min:1, max:32, step:1, unit:'Block Size' }, parallelism: { min:1, max:8, step:1, unit:'T', label:'Parallelism' } } },
  sha512: { params: ['iterations'], ranges: { iterations: { min:1, max:600000, step:10000, unit:'iter', label:'Iterations' } } },
  sha256: { params: ['iterations'], ranges: { iterations: { min:1, max:600000, step:10000, unit:'iter', label:'Iterations' } } },
  md5: { params:[], ranges:{} }
};

/**
 * 5. 알고리즘 메타데이터 (디자인 원본 복구)
 */
export const ALGORITHMS = [
  { 
    id:'argon2id', name:'Argon2id', icon:<Fingerprint size={18}/>, grade:'S', 
    gradeColor:'text-emerald-400', gradeBg:'bg-emerald-400/10', gradeBorder:'border-emerald-400/40',
    category:'Memory-Hard', tip:'메모리 하드 함수로 GPU/ASIC 병렬 공격을 구조적으로 무력화합니다. NIST 권고 알고리즘.' 
  },
  { 
    id:'bcrypt', name:'bcrypt', icon:<Cpu size={18}/>, grade:'A', 
    gradeColor:'text-blue-400', gradeBg:'bg-blue-400/10', gradeBorder:'border-blue-400/40',
    category:'Key-Stretch', tip:'Cost Factor를 지수적으로 조절하여 미래 하드웨어 발전에 유연하게 대응합니다.' 
  },
  { 
    id:'scrypt', name:'scrypt', icon:<HardDrive size={18}/>, grade:'A', 
    gradeColor:'text-blue-400', gradeBg:'bg-blue-400/10', gradeBorder:'border-blue-400/40',
    category:'Memory-Hard', tip:'N·r·p 파라미터로 메모리 비용을 독립적으로 조절하여 ASIC 공격에 강합니다.' 
  },
  { 
    id:'sha512', name:'SHA-512', icon:<Database size={18}/>, grade:'C', 
    gradeColor:'text-yellow-400', gradeBg:'bg-yellow-400/10', gradeBorder:'border-yellow-400/40',
    category:'Fast Hash', tip:'범용 해시 함수입니다. 보안을 위해 Salt 병행 및 PBKDF2 반복 적용이 필수입니다.' 
  },
  { 
    id:'sha256', name:'SHA-256', icon:<Database size={18}/>, grade:'C', 
    gradeColor:'text-yellow-400', gradeBg:'bg-yellow-400/10', gradeBorder:'border-yellow-400/40',
    category:'Fast Hash', tip:'인터넷 표준 해시입니다. 단순 해시만으로는 현대적 공격 시나리오에 취약할 수 있습니다.' 
  },
  { 
    id:'md5', name:'MD5', icon:<History size={18}/>, grade:'F', 
    gradeColor:'text-red-500', gradeBg:'bg-red-500/10', gradeBorder:'border-red-500/40',
    category:'Deprecated', tip:'충돌 저항성이 붕괴되었습니다. 보안 목적으로 절대 사용하지 말고 즉시 마이그레이션하십시오.' 
  }
];

/**
 * 6. 성능 벤치마크 데이터
 */
export const HASH_RATES = {
  md5: { pc: 1e9, gpu: 1.64e10, quantum: 1e14 },
  sha256: { pc: 5e8, gpu: 3.5e9, quantum: 1e13 },
  sha512: { pc: 2e8, gpu: 3.5e9, quantum: 1e13 },
  bcrypt: { pc: 100, gpu: 5000, quantum: 1e7 },
  scrypt: { pc: 50, gpu: 500, quantum: 1e6 },
  argon2id: { pc: 10, gpu: 50, quantum: 5e5 }
};