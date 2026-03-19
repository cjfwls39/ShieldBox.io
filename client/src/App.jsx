import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Moon, ShieldCheck, CheckCircle2, AlertCircle, GraduationCap, Terminal as TerminalIcon } from 'lucide-react';

import { useShieldEngine } from './hooks/useShieldEngine';
import KeyInputPanel from './components/KeyInputPanel';
import ActionControlPanel from './components/ActionControlPanel';
import MonitorTerminal from './components/MonitorTerminal';
import IntelligenceHub from './components/IntelligenceHub';
import ReportModal from './components/ReportModal';
import AcademyHub from './components/academy/AcademyHub';

// [추가] 인트로 컴포넌트 임포트
import ShieldBoxIntro from './components/ShieldBoxIntro';

export default function App() {
  // ── [추가] 인트로 상태 관리 ──
  const [showIntro, setShowIntro] = useState(true);

  const engine = useShieldEngine();
  const { pw, setPw, isShielded, config, logs, res, generatePassword, crackTimes } = engine;

  const [activeTab, setActiveTab] = useState('simulation');
  const [isDark, setIsDark] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const securityBadge = (() => {
    if (pw.length >= 30 && config.algorithm === 'argon2id')
      return { label: '치명적 안전', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <ShieldCheck size={16}/> };
    if (pw.length >= 16)
      return { label: '안전함', color: 'text-brand-primary', bg: 'bg-brand-primary/10', icon: <CheckCircle2 size={16}/> };
    return { label: '보안 취약', color: 'text-brand-danger', bg: 'bg-brand-danger/10', icon: <AlertCircle size={16}/> };
  })();

  return (
    // AnimatePresence를 통해 인트로와 본문 사이의 전환을 부드럽게 처리합니다.
    <AnimatePresence mode="wait">
      {showIntro ? (
        // ── [추가] 인트로 화면 ──
        <ShieldBoxIntro key="intro-screen" onFinish={() => setShowIntro(false)} />
      ) : (
        // ── 메인 애플리케이션 (원본 코드 보존) ──
        <motion.div 
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`app-root h-screen overflow-hidden flex flex-col bg-bg-main font-main p-3 md:p-5 text-text-base transition-colors duration-500`}
        >
          <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col gap-3 md:gap-4 min-h-0">

            {/* ── 헤더 ── */}
            <header className="header-row flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">

              {/* 좌측: 로고 + 탭 네비 */}
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setActiveTab('simulation')}>
                  <div className="p-2 md:p-2.5 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h1 className="header-logo-text text-base sm:text-xl md:text-2xl font-black text-text-bright uppercase tracking-tight">
                    SHIELD BOX<span className="text-brand-primary">.IO</span>
                  </h1>
                </div>

                {/* 탭 네비게이션 */}
                <nav className="header-nav flex items-center bg-bg-card border border-border-subtle p-1 rounded-2xl relative shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveTab('simulation')}
                    className={`relative z-10 px-3 sm:px-5 md:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black transition-colors flex items-center gap-1.5 ${activeTab === 'simulation' ? 'text-brand-primary' : 'text-text-dim'}`}
                  >
                    {activeTab === 'simulation' && (
                      <motion.div layoutId="nav-bg" className="absolute inset-0 bg-bg-input rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                    )}
                    <TerminalIcon size={12} />
                    <span className="hidden sm:inline">SIMULATION</span>
                    <span className="sm:hidden">SIM</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('academy')}
                    className={`relative z-10 px-3 sm:px-5 md:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black transition-colors flex items-center gap-1.5 ${activeTab === 'academy' ? 'text-brand-primary' : 'text-text-dim'}`}
                  >
                    {activeTab === 'academy' && (
                      <motion.div layoutId="nav-bg" className="absolute inset-0 bg-bg-input rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                    )}
                    <GraduationCap size={13} />
                    <span className="hidden sm:inline">ACADEMY</span>
                    <span className="sm:hidden">ACA</span>
                  </button>
                </nav>
              </div>

              {/* 우측: 다크모드 토글 + 보안 배지 */}
              <div className="header-actions flex items-center gap-2 md:gap-3 ml-auto">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-1.5 md:p-2 rounded-full bg-bg-card border border-border-subtle text-text-bright hover:border-brand-primary transition-all"
                  title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
                >
                  {isDark
                    ? <Sun  size={16} className="text-amber-500" />
                    : <Moon size={16} className="text-brand-primary" />
                  }
                </button>

                <div className={`header-badge px-2.5 md:px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-black ${securityBadge.bg} ${securityBadge.color} border border-current/20 flex items-center gap-1.5 shadow-sm`}>
                  {securityBadge.icon}
                  <span className="hidden sm:inline">{securityBadge.label}</span>
                </div>
              </div>
            </header>

            {/* ── 메인 콘텐츠 ── */}
            <div className="flex-1 relative min-h-0">
              <AnimatePresence mode="wait">
                {activeTab === 'simulation' ? (
                  <motion.div
                    key="sim"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="sim-grid h-full grid lg:grid-cols-12 gap-3 md:gap-4 min-h-0"
                  >
                    <aside className="sim-aside lg:col-span-4 flex flex-col gap-3 md:gap-4 min-h-0">
                      <KeyInputPanel pw={pw} setPw={setPw} isShielded={isShielded} onGenerate={generatePassword} />
                      <ActionControlPanel engine={engine} />
                    </aside>
                    <main className="sim-main lg:col-span-8 flex flex-col gap-3 md:gap-4 min-h-0">
                      <MonitorTerminal logs={logs} res={res} isShielded={isShielded} scrollRef={scrollRef} />
                      <IntelligenceHub crackTimes={crackTimes} config={config} isShielded={isShielded} />
                    </main>
                  </motion.div>
                ) : (
                  <motion.div
                    key="aca"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    className="h-full bg-bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border-subtle shadow-inner flex flex-col overflow-hidden relative"
                  >
                    <AcademyHub />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <ReportModal engine={engine} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}