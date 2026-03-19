import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { BackHeader } from '../../ui';
import { pageContainer, scrollArea } from '../../styles';

// 하위 단계별 컴포넌트 (뼈대)
import EntropyIntro from './EntropyHub.Intro';
import EntropyMath from './EntropyHub.Math';
import EntropyGenerator from './EntropyHub.Generator';
import EntropyEpilogue from './EntropyHub.Epilogue';

export default function EntropyHub({ onBack }) {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef(null);

  // phase 전환 시 스크롤 최상단 초기화
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [phase]); // 0: Intro, 1: Math, 2: Generator, 3: Epilogue

  const nextPhase = () => setPhase(prev => prev + 1);
  const prevPhase = () => setPhase(prev => prev - 1);

  // 단계별 렌더링 매핑
  const renderPhase = () => {
    switch (phase) {
      case 0:  return <EntropyIntro onStart={nextPhase} />;
      case 1:  return <EntropyMath onNext={nextPhase} />;
      case 2:  return <EntropyGenerator onNext={nextPhase} />;
      case 3:  return <EntropyEpilogue onFinish={onBack} />;
      default: return null;
    }
  };

  return (
    <div className={pageContainer}>
      {/* 최상단 헤더 - ui.jsx 활용 */}
      <BackHeader onBack={onBack} section="Entropy_Hub" accent="primary" />

      <div ref={scrollRef} className={scrollArea}>
        <div className="max-w-5xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 하단 통합 컨트롤러 (Intro 제외) */}
      {phase > 0 && phase < 3 && (
        <footer className="shrink-0 px-10 py-6 border-t border-border-subtle bg-bg-card flex justify-between items-center">
          <button onClick={prevPhase} className="text-xs font-black text-text-dim hover:text-brand-primary transition-colors">
            ← PREVIOUS PHASE
          </button>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === phase ? 'bg-brand-primary' : 'bg-border-subtle'}`} />
            ))}
          </div>
          <button 
            onClick={nextPhase} 
            className="px-8 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black shadow-lg shadow-brand-primary/20 hover:brightness-110 flex items-center gap-2 uppercase"
          >
            Next Phase <ArrowRight size={14} />
          </button>
        </footer>
      )}
    </div>
  );
}