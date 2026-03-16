import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, ShieldCheck, Zap, ArrowLeft, Info, 
  Cpu, Lock, Layers, Activity, ChevronRight, 
  Sword, ShieldAlert, FlaskConical, Terminal, 
  Database, Hash, ArrowDown, Box, Fingerprint, Code, RefreshCw
} from 'lucide-react';

import academyData from '../data/academyContent.json';

export default function AlgorithmLibrary({ onBack }) {
  const [selectedId, setSelectedId] = useState('md5');
  const [sampleInput, setSampleInput] = useState('ShieldBox_2026');
  const [isHashing, setIsHashing] = useState(false);
  
  const algorithms = academyData.algorithms;
  const current = algorithms[selectedId];

  useEffect(() => {
    setIsHashing(true);
    const timer = setTimeout(() => setIsHashing(false), 1200); 
    return () => clearTimeout(timer);
  }, [selectedId, sampleInput]);

  return (
    <div className="flex flex-col h-full gap-4 animate-in fade-in duration-500 min-h-0 bg-bg-main text-text-base">
      
      {/* ─── A. 네비게이션 헤더 ─── */}
      <header className="flex items-center justify-between shrink-0 px-6 pt-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2.5 bg-bg-card hover:bg-brand-primary rounded-xl text-text-bright hover:text-white border border-border-subtle transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <nav className="flex items-center gap-2 font-black text-xs tracking-widest uppercase text-text-dim">
            <span>ACADEMY</span> 
            <ChevronRight size={14} className="text-brand-primary" /> 
            <span className="text-brand-primary italic font-black">Algorithm_Lab</span>
          </nav>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-12 gap-6 p-6 min-h-0">
        
        {/* ─── B. 좌측 알고리즘 리스트 ─── */}
        <aside className="lg:col-span-3 flex flex-col min-h-0 text-left">
          <div className="flex-1 bg-bg-card rounded-[2.5rem] border-2 border-border-subtle p-5 overflow-y-auto custom-scrollbar shadow-xl">
            <h3 className="text-[11px] font-black text-brand-primary tracking-[0.3em] uppercase mb-8 italic flex items-center gap-2 px-2">
              <FlaskConical size={16} /> Registry_List
            </h3>
            <div className="space-y-3">
              {Object.values(algorithms).map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setSelectedId(algo.id)}
                  className={`w-full p-6 rounded-3xl border-2 transition-all text-left group relative overflow-hidden ${
                    selectedId === algo.id 
                    ? 'bg-brand-primary border-brand-primary shadow-lg scale-[1.02]' 
                    : 'bg-bg-input border-border-subtle hover:border-brand-primary/40'
                  }`}
                >
                  <p className={`text-lg font-black italic tracking-tighter ${selectedId === algo.id ? 'text-white' : 'text-text-bright'}`}>
                    {algo.name}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${selectedId === algo.id ? 'text-white/70' : 'text-text-dim'}`}>
                    {algo.category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ─── C. 우측 통합 실험대 (AnimatePresence 복구) ─── */}
        <main className="lg:col-span-9 bg-bg-card rounded-[3rem] border-2 border-border-subtle relative flex flex-col min-h-0 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId} // 핵심: selectedId가 바뀔 때마다 전환 애니메이션 터짐
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 overflow-y-auto custom-scrollbar p-12 md:p-14 space-y-28 relative z-10"
            >
              {/* 1. 타이틀 섹션 */}
              <section className="space-y-6 text-left border-b-2 border-border-subtle pb-16">
                <div className="space-y-2">
                   <div className={`inline-flex px-3 py-1.5 rounded-lg border-2 border-current font-black text-[11px] tracking-[0.2em] uppercase ${current.visualTheme} bg-current/5`}>
                      {current.category}
                   </div>
                   <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-none text-text-bright uppercase">
                     {current.name}
                   </h2>
                </div>
                <div className="flex flex-col gap-4 border-l-8 border-brand-primary pl-10 py-2 bg-brand-primary/5 rounded-r-3xl">
                   <p className="text-3xl font-black text-text-bright italic leading-tight">"{current.oneLiner}"</p>
                   <p className="text-xl text-text-base font-bold leading-relaxed max-w-4xl break-keep">{current.fullDesc}</p>
                </div>
              </section>

              {/* ─── 통합 암호화 공정 (Step-by-Step Flow) ─── */}
              <section className="space-y-24">
                 <div className="flex items-center gap-3 text-brand-primary font-black text-xs tracking-[0.2em] uppercase">
                    <Code size={18} /> Integrated_Pipeline_Flow
                 </div>

                 {/* Step 01: INPUT */}
                 <div className="grid md:grid-cols-12 gap-10 items-start relative text-left">
                    <div className="md:col-span-1 flex flex-col items-center pt-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-lg shadow-lg">01</div>
                       <div className="w-1 h-full bg-border-subtle absolute top-12 bottom-0 rounded-full opacity-30" />
                    </div>
                    <div className="md:col-span-11 space-y-4">
                       <h4 className="text-lg font-black text-white flex items-center gap-2 italic uppercase">
                         <Terminal size={20} className="text-brand-primary" /> Phase_01: Raw_Data_Input
                       </h4>
                       <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                             <p className="text-lg text-text-base font-bold leading-relaxed break-keep">{current.pipeline.step1.detail}</p>
                             <div className="p-8 bg-bg-input rounded-3xl border-2 border-brand-primary shadow-inner">
                                <label className="text-[11px] font-black text-brand-primary uppercase mb-4 block">Source Data Input</label>
                                <input 
                                  type="text" value={sampleInput} onChange={(e) => setSampleInput(e.target.value)}
                                  className="w-full bg-transparent border-b-4 border-brand-primary/20 py-1 font-mono text-2xl text-text-bright outline-none focus:border-brand-primary transition-all font-black"
                                />
                             </div>
                          </div>
                          <div className="p-8 bg-black rounded-[2.5rem] border-2 border-white/10 flex flex-col justify-center shadow-2xl">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Binary Output (UTF-8)</label>
                             <p className="font-mono text-xs text-brand-primary break-all leading-relaxed font-black bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20 tracking-tighter opacity-70">
                                {sampleInput.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Step 02: PREPARATION (Padding) */}
                 <div className="grid md:grid-cols-12 gap-10 items-start relative text-left">
                    <div className="md:col-span-1 flex flex-col items-center pt-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-lg shadow-lg">02</div>
                       <div className="w-1 h-full bg-border-subtle absolute top-12 bottom-0 rounded-full opacity-30" />
                    </div>
                    <div className="md:col-span-11 space-y-10 text-left">
                       <h4 className="text-lg font-black text-white flex items-center gap-2 italic uppercase">
                         <Database size={20} className="text-brand-primary" /> Phase_02: Padding_Logic
                       </h4>
                       <div className="p-10 bg-bg-input rounded-[3rem] border-2 border-border-subtle shadow-xl space-y-8">
                          <p className="text-lg text-text-base font-bold leading-relaxed">{current.pipeline.step2.detail}</p>
                          <div className="space-y-6">
                             <h5 className="text-[13px] font-black text-text-bright uppercase flex items-center gap-3 tracking-widest"><Box size={18} className="text-brand-primary"/> Block_Padding_Structure</h5>
                             <div className="flex flex-col gap-4">
                                <div className="h-12 w-full bg-brand-primary/15 border border-brand-primary/30 rounded-lg flex items-center px-6 justify-between">
                                   <span className="text-sm font-black text-text-bright uppercase">Original Message</span>
                                   <span className="text-base font-mono text-brand-primary font-black">{sampleInput.length * 8} bits</span>
                                </div>
                                <div className="flex gap-4 h-12">
                                   <div className="w-1/4 bg-brand-danger/20 border-2 border-brand-danger/50 rounded-2xl flex items-center justify-center text-brand-danger font-black text-[10px] uppercase">1-bit Pad</div>
                                   <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-text-dim font-black text-[10px] uppercase tracking-widest">Zero Filling</div>
                                   <div className="w-1/3 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-[10px] uppercase">Length Info</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Step 03: CORE (부드러운 Easing 애니메이션 적용) */}
                 <div className="grid md:grid-cols-12 gap-10 items-start relative text-left">
                    <div className="md:col-span-1 flex flex-col items-center pt-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-lg shadow-lg">03</div>
                       <div className="w-1 h-full bg-border-subtle absolute top-12 bottom-0 rounded-full opacity-30" />
                    </div>
                    <div className="md:col-span-11 space-y-10 text-left">
                       <h4 className="text-lg font-black text-white flex items-center gap-2 italic uppercase">
                         <Cpu size={20} className="text-brand-primary" /> Phase: Core_Engine
                       </h4>
                       <div className="p-10 bg-bg-input rounded-[3rem] border-2 border-border-subtle space-y-12 relative overflow-hidden shadow-xl">
                          <p className="text-lg text-text-base font-bold leading-relaxed max-w-4xl relative z-10 break-keep">{current.pipeline.step3.detail}</p>
                          
                          <div className="w-full flex flex-col items-center justify-center p-16 bg-black/70 rounded-[3rem] border-2 border-white/10 shadow-inner relative z-10">
                            <AnimatePresence mode="wait">
                              {/* [1] MD5 Visualization (부드러운 둥둥거림) */}
                              {selectedId === 'md5' && (
                                <motion.div key="md5-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-10">
                                   <div className="grid grid-cols-4 gap-8">
                                      {['A', 'B', 'C', 'D'].map((reg, i) => (
                                        <motion.div 
                                          key={reg} animate={isHashing ? { 
                                            y: [-8, 8, -8], // 더 유기적인 움직임 범위
                                            scale: [1, 1.05, 1],
                                            borderColor: 'rgba(239, 68, 68, 0.6)'
                                          } : {}}
                                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: i * 0.15 }} // Easing 추가
                                          className="w-24 h-24 rounded-3xl bg-brand-danger/20 border-4 border-brand-danger/60 flex items-center justify-center text-brand-danger font-black text-3xl shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                                        >
                                          {reg}
                                        </motion.div>
                                      ))}
                                   </div>
                                   <p className="text-xl font-black text-white italic tracking-widest uppercase">MD5 64-Round Transformation</p>
                                </motion.div>
                              )}

                              {/* [2] SHA-256 Visualization (부드러운 회전) */}
                              {selectedId === 'sha256' && (
                                <motion.div key="sha256-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-10">
                                   <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                      {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((reg, i) => (
                                        <motion.div 
                                          key={reg} animate={isHashing ? { 
                                            rotateY: 360, 
                                            backgroundColor: 'rgba(59, 130, 246, 0.4)',
                                            scale: [1, 1.1, 1]
                                          } : {}}
                                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: i * 0.1 }}
                                          className="w-16 h-16 rounded-2xl bg-brand-primary/10 border-2 border-brand-primary/60 flex items-center justify-center text-white font-black text-xl shadow-xl"
                                        >
                                          {reg}
                                        </motion.div>
                                      ))}
                                   </div>
                                   <p className="text-xl font-black text-white italic tracking-widest uppercase">SHA-256 Compression Rounds</p>
                                </motion.div>
                              )}

                              {/* [3] SHA-512 Visualization (웅장한 파동) */}
                              {selectedId === 'sha512' && (
                                <motion.div key="sha512-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-10">
                                   <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((reg, i) => (
                                        <motion.div 
                                          key={reg} animate={isHashing ? { 
                                            scale: [1, 1.2, 1], 
                                            borderColor: '#60a5fa',
                                            backgroundColor: 'rgba(59, 130, 246, 0.3)'
                                          } : {}}
                                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: i * 0.12 }}
                                          className="w-16 h-16 rounded-2xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-white font-black text-base shadow-2xl"
                                        >
                                          {reg}
                                        </motion.div>
                                      ))}
                                   </div>
                                   <p className="text-xl font-black text-blue-400 italic tracking-widest uppercase">SHA-512 High-Spec Core</p>
                                </motion.div>
                              )}

                              {/* [4] Bcrypt Visualization (부드러운 회전) */}
                              {selectedId === 'bcrypt' && (
                                <motion.div key="bcrypt-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-8">
                                   <motion.div 
                                      animate={isHashing ? { rotate: 360, opacity: [1, 0.6, 1] } : {}}
                                      transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                      className="p-10 bg-purple-500/10 border-4 border-dashed border-purple-500/40 rounded-full shadow-2xl"
                                   >
                                      <RefreshCw size={64} className="text-purple-400" />
                                   </motion.div>
                                   <p className="text-xl font-black text-purple-400 italic tracking-widest uppercase">Adaptive Key Stretching Loop</p>
                                </motion.div>
                              )}

                              {/* [5] Memory-Hard (Scrypt/Argon2id) Visualization (부드러운 점멸) */}
                              {(selectedId === 'scrypt' || selectedId === 'argon2id') && (
                                <motion.div key="mem-vis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-10 w-full max-w-2xl">
                                   <div className="w-full h-44 grid grid-cols-10 gap-2">
                                      {[...Array(50)].map((_, i) => (
                                        <motion.div 
                                          key={i} animate={isHashing ? { opacity: [0.1, 1, 0.1], scale: [1, 1.2, 1] } : { opacity: 0.1 }}
                                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: Math.random() * 2 }}
                                          className="bg-emerald-500 rounded-md shadow-lg" />
                                      ))}
                                   </div>
                                   <p className="text-xl font-black text-emerald-400 italic tracking-widest uppercase">RAM_Resource_Activation</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Step 04: FINAL DIGEST */}
                 <div className="grid md:grid-cols-12 gap-10 items-start relative pb-20 text-left">
                    <div className="md:col-span-1 flex flex-col items-center pt-2">
                       <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black text-lg shadow-lg">04</div>
                    </div>
                    <div className="md:col-span-11 space-y-10">
                       <h4 className="text-xl font-black text-text-bright flex items-center gap-2 italic uppercase">
                         <Hash size={22} className="text-brand-primary" /> Phase: Final_Digest
                       </h4>
                       <div className="p-12 bg-black rounded-[4rem] border-2 border-brand-primary/40 flex flex-col items-center justify-center gap-8 shadow-[0_0_80px_rgba(59,130,246,0.15)] relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                          <Fingerprint size={80} className="text-brand-primary group-hover:scale-110 transition-transform duration-500" />
                          <span className="text-4xl md:text-5xl font-mono font-black text-white text-glow break-all text-center px-8 leading-tight tracking-tighter opacity-80">
                             {isHashing ? 'CALCULATING...' : '0x' + Math.random().toString(16).slice(2, 34).toUpperCase()}
                          </span>
                       </div>
                    </div>
                 </div>
              </section>

              {/* [Birth & Conflict 서사적 배경 유지] */}
              <section className="pt-28 border-t-2 border-border-subtle grid md:grid-cols-2 gap-16 text-left pb-16">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 text-brand-primary font-black text-sm tracking-[0.4em] uppercase opacity-80"><Layers size={24} /> Phase: Origin</div>
                    <h4 className="text-4xl font-black text-text-bright uppercase italic">기원과 기술적 본질</h4>
                    <p className="text-2xl text-text-base font-bold leading-relaxed break-keep">{current.origin}</p>
                 </div>
                 <div className="p-12 bg-bg-input rounded-[3.5rem] border-2 border-border-subtle flex flex-col justify-center gap-8 shadow-inner">
                    <div className="flex items-start gap-6">
                       <div className={`p-6 rounded-2xl ${current.bgLight} ${current.visualTheme} border-2 border-white/10 shrink-0 shadow-lg`}><Zap size={40} /></div>
                       <div className="space-y-3">
                          <p className="text-3xl text-text-bright font-black leading-tight italic">"{current.metaphorDesc}"</p>
                          <p className="text-sm text-brand-primary font-black uppercase tracking-widest opacity-70">{current.metaphorTitle}</p>
                       </div>
                    </div>
                 </div>
              </section>

              <section className="pt-28 border-t-2 border-border-subtle space-y-16 text-left">
                 <div className="flex items-center gap-4 text-brand-danger font-black text-sm tracking-[0.4em] uppercase font-black opacity-80"><Sword size={24} /> Phase: Conflict</div>
                 <div className="grid md:grid-cols-12 gap-16">
                    <div className="md:col-span-7 space-y-10">
                       <h4 className="text-4xl font-black text-text-bright uppercase italic leading-tight">해커의 관점: 취약점 분석</h4>
                       <p className="text-2xl text-text-base font-bold leading-relaxed break-keep">{current.hackerContext}</p>
                    </div>
                    <div className="md:col-span-5 grid grid-rows-2 gap-6">
                       <div className="p-10 bg-emerald-500/10 rounded-[2.5rem] border-2 border-emerald-500/40 flex flex-col justify-center shadow-xl group hover:border-emerald-500 transition-colors">
                          <p className="text-[12px] text-emerald-400 font-black mb-3 uppercase tracking-[0.4em] opacity-70">Defense_Capability (Strong)</p>
                          <p className="text-2xl font-black text-text-bright italic leading-tight group-hover:text-emerald-300 transition-colors">{current.strongAgainst}</p>
                       </div>
                       <div className="p-10 bg-brand-danger/10 rounded-[2.5rem] border-2 border-brand-danger/40 flex flex-col justify-center shadow-xl group hover:border-brand-danger transition-colors">
                          <p className="text-[12px] text-brand-danger font-black mb-3 uppercase tracking-[0.4em] opacity-70">Critical_Exposure (Weak)</p>
                          <p className="text-2xl font-black text-text-bright italic leading-tight group-hover:text-brand-danger transition-colors">{current.weakAgainst}</p>
                       </div>
                    </div>
                 </div>
              </section>

              {/* 7. Expert Insight Footer */}
              <footer className="p-14 bg-bg-card rounded-[5rem] border-4 border-border-subtle flex gap-12 items-center shadow-[0_40px_100px_rgba(0,0,0,0.3)] border-b-[20px] border-b-brand-primary relative overflow-hidden group transition-all text-left mt-20">
                <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000 text-brand-primary"><Cpu size={250} /></div>
                <div className="p-8 bg-brand-primary/20 rounded-[2.5rem] text-brand-primary shrink-0 shadow-2xl border-2 border-brand-primary/50 transition-transform group-hover:rotate-12"><Info size={54} /></div>
                <div className="space-y-4 relative z-10">
                   <p className="text-[12px] font-black text-brand-primary uppercase tracking-[0.8em]">Strategical Summary</p>
                   <p className="text-3xl text-text-bright font-black leading-snug pr-12 drop-shadow-sm transition-colors group-hover:text-text-dim">
                      {current.expertInsight}
                   </p>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}