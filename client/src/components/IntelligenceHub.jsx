import React from 'react';
import { Activity, Info } from 'lucide-react';
import { ALGORITHMS } from '../constants/ShieldBoxConstants';

/**
 * IntelligenceHub Component
 * @param {Object} crackTimes - 시뮬레이션된 해독 시간 데이터
 * @param {Object} config - 현재 적용된 알고리즘 설정
 * @param {boolean} isShielded - 보호 모드 활성화 여부
 */
const IntelligenceHub = ({ crackTimes, config, isShielded }) => {
  // 현재 선택된 알고리즘의 메타데이터(팁 등)를 가져옵니다.
  const currentAlgo = ALGORITHMS.find(a => a.id === config.algorithm);

  // 원본 디자인 색상 배열
  const displayItems = [
    { label: 'Single PC', key: 'pc', color: 'text-orange-400', bg: 'bg-orange-400/8', border: 'border-orange-400/20' },
    { label: 'GPU Cluster', key: 'gpu', color: 'text-red-400', bg: 'bg-red-400/8', border: 'border-red-400/20' },
    { label: 'Quantum', key: 'quantum', color: 'text-blue-400', bg: 'bg-blue-400/8', border: 'border-blue-400/20' }
  ];

  return (
    /* 원본 폼 디자인: flex-[1.5], bg-bg-card, rounded-[2rem], shadow-sm */
    <div className="flex-[1.5] bg-bg-card border border-border-subtle rounded-[2rem] p-6 shadow-sm flex flex-col gap-4 overflow-hidden">
      
      {/* 1. 타이틀 섹션 (원본 스타일 유지) */}
      <div className="flex items-center gap-2 shrink-0">
        <Activity size={16} className="text-brand-primary" />
        <h3 className="text-xs font-black text-text-bright uppercase tracking-widest font-mono">
          Intelligence Hub
        </h3>
      </div>

      {/* 2. 하드웨어 시나리오 그리드 (원본 색상 및 레이아웃 복구) */}
      <div className="grid grid-cols-3 gap-3 shrink-0">
        {displayItems.map(item => (
          <div 
            key={item.key} 
            className={`${item.bg} border ${item.border} py-4 px-3 rounded-2xl flex flex-col items-center gap-1.5`}
          >
            <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest font-mono">
              {item.label}
            </span>
            <span className={`text-xs font-black ${item.color} text-center font-mono`}>
              {crackTimes[item.key]}
            </span>
          </div>
        ))}
      </div>

      {/* 3. 전문가 분석 영역 (원본 디자인 및 알고리즘 팁 복구) */}
      <div className="flex-1 bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/15 flex items-start gap-3 overflow-y-auto custom-scrollbar">
        <div className="p-1.5 bg-brand-primary/15 rounded-lg shrink-0 mt-0.5">
          <Info size={16} className="text-brand-primary" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-black text-text-bright uppercase tracking-widest font-mono">
            Expert Analysis
          </h4>
          <p className="text-sm leading-relaxed text-text-base">
            {/* 보호 완료 시와 대기 시의 메시지 분기 로직 유지 */}
            {isShielded 
              ? '보안 임계치 시뮬레이션을 위한 데이터 스트리밍이 완료되었습니다. 공격 시나리오를 가동하여 취약점을 점검하십시오.' 
              : (currentAlgo?.tip || '알고리즘을 선택하여 보안 분석을 시작하십시오.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceHub;