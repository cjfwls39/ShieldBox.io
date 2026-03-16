/**
 * ShieldBox.io - Intelligence Monitor Terminal (Enhanced)
 * [위치] src/components/MonitorTerminal.jsx
 * [특징] 
 * 1. 실시간 스트리밍 로그 렌더링 및 최신 로그 자동 추적 (Auto-scroll)
 * 2. 상태별 테마 연동: Shielding 모드(Blue) vs Attack 모드(Red)
 * 3. 최종 Hash Result 박스에 애니메이션 및 글로우 효과 적용
 */

import React, { useEffect } from 'react';
import { Terminal } from 'lucide-react';

const MonitorTerminal = ({ logs, res, isShielded, scrollRef }) => {
  
  // 새로운 로그가 들어올 때마다 최하단으로 부드럽게 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    /* 터미널 본체: 깊이감 있는 블랙 배경과 은은한 테두리 */
    <div className="flex-[3] bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col min-h-0 relative group">
      
      {/* 1. 터미널 헤더 바 (실시간 상태 반영) */}
      <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-white/5 font-mono text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <Terminal 
            size={18} 
            className={`transition-colors duration-500 ${isShielded ? 'text-brand-danger' : 'text-brand-primary'}`} 
          /> 
          <span className="tracking-widest uppercase font-black opacity-80">Analysis Stream Output</span>
        </div>
        <div className="flex gap-2 items-center">
          {/* 상태에 따른 핑(Ping) 애니메이션 컬러 변경 */}
          <div className={`w-1.5 h-1.5 rounded-full animate-ping ${isShielded ? 'bg-brand-danger' : 'bg-brand-primary'}`} /> 
          <span className="font-bold tracking-tighter">MONITORING</span>
        </div>
      </div>

      {/* 2. 로그 출력 영역 (커스텀 스크롤바 적용) */}
      <div className="p-8 overflow-y-auto flex-1 font-mono text-sm space-y-3.5 custom-scrollbar bg-black/20 text-slate-300 relative">
        {/* 로그가 없을 때의 초기 가이드 */}
        {logs.length === 0 && !res && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none pointer-events-none">
             <p className="text-xs uppercase tracking-[0.3em] font-black italic">Waiting for Intelligence Stream...</p>
          </div>
        )}

        {/* 개별 로그 아이템 */}
        {logs.map((log, i) => (
          <div key={i} className={`flex gap-3 border-l-2 ${log.startsWith('A:') ? 'border-brand-danger/30' : 'border-brand-primary/30'} pl-4 animate-in fade-in slide-in-from-left-2 duration-300`}>
            <span className={`${log.startsWith('A:') ? 'text-brand-danger/50' : 'text-brand-primary/50'} shrink-0 font-black`}>❯</span>
            <span className="leading-relaxed">{log.replace(/^[SA]:\s*/, '')}</span>
          </div>
        ))}

        {/* 3. 최종 해시 결과 박스 (강렬한 시각적 효과) */}
        {res && (
          <div className="mt-8 relative group/hash">
            <div className="absolute -inset-1 bg-brand-primary/20 rounded-2xl blur opacity-30 group-hover/hash:opacity-50 transition-opacity duration-500" />
            <div className="relative p-6 bg-brand-primary/10 border-2 border-brand-primary/30 rounded-2xl text-white break-all shadow-inner font-black text-sm tracking-tight leading-relaxed selection:bg-brand-primary selection:text-white">
              <div className="text-[10px] uppercase opacity-40 mb-2 font-mono tracking-widest flex items-center gap-2">
                <div className="w-1 h-1 bg-brand-primary rounded-full animate-pulse" /> Final Hash Output
              </div>
              {res}
            </div>
          </div>
        )}

        {/* 스크롤 앵커 */}
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* 터미널 하단 그라데이션 오버레이 (가독성 향상) */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default MonitorTerminal;