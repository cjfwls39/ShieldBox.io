import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import content from '../../data/entropyContent.json';
import { titleXl, bodyBase, bodyDim } from '../../styles';

const data = content.phases[3];

const PRIORITY_STYLE = {
  HIGH:   { dot:'bg-brand-danger',  text:'text-brand-danger',  label:'HIGH' },
  MEDIUM: { dot:'bg-amber-400',     text:'text-amber-400',     label:'MED'  },
};

export default function EntropyEpilogue({ onFinish }) {
  return (
    <div className="flex flex-col items-center text-center py-12 space-y-14">

      {/* 졸업 아이콘 */}
      <motion.div
        initial={{ rotate:-10, scale:0.8, opacity:0 }}
        animate={{ rotate:0, scale:1, opacity:1 }}
        transition={{ type:'spring', damping:10, stiffness:100 }}
        className="relative"
      >
        <div className="p-10 bg-emerald-500/10 rounded-[4rem] text-emerald-500 border-2 border-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
          <Award size={80} />
        </div>
        <motion.div
          animate={{ scale:[1,1.2,1], opacity:[0.5,1,0.5] }}
          transition={{ repeat:Infinity, duration:3 }}
          className="absolute -top-4 -right-4 bg-bg-card border-2 border-emerald-500 p-3 rounded-2xl text-emerald-500 shadow-xl"
        >
          <ShieldCheck size={24} />
        </motion.div>
      </motion.div>

      {/* 타이틀 */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="space-y-4 max-w-2xl">
        <h2 className={`${titleXl} text-4xl`}>{data.title}</h2>
        <p className="text-text-dim font-black text-sm uppercase tracking-[0.3em]">{data.subTitle}</p>
      </motion.div>

      {/* 마무리 내러티브 */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
        className="space-y-4 max-w-2xl text-left">
        {data.closingNarrative.map((p, i) => (
          <p key={i} className={`${bodyBase} text-base`}>{p}</p>
        ))}
      </motion.div>

      {/* 통계 3개 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
        className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {data.stats.map((s, i) => (
          <div key={i} className="p-5 bg-bg-card border border-border-subtle rounded-3xl text-center space-y-1">
            <p className="text-3xl font-black font-mono text-text-bright">{s.value}<span className="text-sm ml-1 text-text-dim">{s.unit}</span></p>
            <p className="text-[9px] font-black text-text-dim uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* 핵심 메시지 카드 3개 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="grid md:grid-cols-3 gap-5 w-full max-w-3xl">
        {data.keyTakeaways.map((k, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: 0.4 + i*0.08 }}
            className="p-6 bg-bg-card border border-border-subtle rounded-3xl text-left space-y-3 hover:border-brand-primary/40 transition-colors"
          >
            <span className="text-3xl">{k.icon}</span>
            <h4 className="text-sm font-black text-text-bright leading-tight">{k.title}</h4>
            <p className={`${bodyDim} text-xs`}>{k.desc}</p>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-primary">
              <ArrowRight size={11} /> {k.action}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 실천 체크리스트 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
        className="w-full max-w-2xl space-y-3">
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest text-left mb-4">오늘 당장 실천할 것들</p>
        {data.checklist.map((c, i) => {
          const ps = PRIORITY_STYLE[c.priority] || PRIORITY_STYLE.MEDIUM;
          return (
            <motion.div key={i}
              initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.5 + i*0.06 }}
              className="flex items-center gap-3 p-4 bg-bg-card border border-border-subtle rounded-2xl text-left hover:border-brand-primary/30 transition-colors"
            >
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <p className="text-sm font-medium text-text-base flex-1">{c.label}</p>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full bg-current/10 ${ps.text} border border-current/20`}>
                {ps.label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 마지막 인용구 */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
        className="w-full max-w-2xl p-8 bg-bg-input border-l-4 border-brand-primary rounded-r-3xl text-left space-y-3">
        <p className="text-base font-black text-text-bright italic leading-relaxed">
          "{data.finalQuote.text}"
        </p>
        <p className="text-xs text-text-dim">{data.finalQuote.source}</p>
      </motion.div>

      {/* 복귀 버튼 */}
      <motion.button
        onClick={onFinish}
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
        whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
        className="px-14 py-5 rounded-[2.5rem] font-black text-base shadow-2xl hover:brightness-110 transition-all flex items-center gap-4 group"
        style={{ backgroundColor: 'var(--text-bright)', color: 'var(--bg-card)' }}
      >
        RETURN TO ACADEMY HUB
        <Sparkles size={20} className="group-hover:animate-spin" />
      </motion.button>
    </div>
  );
}