import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Terminal, BookOpen, ShieldAlert,
  CheckCircle2, Database, Clock, Users, Zap
} from 'lucide-react';
import ScenarioVis from './ScenarioLab.Vis';

/** 수치 배지 컴포넌트 */
const StatBadge = ({ badge, index }) => {
  const isDanger = badge.color === 'danger';
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
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

/** 사건 요약 데이터 카드 */
const CaseDataCard = ({ caseData }) => {
  if (!caseData) return null;
  const rows = [
    { icon: <Clock size={12} />, label: '발생일', value: caseData.date },
    { icon: <Users size={12} />, label: '초기 보고', value: caseData.initialReported },
    { icon: <AlertTriangle size={12} />, label: '실제 규모', value: caseData.actualScale },
    { icon: <Database size={12} />, label: '저장 방식', value: caseData.algorithm },
    { icon: <Zap size={12} />, label: '크랙 속도', value: caseData.crackTime },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-bg-input rounded-2xl border border-border-subtle overflow-hidden"
    >
      <div className="px-5 py-3 bg-brand-danger/10 border-b border-brand-danger/20 flex items-center gap-2">
        <AlertTriangle size={12} className="text-brand-danger" />
        <span className="text-[10px] font-black text-brand-danger uppercase tracking-widest">
          Incident Report
        </span>
        <span className="ml-auto text-[9px] font-mono text-brand-danger/50">{caseData.incident}</span>
      </div>
      <div className="divide-y divide-border-subtle/40">
        {rows.map((row, i) => row.value && (
          <div key={i} className="flex items-center gap-3 px-5 py-3">
            <span className="text-text-dim shrink-0">{row.icon}</span>
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-wide w-20 shrink-0">{row.label}</span>
            <span className="text-xs font-black text-text-bright font-mono">{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * CASE_STUDY_START 타입 전용 레이아웃
 * 실제 사건 데이터, 드라마틱한 내러티브, 기술 인사이트를 강조
 */
export default function ScenarioCaseStudy({ scene }) {
  if (!scene) return null;

  const itemVars = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="initial" animate="animate"
      className="flex-1 flex flex-col gap-8"
    >
      {/* ── 헤더 ── */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-danger/10 border border-brand-danger/20 text-brand-danger text-[10px] font-black uppercase tracking-widest">
            <AlertTriangle size={10} /> {scene.episode || scene.title}
          </div>
        </div>
        <h2 className="text-4xl font-black text-text-bright italic tracking-tighter uppercase leading-none">
          {scene.title}
        </h2>
        <p className="text-sm font-bold text-brand-danger/60 uppercase tracking-tighter italic">
          {scene.subTitle}
        </p>

        {/* 드라마틱 훅 */}
        {scene.dramaticHook && (
          <motion.div variants={itemVars} className="mt-4 p-5 bg-brand-danger/5 border-l-4 border-brand-danger rounded-r-2xl">
            <p className="text-base font-black text-text-bright leading-relaxed italic">
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

      {/* ── 메인 콘텐츠 그리드 ── */}
      <div className="grid lg:grid-cols-2 gap-10 flex-1 min-h-0">

        {/* 왼쪽: 내러티브 + 기술 인사이트 */}
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">

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
            <motion.div variants={itemVars} className="p-5 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl flex gap-3">
              <span className="text-brand-primary text-lg shrink-0">💡</span>
              <div>
                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Beginner_Tip</p>
                <p className="text-xs text-text-base font-medium leading-relaxed">{scene.beginnerTip}</p>
              </div>
            </motion.div>
          )}

          {/* 기술 인사이트 */}
          {scene.technicalInsight && (
            <motion.div variants={itemVars} className="p-5 bg-bg-input rounded-2xl border-l-4 border-emerald-500 space-y-3">
              <p className="text-[10px] font-black text-emerald-500 tracking-widest uppercase flex items-center gap-2">
                <Terminal size={12} /> Technical_Insight
              </p>
              <ul className="space-y-2">
                {scene.technicalInsight.map((insight, i) => (
                  <li key={i} className="text-xs text-text-bright font-medium leading-relaxed flex items-start gap-2">
                    <span className="text-emerald-500 mt-1 shrink-0">▹</span> {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 학습 가이드 */}
          {scene.learningGuide && (
            <motion.div variants={itemVars} className="p-5 bg-bg-card border border-border-subtle rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-text-bright uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={12} className="text-brand-primary" /> Learning_Guide
              </p>
              <ul className="space-y-2">
                {scene.learningGuide.map((guide, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 mt-1.5 shrink-0" />
                    {guide}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* 오른쪽: 비주얼 + 사건 데이터 */}
        <div className="flex flex-col gap-5">

          {/* 시각화 */}
          <div className="w-full bg-bg-main rounded-2xl border border-brand-primary/20 relative flex items-center justify-center aspect-video">
            <ScenarioVis scene={scene} />
          </div>

          {/* 사건 데이터 카드 */}
          <CaseDataCard caseData={scene.caseData} />

          {/* Key Takeaways */}
          {scene.keyTakeaways && (
            <motion.div variants={itemVars} className="p-5 bg-bg-card border border-border-subtle rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} /> Key_Takeaways
              </p>
              <div className="space-y-2">
                {scene.keyTakeaways.map((point, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-bright font-bold">
                    <CheckCircle2 size={11} className="text-brand-primary shrink-0" /> {point}
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