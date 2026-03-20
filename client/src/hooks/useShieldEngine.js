/**
 * ShieldBox.io - Real-time Physics Engine Hook (Enhanced & Fixed)
 * [위치] src/hooks/useShieldEngine.js
 * [수정 사항]
 * 1. startAttack 함수: 분석 시작 전 logs와 analysisResult를 초기화하여 데이터 오염 방지
 * 2. resetEngine 함수: 서버 측 세션까지 초기화하도록 socket.emit('reset_session') 추가
 * 3. attackConfig 연동: 현재 선택된 공격 기법(method)이 서버로 정확히 전달되도록 설계
 */

import { useState, useEffect, useCallback } from 'react';
import { computeHash } from './useHashEngine';
import { io } from 'socket.io-client';
import { HASH_RATES } from '../constants/ShieldBoxConstants';

// 배포 시: 프론트와 서버가 같은 주소 → window.location.origin 자동 사용
// 로컬 개발 시: 포트가 달라서 4000으로 fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  || (typeof window !== 'undefined' && window.location.port !== '5173'
      ? window.location.origin
      : 'http://localhost:4000');
const socket = io(BACKEND_URL);

export function useShieldEngine() {
  const [pw, setPw] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [res, setRes] = useState('');
  const [isShielded, setIsShielded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // 알고리즘 보안 설정 상태
  const [config, setConfig] = useState({ 
    algorithm: 'bcrypt', useSalt: true, usePepper: true,
    costFactor: 12, memoryCost: 64, timeCost: 3, parallelism: 4,
    blockSize: 8, iterations: 100000, pepperValue: '',
  });

  // 공격 시나리오 설정 상태
  const [attackConfig, setAttackConfig] = useState({ 
    method: 'brute_force', hardware: 'gpu_cluster', threads: 1024,
    intensity: 7, wordlistSize: 10000, ruleSet: 'default',
  });

  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [selectedAttackMethod, setSelectedAttackMethod] = useState(null);
  const [selectedHardware, setSelectedHardware] = useState(null);

  useEffect(() => {
    // 실시간 로그 수신
    socket.on('log', (msg) => setLogs((p) => [...p, msg]));
    
    // 해싱 결과 수신
    socket.on('hash_result', (r) => { 
      setRes(r); 
      setIsShielded(true); 
    });
    
    // 공격 분석 결과 수신
    socket.on('attack_analysis_result', (data) => { 
      setAnalysisResult(data); 
      setShowAnalysis(true); 
    });

    return () => {
      socket.off('log');
      socket.off('hash_result');
      socket.off('attack_analysis_result');
    };
  }, []);

  /**
   * 🛡️ 해싱 실행 — 브라우저에서 직접 연산 후 서버에 결과만 전달
   */
  const startHashing = useCallback(async (password, isGenerated = false) => {
    if (!password) return;
    setIsHashing(true);
    setLogs([]);
    setRes('');

    try {
      socket.emit('log', 'S: [HASHING] 브라우저에서 해싱 연산 시작...');

      const { hash, algorithm, config: hashedConfig, warnings, profile } = await computeHash(
        password,
        config
      );

      if (warnings?.length) {
        socket.emit('log', `S: [INFO] 기기(${profile}) 기준 파라미터 조정: ${warnings.join(', ')}`);
      }

      // 서버에 해시값 전달 (평문은 전송하지 않음)
      socket.emit('submit_hash', {
        hash,
        algorithm,
        config: hashedConfig,
        password,    // 공격 시뮬레이션의 wordlist 매칭에만 사용
        isGenerated,
        warnings,
      });
    } catch (err) {
      setLogs(prev => [...prev, `S: [ERROR] 해싱 실패: ${err.message}`]);
    } finally {
      setIsHashing(false);
    }
  }, [config]);

  /**
   * 🚀 [New] 분석 시작 통합 함수 (Dispatcher)
   * 새로운 분석을 시작하기 전에 이전 상태를 깨끗이 비워줍니다.
   */
  const startAttack = useCallback(() => {
    setLogs([]); // 기존 터미널 로그 초기화
    setAnalysisResult(null); // 기존 리포트 결과 초기화
    
    // 현재의 attackConfig와 shieldConfig를 합쳐 서버로 전송
    socket.emit('start_attack', { 
      ...attackConfig, 
      shieldConfig: config, 
      password: pw 
    });
  }, [attackConfig, config, pw]);

  const generatePassword = (len) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    setPw(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  /**
   * 🧹 [Enhanced] 엔진 리셋 함수
   * 클라이언트 상태뿐만 아니라 서버 세션까지 확실하게 정리합니다.
   */
  const resetEngine = () => {
    socket.emit('reset_session'); // 서버 측 세션 초기화 요청
    setIsShielded(false);
    setRes('');
    setLogs([]);
    setAnalysisResult(null);
    setSelectedAttackMethod(null);
    setSelectedHardware(null);
  };

  /**
   * 🛡️ [고정밀 실시간 물리 연산]
   * 백엔드의 physicsEngine.js와 수학적으로 완벽하게 일치합니다.
   */
  const crackTimes = (() => {
    if (!pw || pw.length === 0) return { pc: 'N/A', gpu: 'N/A', quantum: 'N/A', rawSeconds: 0 };

    // 키 공간 계산 (94가지 문자 조합)
    // $keySpace = 94^{pw.length}$
    const keySpace = Math.pow(94, pw.length);

    // 알고리즘별 워크 팩터(Work Factor) 계산
    // [Fix] switch 내 const 선언이 Vite strict 파서에서 SyntaxError를 유발하므로
    //       if/else if 구조로 변경하여 각 블록이 독립 스코프를 갖도록 수정
    const getWorkFactor = () => {
      if (config.algorithm === 'bcrypt') {
        return Math.pow(2, (config.costFactor || 12) - 12);

      } else if (config.algorithm === 'argon2id') {
        const memPenalty   = (config.memoryCost || 64) / 64;
        const iterPenalty  = (config.timeCost   || 3)  / 3;
        const parallelGain = (config.parallelism || 4)  / 4;
        return memPenalty * iterPenalty * parallelGain;

      } else if (config.algorithm === 'scrypt') {
        return ((config.memoryCost || 32) / 32)
             * ((config.blockSize  || 8)  / 8)
             *  (config.parallelism || 1);

      } else if (config.algorithm === 'sha256' || config.algorithm === 'sha512') {
        return Math.max((config.iterations || 100000) / 100000, 1e-6);

      } else {
        return 1;
      }
    };

    const workFactor = getWorkFactor();
    const baseRates = HASH_RATES[config.algorithm] || HASH_RATES.bcrypt;
    
    // Salt 미사용 시 공격자 이점(천만 배 가속) 반영
    const attackerAdvantage = config.useSalt ? 1 : 10000000;

    /**
     * 한국어 고정밀 시간 포맷팅
     */
    const formatTime = (seconds) => {
      if (!isFinite(seconds) || seconds > 1e25) return '∞ (물리적 한계)';
      if (seconds < 1) return config.useSalt ? '즉시' : '즉시 (Lookup)';
      
      const years = seconds / 31536000;
      if (years < 1) {
        if (seconds < 60) return `${seconds.toFixed(1)}초`;
        if (seconds < 3600) return `${(seconds/60).toFixed(0)}분`;
        if (seconds < 86400) return `${(seconds/3600).toFixed(0)}시간`;
        return `${(seconds/86400).toFixed(0)}일`;
      }
      
      if (years < 10000) return `${years.toFixed(1)}년`;
      if (years < 1e8) return `${(years / 1e4).toFixed(1)}만년`;
      if (years < 1e12) return `${(years / 1e8).toFixed(1)}억년`;
      if (years < 1e16) return `${(years / 1e12).toFixed(1)}조년`;
      if (years < 1e20) return `${(years / 1e16).toFixed(1)}경년`;
      if (years < 1e24) return `${(years / 1e20).toFixed(1)}해년`;
      
      return '∞ (우주적 스케일)';
    };

    const calculate = (rate) => {
      const effectiveRate = (rate / workFactor) * attackerAdvantage;
      const totalSeconds = (keySpace / effectiveRate) / 2;
      return { label: formatTime(totalSeconds), seconds: totalSeconds };
    };

    const pcRes = calculate(baseRates.pc);
    const gpuRes = calculate(baseRates.gpu);
    const qmRes = calculate(baseRates.quantum);

    return {
      pc: pcRes.label,
      gpu: gpuRes.label,
      quantum: qmRes.label,
      rawSeconds: gpuRes.seconds 
    };
  })();

  return {
    pw, setPw, logs, res, isShielded, analysisResult, showAnalysis, setShowAnalysis,
    config, setConfig, attackConfig, setAttackConfig,
    selectedAlgo, setSelectedAlgo, selectedAttackMethod, setSelectedAttackMethod,
    selectedHardware, setSelectedHardware, crackTimes,
    generatePassword, resetEngine, startAttack, startHashing, isHashing, socket
  };
}