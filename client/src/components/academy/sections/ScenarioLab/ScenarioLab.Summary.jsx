import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Zap, ArrowRight, ShieldCheck, Cpu, Lock, Binary
} from 'lucide-react';

/** 수치 배지 */
const StatBadge = ({ badge, index }) => {
  const isDanger = badge.color === 'danger';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`p-4 rounded-2xl border flex flex-col gap-1 ${
        isDanger
          ? 'bg-brand-danger/5 border-brand-danger/20'
          : 'bg-brand-primary/5 border-brand-primary/20'
      }`}
    >
      <span className={`text-[9px] font-black uppercase tracking-widest ${isDanger ? 'text-brand-danger/60' : 'text-brand-primary/60'}`}>
        {badge.label}
      </span>
      <span className={`text-xl font-black font-mono leading-tight ${isDanger ? 'text-brand-danger' : 'text-brand-primary'}`}>
        {badge.value}
      </span>
      <span className={`text-[10px] font-bold ${isDanger ? 'text-brand-danger/70' : 'text-brand-primary/70'}`}>
        {badge.unit}
      </span>
    </motion.div>
  );
};

/**
 * ScenarioLab.Summary Component
 * ULTIMATE_FORMULA 타입 전용 — 솔트+페퍼 통합 공식 최종 정리
 */
export default function ScenarioSummary({ scene }) {
  if (!scene) return null;
  const { formula, example, attackAnalysis, narrative, learningGuide, keyTakeaways, dramaticHook, statBadges } = scene;

  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVars = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.55 } }
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="flex-1 flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-1"
    >
      {/* ── 에피소드 레이블 ── */}
      {scene.episode && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest w-fit">
          {scene.episode}
        </div>
      )}

      {/* ── 공식 히어로 블록 ── */}
      <motion.div variants={itemVars} className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-emerald-500 rounded-[2rem] blur-sm opacity-15" />
        <div className="relative bg-bg-card border border-brand-primary/25 py-8 px-10 rounded-[2rem] text-center shadow-xl">
          {dramaticHook && (
            <p className="text-xs text-text-dim font-medium italic mb-4 leading-relaxed">{dramaticHook}</p>
          )}
          <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.5em] mb-3">
            The Ultimate Security Formula
          </p>
          <h3 className="text-3xl md:text-4xl font-mono font-black text-text-bright tracking-tighter">
            {formula}
          </h3>
        </div>
      </motion.div>

      {/* ── 수치 배지 ── */}
      {statBadges?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 shrink-0">
          {statBadges.map((badge, i) => (
            <StatBadge key={i} badge={badge} index={i} />
          ))}
        </div>
      )}

      {/* ── 메인 분석 그리드 ── */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* 왼쪽: 내러티브 + Takeaways + 학습가이드 */}
        <div className="space-y-6">
          <div className="space-y-3">
            {narrative?.map((line, idx) => (
              <motion.p key={idx} variants={itemVars} className="text-base text-text-base leading-relaxed font-medium break-keep">
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div variants={itemVars} className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl space-y-4">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
              <ShieldCheck size={14} /> Key_Takeaways
            </h4>
            <div className="space-y-2.5">
              {keyTakeaways?.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-bright font-bold">
                  <CheckCircle2 size={14} className="text-brand-primary shrink-0 mt-0.5" />
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="p-5 bg-bg-input rounded-2xl border border-border-subtle">
            <ul className="space-y-2">
              {learningGuide?.map((guide, i) => (
                <li key={i} className="text-xs text-text-dim leading-relaxed flex items-start gap-2">
                  <span className="w-1 h-1 bg-brand-primary/40 rounded-full mt-1.5 shrink-0" />
                  {guide}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* 오른쪽: 데이터 매핑 + 공격 분석 */}
        <div className="space-y-5">

          {/* 실제 데이터 매핑 */}
          <motion.div variants={itemVars} className="p-6 bg-bg-input rounded-2xl border border-border-subtle space-y-4 shadow-inner">
            <h4 className="text-[10px] font-black text-text-bright uppercase tracking-widest flex items-center gap-2">
              <Binary size={14} className="text-brand-primary" /> Mapping Real Data
            </h4>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                <span className="text-text-dim">Plaintext</span>
                <span className="text-text-bright font-bold">{example?.plaintext}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                <span className="text-brand-primary">Salt</span>
                <span className="text-brand-primary font-bold">{example?.salt}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border-subtle/50">
                <span className="text-amber-500">Pepper</span>
                <span className="text-amber-500 font-bold">{example?.pepper}</span>
              </div>
              <div className="py-3 px-4 bg-bg-card rounded-xl border border-border-subtle">
                <p className="text-[9px] text-text-dim uppercase tracking-widest mb-1.5 font-black">Combined Input</p>
                <p className="text-text-bright font-bold break-all leading-tight text-[10px]">{example?.combined}</p>
              </div>
              <div className="py-3 px-4 bg-black rounded-xl shadow-2xl">
                <div className="flex justify-between items-center mb-1.5">
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                    {example?.algorithm}_Final_Digest
                  </p>
                  <Lock size={11} className="text-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-400/80 leading-relaxed break-all font-mono">
                  {example?.finalHash}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 공격 저항력 비교 */}
          <motion.div variants={itemVars} className="p-6 bg-brand-danger/5 border border-brand-danger/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-brand-danger uppercase tracking-widest">Resistance_Audit</h4>
              <span className="text-[9px] font-mono font-bold text-brand-danger/50">{attackAnalysis?.method}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-bg-card rounded-xl border border-border-subtle">
                <p className="text-[9px] font-black text-text-dim uppercase mb-1.5">Before</p>
                <p className="text-base font-black text-brand-danger leading-tight">{attackAnalysis?.withoutProtection}</p>
              </div>
              <div className="p-4 bg-bg-card rounded-xl border-2 border-emerald-500/30 shadow-sm shadow-emerald-500/5">
                <p className="text-[9px] font-black text-emerald-500 uppercase mb-1.5">After</p>
                <p className="text-base font-black text-emerald-500 leading-tight">{attackAnalysis?.withProtection}</p>
              </div>
            </div>
            <div className="flex gap-2 items-start pt-1">
              <div className="p-1.5 bg-brand-danger/10 rounded-lg text-brand-danger shrink-0 mt-0.5">
                <Cpu size={13} />
              </div>
              <p className="text-[11px] text-text-dim leading-relaxed font-medium italic break-keep">
                <span className="font-black text-text-bright not-italic mr-1">Verdict:</span>
                {attackAnalysis?.reason}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}