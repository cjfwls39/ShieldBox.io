import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ShieldQuestion, ArrowRight, User, Bot, Swords } from 'lucide-react';

export default function AttackVectorsIntro({ data, onStart }) {
  const { title, slogan, definition, coreCuriosity, philosophies } = data;

  return (
    <div className="max-w-5xl mx-auto space-y-32 py-12">
      {/* ── 메인 히어로 ── */}
      <section className="text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-danger/10 border border-brand-danger/20 text-brand-danger font-black text-[10px] tracking-[0.4em] uppercase"
        >
          <Swords size={14} /> {title}
        </motion.div>
        
        <div className="space-y-6">
          <h1 className="text-8xl font-black italic text-text-bright uppercase tracking-tighter leading-[0.9] py-4">
            {definition.main}
          </h1>
          <p className="text-2xl text-text-dim font-medium max-w-3xl mx-auto leading-relaxed break-keep">
            {definition.sub}
          </p>
        </div>
        
        <p className="text-brand-danger font-black text-sm italic tracking-[0.3em] uppercase opacity-80">
          {slogan}
        </p>
      </section>

      {/* ── 질문 섹션 (카드 스타일 통일) ── */}
      <section className="relative p-16 rounded-[3.5rem] bg-bg-input border-2 border-border-subtle overflow-hidden group shadow-2xl">
        <div className="absolute -top-10 -right-10 p-12 text-brand-danger opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-700 rotate-12">
          <ShieldQuestion size={320} />
        </div>
        
        <div className="relative z-10 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3 space-y-6">
            <span className="inline-block text-[11px] font-black text-brand-danger uppercase tracking-[0.4em] bg-brand-danger/10 px-4 py-1 rounded-full">
              Fundamental Question
            </span>
            <h3 className="text-4xl font-black text-text-bright break-keep leading-[1.1] tracking-tighter">
              {coreCuriosity.question}
            </h3>
          </div>
          <div className="md:col-span-2 p-8 rounded-[2rem] bg-bg-card border-2 border-brand-danger/30 shadow-xl transform group-hover:-translate-y-2 transition-transform">
            <p className="text-xl font-black text-text-bright italic leading-snug break-keep">
              "{coreCuriosity.answer}"
            </p>
          </div>
        </div>
      </section>

      {/* ── 철학 섹션 (2컬럼 그리드 통일) ── */}
      <section className="grid md:grid-cols-2 gap-10">
        {philosophies.map((p, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="p-12 rounded-[3rem] bg-bg-card border-2 border-border-subtle hover:border-brand-danger/40 transition-all space-y-8 shadow-lg"
          >
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-bg-input text-brand-danger border border-border-subtle shadow-inner">
                {p.identity === 'DEVELOPER' ? <User size={28} /> : <Bot size={28} />}
              </div>
              <div>
                <p className="text-[11px] font-black text-text-dim uppercase tracking-[0.3em] mb-1">{p.identity} VIEWPOINT</p>
                <h4 className="text-2xl font-black text-text-bright italic uppercase tracking-tight">{p.subject}</h4>
              </div>
            </div>
            <p className="text-lg text-text-dim leading-relaxed font-medium break-keep opacity-90">
              {p.content}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ── 하단 액션 ── */}
      <footer className="pt-12 flex flex-col items-center gap-6">
        <button
          onClick={onStart}
          className="group relative flex items-center gap-6 px-16 py-7 bg-brand-danger hover:bg-red-500 text-white rounded-[2rem] font-black italic text-2xl transition-all shadow-[0_20px_40px_rgba(239,68,68,0.25)] active:scale-95"
        >
          START ATTACK ANALYSIS 
          <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-300" />
        </button>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.5em] animate-pulse">
          Click to initiate laboratory sequence
        </p>
      </footer>
    </div>
  );
}