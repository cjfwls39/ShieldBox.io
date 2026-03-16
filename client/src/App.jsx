// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Moon, ShieldCheck, CheckCircle2, AlertCircle, GraduationCap, Terminal as TerminalIcon } from 'lucide-react';

import { useShieldEngine } from './hooks/useShieldEngine';
import KeyInputPanel from './components/KeyInputPanel';
import ActionControlPanel from './components/ActionControlPanel';
import MonitorTerminal from './components/MonitorTerminal';
import IntelligenceHub from './components/IntelligenceHub';
import ReportModal from './components/ReportModal';

// 아카데미 메인 허브만 딱 하나 임포트합니다.
import AcademyHub from './components/academy/AcademyHub';

export default function App() {
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
      return { label: '치명적 안전', color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: <ShieldCheck size={16}/> };
    if (pw.length >= 16) 
      return { label: '안전함', color: 'text-brand-primary', bg: 'bg-brand-primary/10', icon: <CheckCircle2 size={16}/> };
    return { label: '보안 취약', color: 'text-brand-danger', bg: 'bg-brand-danger/10', icon: <AlertCircle size={16}/> };
  })();

  return (
    <div className={`h-screen overflow-hidden flex flex-col bg-bg-main transition-colors duration-500 font-main p-5 text-text-base ${isDark ? 'dark' : ''}`}>
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col gap-4 min-h-0">
        
        <header className="flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('simulation')}>
              <div className="p-2.5 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/20"><Shield size={24} className="text-white" /></div>
              <h1 className="text-2xl font-black text-text-bright uppercase tracking-tight">SHIELD BOX<span className="text-brand-primary">.IO</span></h1>
            </div>

            <nav className="flex items-center bg-bg-card border border-border-subtle p-1 rounded-2xl relative shadow-sm overflow-hidden">
              <button onClick={() => setActiveTab('simulation')} className={`relative z-10 px-6 py-2 rounded-xl text-[11px] font-black transition-colors flex items-center gap-2 ${activeTab === 'simulation' ? 'text-brand-primary' : 'text-text-dim'}`}>
                {activeTab === 'simulation' && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-bg-main rounded-xl shadow-inner -z-10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <TerminalIcon size={14} /> SIMULATION
              </button>
              <button onClick={() => setActiveTab('academy')} className={`relative z-10 px-6 py-2 rounded-xl text-[11px] font-black transition-colors flex items-center gap-2 ${activeTab === 'academy' ? 'text-brand-primary' : 'text-text-dim'}`}>
                {activeTab === 'academy' && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-bg-main rounded-xl shadow-inner -z-10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <GraduationCap size={16} /> ACADEMY
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-bg-card border border-border-subtle text-text-bright hover:border-brand-primary transition-all">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className={`px-4 py-1.5 rounded-lg text-xs font-black ${securityBadge.bg} ${securityBadge.color} border border-current/20 flex items-center gap-2 shadow-sm`}>
               {securityBadge.icon} {securityBadge.label}
            </div>
          </div>
        </header>

        <div className="flex-1 relative min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'simulation' ? (
              <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full grid lg:grid-cols-12 gap-4 min-h-0">
                <aside className="lg:col-span-4 flex flex-col gap-4 min-h-0">
                  <KeyInputPanel pw={pw} setPw={setPw} isShielded={isShielded} onGenerate={generatePassword} />
                  <ActionControlPanel engine={engine} />
                </aside>
                <main className="lg:col-span-8 flex flex-col gap-4 min-h-0">
                  <MonitorTerminal logs={logs} res={res} isShielded={isShielded} scrollRef={scrollRef} />
                  <IntelligenceHub crackTimes={crackTimes} config={config} isShielded={isShielded} />
                </main>
              </motion.div>
            ) : (
              <motion.div key="aca" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }} className="h-full bg-bg-card rounded-[2.5rem] border border-border-subtle shadow-inner flex flex-col overflow-hidden relative">
                {/* [중요] 아카데미의 모든 내부 네비게이션은 AcademyHub가 관리합니다. */}
                <AcademyHub />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ReportModal engine={engine} />
    </div>
  );
}