import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, BookOpen, CheckCircle2, Terminal, 
  Info, ShieldAlert, Zap, PenTool, ShieldCheck
} from 'lucide-react';
import ScenarioVis from './ScenarioLab.Vis';

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

export default function ScenarioScene({ scene }) {
  if (!scene) return null;

  const itemVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="initial" animate="animate"
      className="flex-1 flex flex-col gap-8"
    >
      {/* 1. Header Section */}
      <div className="space-y-3 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
          {scene.episode || scene.title}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-text-bright italic tracking-tighter uppercase leading-none">
            {scene.title}
          </h2>
          <p className="text-sm font-bold text-brand-primary/60 uppercase tracking-tighter italic">
            {scene.subTitle}
          </p>
        </div>
        {/* 드라마틱 훅 */}
        {scene.dramaticHook && (
          <motion.div variants={itemVars} className="mt-2 p-4 bg-bg-input border-l-4 border-brand-primary rounded-r-2xl">
            <p className="text-sm font-black text-text-bright leading-relaxed italic">
              "{scene.dramaticHook}"
            </p>
          </motion.div>
        )}
      </div>

      {/* 수치 배지 */}
      {scene.statBadges?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 shrink-0">
          {scene.statBadges.map((badge, i) => (
            <StatBadge key={i} badge={badge} index={i} />
          ))}
        </div>
      )}

      {/* 2. Content Grid */}
      <div className="grid lg:grid-cols-2 gap-10 flex-1 min-h-0">
        
        {/* Left: Narrative & Analysis */}
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">

          {/* 초보자 팁 */}
          {scene.beginnerTip && (
            <motion.div variants={itemVars} className="p-4 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl flex gap-3">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Beginner_Tip</p>
                <p className="text-xs text-text-base font-medium leading-relaxed">{scene.beginnerTip}</p>
              </div>
            </motion.div>
          )}

          {/* Narrative */}
          <div className="space-y-4">
            {scene.narrative?.map((line, idx) => (
              <motion.p key={idx} variants={itemVars} className="text-base text-text-base leading-relaxed font-medium break-keep">
                {line}
              </motion.p>
            ))}
          </div>

          {/* [신규] Technical Insight - 전문 지식 필드 */}
          {scene.technicalInsight && (
            <motion.div variants={itemVars} className="p-6 bg-bg-input rounded-2xl border-l-4 border-emerald-500 space-y-3">
              <p className="text-[10px] font-black text-emerald-500 mb-1 tracking-widest uppercase flex items-center gap-2">
                <Terminal size={12} /> Technical_Insight
              </p>
              <ul className="space-y-2">
                {scene.technicalInsight.map((insight, i) => (
                  <li key={i} className="text-sm text-text-bright font-medium leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">▹</span> {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Learning Guide */}
          {scene.learningGuide && (
            <motion.div variants={itemVars} className="p-8 bg-bg-card border border-border-subtle rounded-3xl space-y-4 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-text-bright uppercase tracking-widest">
                <BookOpen size={14} className="text-brand-primary" /> Learning_Guide
              </h4>
              <ul className="space-y-3">
                {scene.learningGuide.map((guide, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-dim leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 mt-1.5 shrink-0" />
                    {guide}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* [신규] Security Consideration - 고려 사항 */}
          {scene.securityConsideration && (
            <motion.div variants={itemVars} className="p-6 bg-brand-danger/5 border border-brand-danger/10 rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-brand-danger mb-1 tracking-widest uppercase flex items-center gap-2">
                <ShieldAlert size={12} /> Security_Consideration
              </p>
              <ul className="space-y-2">
                {scene.securityConsideration.map((note, i) => (
                  <li key={i} className="text-xs text-text-base font-bold leading-relaxed flex items-start gap-2">
                    <span className="text-brand-danger mt-1">!</span> {note}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 하단 보충 정보 (Design Note, Analogy, Technical Note) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scene.designNote && (
              <motion.div variants={itemVars} className="p-5 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex gap-3">
                <PenTool size={16} className="text-brand-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-primary uppercase">Design_Note</p>
                  <p className="text-xs text-text-base font-bold leading-relaxed">{scene.designNote}</p>
                </div>
              </motion.div>
            )}
            {scene.analogy && (
              <motion.div variants={itemVars} className="p-5 bg-bg-input border border-border-subtle rounded-2xl flex gap-3">
                <Lightbulb size={16} className="text-amber-400 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-amber-500 uppercase">Analogy</p>
                  <p className="text-xs text-text-dim italic leading-relaxed font-medium">"{scene.analogy}"</p>
                </div>
              </motion.div>
            )}
            {scene.technicalNote && (
              <motion.div variants={itemVars} className="p-5 bg-bg-input border border-border-subtle rounded-2xl flex gap-3 md:col-span-2">
                <Info size={16} className="text-brand-primary shrink-0" />
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-primary uppercase">Technical_Note</p>
                  <p className="text-xs text-text-dim leading-relaxed font-medium">{scene.technicalNote}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Visualizer & Insight Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="w-full bg-bg-main rounded-2xl border border-brand-primary/20 relative flex items-center justify-center aspect-video">
            <ScenarioVis scene={scene} />
          </div>

          <div className="grid grid-cols-1 gap-4 shrink-0">
            {scene.hackerInsight && (
              <motion.div variants={itemVars} className="p-5 bg-brand-danger/5 border border-brand-danger/10 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-brand-danger/10 rounded-lg text-brand-danger"><Terminal size={18} /></div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-brand-danger uppercase">Hacker_Insight</p>
                  <p className="text-xs text-text-base font-bold italic">"{scene.hackerInsight}"</p>
                </div>
              </motion.div>
            )}
            {scene.keyTakeaways && (
              <motion.div variants={itemVars} className="p-6 bg-bg-card border border-border-subtle rounded-3xl space-y-4">
                <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck size={14} /> Key_Takeaways
                </p>
                <div className="grid gap-2">
                  {scene.keyTakeaways.map((point, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-bright font-bold">
                      <CheckCircle2 size={12} className="text-brand-primary" /> {point}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}