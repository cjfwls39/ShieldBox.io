import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sun, Moon, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

// 1. 리팩토링된 엔진 및 컴포넌트 임포트
import { useShieldEngine } from './hooks/useShieldEngine';
import KeyInputPanel from './components/KeyInputPanel';
import ActionControlPanel from './components/ActionControlPanel';
import MonitorTerminal from './components/MonitorTerminal';
import IntelligenceHub from './components/IntelligenceHub';
import ReportModal from './components/ReportModal';

export default function App() {
  // A. 비즈니스 로직 엔진 로드 (모든 상태와 액션을 관리)
  const engine = useShieldEngine();
  const { 
    pw, setPw, isShielded, config, logs, res, 
    showAnalysis, setShowAnalysis, analysisResult, 
    generatePassword, crackTimes 
  } = engine;

  // B. 테마 상태 관리 (원본 로직 유지)
  const [isDark, setIsDark] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // C. 보안 등급 배지 계산 (원본의 시각적 조건 완벽 복구)
  const securityBadge = (() => {
    // Argon2id를 사용하고 30자 이상일 때 '치명적 안전'
    if (pw.length >= 30 && config.algorithm === 'argon2id') 
      return { label: '치명적 안전', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: <ShieldCheck size={16}/> };
    // 16자 이상일 때 '안전함'
    if (pw.length >= 16) 
      return { label: '안전함', color: 'text-brand-primary', bg: 'bg-brand-primary/10', icon: <CheckCircle2 size={16}/> };
    // 그 외 '보안 취약'
    return { label: '보안 취약', color: 'text-brand-danger', bg: 'bg-brand-danger/10', icon: <AlertCircle size={16}/> };
  })();

  return (
    /* 전체 화면 배경 및 폰트 설정 (index.css 변수 참조) */
    <div className="h-screen overflow-hidden flex flex-col bg-bg-main transition-colors duration-300 font-main p-5 text-text-base">
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col gap-4 min-h-0">
        
        {/* 1. 상단 헤더 영역 (원본 디자인 복구) */}
        <header className="flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-brand-primary rounded-xl shadow-lg"><Shield size={24} className="text-white" /></div>
            <h1 className="text-2xl font-black text-text-bright uppercase tracking-tight">
              SHIELD BOX<span className="text-brand-primary">.IO</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* 테마 전환 버튼 */}
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-bg-card border border-border-subtle text-text-bright hover:border-brand-primary transition-all">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {/* 실시간 보안 상태 배지 */}
            <div className={`px-4 py-1.5 rounded-lg text-xs font-black ${securityBadge.bg} ${securityBadge.color} border border-current/20 flex items-center gap-2 shadow-sm`}>
               {securityBadge.icon} {securityBadge.label}
            </div>
          </div>
        </header>

        {/* 2. 메인 그리드 레이아웃 (좌측 4 : 우측 8 비율 유지) */}
        <div className="flex-1 grid lg:grid-cols-12 gap-4 min-h-0">
          
          {/* 좌측: 컨트롤 및 설정 섹션 (Aside) */}
          <aside className="lg:col-span-4 flex flex-col gap-4 min-h-0">
            <KeyInputPanel 
              pw={pw} 
              setPw={setPw} 
              isShielded={isShielded} 
              onGenerate={generatePassword} 
            />
            {/* 알고리즘별 고유 테마를 포함한 컨트롤 패널 */}
            <ActionControlPanel engine={engine} />
          </aside>

          {/* 우측: 모니터링 및 시뮬레이션 섹션 (Main) */}
          <main className="lg:col-span-8 flex flex-col gap-4 min-h-0">
            <MonitorTerminal 
              logs={logs} 
              res={res} 
              isShielded={isShielded} 
              scrollRef={scrollRef} 
            />
            <IntelligenceHub 
              crackTimes={crackTimes} 
              config={config} 
              isShielded={isShielded} 
            />
          </main>
        </div>
      </div>

      {/* 3. 분석 보고서 오버레이 레이어 */}
      <ReportModal engine={engine} />
    </div>
  );
}