import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import content from '../../data/entropyContent.json';
import { titleXl, bodyBase } from '../../styles';

const data = content.phases[0];

export default function EntropyIntro({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full text-center py-16 px-4 space-y-12">

      {/* 배경 장식 — 동심원 펄스 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[1,2,3].map(i => (
          <motion.div key={i}
            className="absolute rounded-full border border-brand-primary/10"
            style={{ width: i*220, height: i*220 }}
            animate={{ scale:[1, 1.08, 1], opacity:[0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3+i, delay: i*0.6 }}
          />
        ))}
      </div>

      {/* 아이콘 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type:'spring', stiffness:200, damping:15 }}
        className="relative z-10"
      >
        <div className="p-7 bg-brand-primary/10 rounded-[2.5rem] border border-brand-primary/25 shadow-2xl shadow-brand-primary/10">
          <Zap size={56} className="text-brand-primary" />
        </div>
      </motion.div>

      {/* 텍스트 */}
      <motion.div
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, duration:0.5 }}
        className="relative z-10 space-y-5 max-w-2xl"
      >
        <p className="text-[10px] font-black tracking-[0.4em] uppercase text-brand-primary/70">
          Academy · Section 04
        </p>
        <h1 className={`${titleXl} text-4xl md:text-5xl`}>
          {data.hook}
        </h1>
        <p className="text-base text-text-dim font-medium break-keep leading-relaxed">
          {data.subHook}
        </p>
        <p className={`${bodyBase} max-w-xl mx-auto text-base`}>
          {data.teaser}
        </p>
      </motion.div>

      {/* 하이라이트 3가지 */}
      <motion.div
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.4, duration:0.5 }}
        className="relative z-10 flex flex-wrap justify-center gap-3"
      >
        {data.highlights.map((h, i) => (
          <div key={i}
            className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-subtle rounded-2xl text-xs font-black text-text-base shadow-sm"
          >
            <span>{h.icon}</span>
            <span>{h.text}</span>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.55, duration:0.4 }}
        whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
        className="relative z-10 px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black text-base shadow-2xl shadow-brand-primary/25 flex items-center gap-3 hover:brightness-110 transition-all"
      >
        {data.ctaLabel} <Zap size={18} />
      </motion.button>
    </div>
  );
}