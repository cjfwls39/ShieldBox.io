import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, BrainCircuit, Terminal, ArrowRight, Zap } from 'lucide-react';

export default function ShieldBoxIntro({ onFinish }) {
  // 0: Initial, 1: Running Animation, 2: Finished
  const [animationPhase, setAnimationPhase] = useState(0);

  // 인트로 배경 스타일 (Cool Navy 테마 활용)
  const introContainer = "fixed inset-0 bg-[#0A1120] text-text-base flex items-center justify-center z-[999] overflow-hidden select-none font-sans";
  
  // 로고 및 아이콘 스타일
  const logoBox = "w-32 h-32 rounded-[2rem] bg-bg-card border-4 border-brand-primary flex items-center justify-center shadow-[0_0_60px_rgba(78,142,247,0.15)] relative";
  const neonText = "text-5xl font-black text-text-bright italic uppercase tracking-tighter leading-none shadow-glow";

  return (
    <div className={introContainer}>
      {/* 배경 그리드 및 파동 연출 */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
        className="absolute inset-0" 
        style={{ backgroundImage: 'radial-gradient(var(--border-subtle) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      <AnimatePresence mode="wait">
        {animationPhase < 2 && (
          <motion.div
            key="intro_main"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8, ease: "circIn" } }}
            className="flex flex-col items-center max-w-5xl mx-auto w-full p-10 z-10"
          >
            {/* Phase 0: Logo Animation (ShieldBox.io 보안 가동) */}
            {animationPhase === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "circOut" }}
                onAnimationComplete={() => setTimeout(() => setAnimationPhase(1), 1500)} // 1.5초 후 공지사항 노출
                className="flex flex-col items-center space-y-8"
              >
                <div className={logoBox}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-brand-primary"
                  >
                    <Zap size={72} strokeWidth={1} />
                  </motion.div>
                  <div className="absolute inset-[-10px] rounded-[2.5rem] border-2 border-brand-primary/20 opacity-50" />
                </div>
                <h1 className={neonText}>ShieldBox.io</h1>
                <p className="text-xs font-black text-text-dim uppercase tracking-[0.6em]">Password_Defense_Academy</p>
              </motion.div>
            )}

            {/* Phase 1: AI & Developer Notice (공지사항 및 경고) */}
            {animationPhase === 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="grid lg:grid-cols-5 gap-12 w-full h-full p-12 bg-bg-card border-2 border-border-subtle rounded-[3rem] shadow-2xl relative overflow-hidden"
              >
                {/* 배경 아이콘 연출 */}
                <BrainCircuit size={400} className="absolute -bottom-40 -left-40 text-brand-primary/5 opacity-[0.03]" />

                {/* 왼쪽: 경고 및 아이콘 */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6 text-center border-r-2 border-dashed border-border-subtle pr-12">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], color: ['#4E8EF7', '#F5A623', '#4E8EF7'] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="p-6 bg-brand-primary/10 rounded-full border border-brand-primary/20 text-brand-primary shadow-lg shadow-brand-primary/10"
                  >
                    <ShieldAlert size={64} strokeWidth={1.5} />
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em]">SYSTEM_NOTICE</p>
                    <h3 className="text-3xl font-black text-text-bright italic uppercase tracking-tighter leading-tight break-keep">AI와 개발자가 <br/>함께 설계한 보안 로직</h3>
                  </div>
                </div>

                {/* 오른쪽: 공지 문구 및 버튼 */}
                <div className="lg:col-span-3 flex flex-col justify-between space-y-8 py-4">
                  <div className="space-y-6">
                    <p className="text-lg text-text-base font-medium leading-relaxed break-keep">
                      ShieldBox.io는 <strong className="text-text-bright">인공지능의 방대한 계산력</strong>과 인간 개발자의 <strong className="text-brand-primary">직관적인 경험</strong>을 종합하여 구축되었습니다.
                    </p>
                    <p className="text-sm text-text-dim leading-relaxed break-keep font-medium italic p-5 bg-bg-input rounded-2xl border border-border-subtle">
                      " 우리가 제시하는 시뮬레이션과 분석은 절대적인 '정답'이 아니며,<br/> 최적의 보안 전략을 찾기 위한 수학적 근거와 철학적 논의를 제공합니다. "
                    </p>
                    <p className="text-xs text-brand-secondary font-black uppercase tracking-widest text-right">
                      // 최종 판단과 실행은 학습자의 몫입니다.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                        setAnimationPhase(2);
                        setTimeout(onFinish, 800); // exit 애니메이션 후 본문 노출
                    }} 
                    className="w-full mt-8 px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-brand-primary/20 hover:brightness-110 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 group"
                  >
                    시스템 진입 (Enter System)
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}