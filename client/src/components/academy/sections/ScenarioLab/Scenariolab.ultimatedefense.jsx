import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, ShieldAlert, Lock, Binary, Server } from 'lucide-react';
import ScenarioVis from './ScenarioLab.Vis';

/** 수치 배지 */
const StatBadge = ({ badge, index }) => {
  const isDanger = badge.color === 'danger';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
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

/** 데이터 매핑 테이블 */
const DataMappingCard = ({ example }) => {
  if (!example) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="p-6 bg-bg-input rounded-2xl border border-border-subtle space-y-4"
    >
      <h4 className="text-[10px] font-black text-text-bright uppercase tracking-widest flex items-center gap-2">
        <Binary size={14} className="text-brand-primary" /> Data Mapping
      </h4>
      <div className="space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/40">
          <span className="text-text-dim">Plaintext</span>
          <span className="text-text-bright font-bold">{example.plaintext}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/40">
          <span className="text-brand-primary">Salt</span>
          <span className="text-brand-primary font-bold">{example.salt}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-border-subtle/40">
          <span className="text-amber-500 flex items-center gap-1">
            <Server size={11} /> Pepper
          </span>
          <span className="text-amber-500 font-bold">{example.pepper}</span>
        </div>
        {example.combined && (
          <div className="py-3 px-4 bg-bg-card rounded-xl border border-border-subtle">
            <p className="text-[9px] text-text-dim uppercase tracking-widest mb-1.5 font-black">Combined Input</p>
            <p className="text-text-bright font-bold break-all leading-relaxed text-[10px]">{example.combined}</p>
          </div>
        )}
        <div className="py-3 px-4 bg-black rounded-xl shadow-inner">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Final Hash</p>
            <Lock size={11} className="text-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] text-emerald-400/80 break-all font-mono leading-relaxed">{example.finalHash}</p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * ULTIMATE_DEFENSE 타입 전용 레이아웃
 * 최종 방어 레이어 — 페퍼 + DB 분리 구조 강조
 */
export default function ScenarioUltimateDefense({ scene }) {
  if (!scene) return null;

  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVars = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVars}
      initial="initial"
      animate="animate"
      className="flex-1 flex flex-col gap-7"
    >
      {/* ── 헤더 ── */}
      <div className="space-y-2 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
          {scene.episode || 'FINAL LAYER'}
        </div>
        <h2 className="text-4xl font-black text-text-bright italic tracking-tighter uppercase leading-none">
          {scene.title}
        </h2>
        <p className="text-sm font-bold text-emerald-400/60 uppercase tracking-tighter italic">
          {scene.subTitle}
        </p>

        {/* 드라마틱 훅 */}
        {scene.dramaticHook && (
          <motion.div variants={itemVars} className="mt-3 p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-r-2xl">
            <p className="text-sm font-black text-text-bright leading-relaxed italic">
              "{scene.dramaticHook}"
            </p>
          </motion.div>
        )}
      </div>

      {/* ── 수치 배지 ── */}
      {scene.statBadges?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 shrink-0">
          {scene.statBadges.map((badge, i) => (
            <StatBadge key={i} badge={badge} index={i} />
          ))}
        </div>
      )}

      {/* ── 메인 그리드 ── */}
      <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">

        {/* 왼쪽: 내러티브 + 보안 고려사항 */}
        <div className="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">

          {/* 내러티브 */}
          <div className="space-y-4">
            {scene.narrative?.map((line, idx) => (
              <motion.p key={idx} variants={itemVars} className="text-base text-text-base leading-relaxed font-medium break-keep">
                {line}
              </motion.p>
            ))}
          </div>

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

          {/* 기술 인사이트 */}
          {scene.technicalInsight && (
            <motion.div variants={itemVars} className="p-5 bg-bg-input rounded-2xl border-l-4 border-emerald-500 space-y-2">
              <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase flex items-center gap-2">
                <Terminal size={12} /> Technical_Insight
              </p>
              <ul className="space-y-2">
                {scene.technicalInsight.map((t, i) => (
                  <li key={i} className="text-xs text-text-bright font-medium leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">▹</span> {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 보안 고려 사항 */}
          {scene.securityConsideration && (
            <motion.div variants={itemVars} className="p-5 bg-brand-danger/5 border border-brand-danger/10 rounded-2xl space-y-2">
              <p className="text-[10px] font-black text-brand-danger tracking-widest uppercase flex items-center gap-2">
                <ShieldAlert size={12} /> Security_Consideration
              </p>
              <ul className="space-y-2">
                {scene.securityConsideration.map((note, i) => (
                  <li key={i} className="text-xs text-text-base font-bold leading-relaxed flex items-start gap-2">
                    <span className="text-brand-danger mt-1 shrink-0">!</span> {note}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 학습 가이드 */}
          {scene.learningGuide && (
            <motion.div variants={itemVars} className="p-5 bg-bg-card border border-border-subtle rounded-2xl space-y-2">
              <p className="text-[10px] font-black text-text-bright uppercase tracking-widest">Learning_Guide</p>
              <ul className="space-y-2">
                {scene.learningGuide.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 mt-1.5 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* 오른쪽: 비주얼 + 데이터 매핑 + 테이크어웨이 */}
        <div className="flex flex-col gap-5">

          {/* 시각화 */}
          <div className="w-full bg-bg-main rounded-2xl border border-brand-primary/20 relative flex items-center justify-center aspect-video">
            <ScenarioVis scene={scene} />
          </div>

          {/* 데이터 매핑 */}
          <DataMappingCard example={scene.example} />

          {/* Key Takeaways */}
          {scene.keyTakeaways && (
            <motion.div variants={itemVars} className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} /> Key_Takeaways
              </p>
              <div className="space-y-2">
                {scene.keyTakeaways.map((point, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-bright font-bold">
                    <CheckCircle2 size={11} className="text-emerald-400 shrink-0" /> {point}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 해커 인사이트 */}
          {scene.hackerInsight && (
            <motion.div variants={itemVars} className="p-5 bg-brand-danger/5 border border-brand-danger/10 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-brand-danger/10 rounded-lg text-brand-danger shrink-0">
                <Terminal size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-brand-danger uppercase tracking-widest mb-1">Hacker_Insight</p>
                <p className="text-xs text-text-base font-bold italic leading-relaxed">"{scene.hackerInsight}"</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}