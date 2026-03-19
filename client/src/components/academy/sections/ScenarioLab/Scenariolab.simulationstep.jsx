import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, BookOpen, CheckCircle2, PenTool, ArrowRight, Clock } from 'lucide-react';
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

/**
 * SIMULATION_STEP 타입 전용 레이아웃
 * Before/After 비교 스텝을 인터랙티브하게 전환하며 보여줌
 */
export default function ScenarioSimulationStep({ scene }) {
  if (!scene) return null;

  const [activeStep, setActiveStep] = useState(0);
  const steps = scene.steps || [];
  const currentStep = steps[activeStep];

  const isLastStep = activeStep === steps.length - 1;
  const isDangerStep = activeStep === 0; // 첫 번째 스텝은 보통 "문제 상황"

  const itemVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="initial" animate="animate"
      className="flex-1 flex flex-col gap-7"
    >
      {/* ── 헤더 ── */}
      <div className="space-y-2 shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
          {scene.episode || 'SIMULATION'}
        </div>
        <h2 className="text-4xl font-black text-text-bright italic tracking-tighter uppercase leading-none">
          {scene.title}
        </h2>
        <p className="text-sm font-bold text-brand-primary/60 uppercase tracking-tighter italic">
          {scene.subTitle}
        </p>

        {/* 드라마틱 훅 */}
        {scene.dramaticHook && (
          <motion.div variants={itemVars} className="mt-3 p-4 bg-bg-input border-l-4 border-brand-primary rounded-r-2xl">
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

      {/* ── 내러티브 ── */}
      {scene.narrative && (
        <div className="space-y-3">
          {scene.narrative.map((line, i) => (
            <motion.p key={i} variants={itemVars} className="text-base text-text-base leading-relaxed font-medium break-keep">
              {line}
            </motion.p>
          ))}
        </div>
      )}

      {/* ── 초보자 팁 ── */}
      {scene.beginnerTip && (
        <motion.div variants={itemVars} className="p-4 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl flex gap-3">
          <span className="text-lg shrink-0">💡</span>
          <div>
            <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">Beginner_Tip</p>
            <p className="text-xs text-text-base font-medium leading-relaxed">{scene.beginnerTip}</p>
          </div>
        </motion.div>
      )}

      {/* ── 메인 비교 카드 (인터랙티브) ── */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* 스텝 탭 선택 */}
          <div className="flex gap-2 p-1 bg-bg-input rounded-2xl border border-border-subtle w-fit">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeStep === i
                    ? i === 0
                      ? 'bg-brand-danger text-white shadow-lg shadow-brand-danger/20'
                      : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'text-text-dim hover:text-text-bright transition-colors'
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {/* 스텝 콘텐츠 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className={`p-6 rounded-2xl border-2 space-y-4 ${
                activeStep === 0
                  ? 'bg-brand-danger/5 border-brand-danger/20'
                  : 'bg-brand-primary/5 border-brand-primary/20'
              }`}
            >
              <p className={`text-lg font-black ${activeStep === 0 ? 'text-brand-danger' : 'text-brand-primary'}`}>
                {currentStep.description}
              </p>

              {currentStep.detail && (
                <div className="p-4 bg-bg-card rounded-xl border border-border-subtle/60">
                  <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">공격 시나리오</p>
                  <p className="text-xs text-text-bright font-medium leading-relaxed">{currentStep.detail}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {currentStep.securityImpact && (
                  <div className="p-4 bg-bg-input rounded-xl">
                    <p className="text-[9px] font-black text-text-dim uppercase mb-1">보안 영향</p>
                    <p className="text-xs text-text-bright font-bold leading-relaxed">{currentStep.securityImpact}</p>
                  </div>
                )}
                {currentStep.timeEstimate && (
                  <div className="p-4 bg-bg-input rounded-xl flex gap-2">
                    <Clock size={14} className={`shrink-0 mt-0.5 ${activeStep === 0 ? 'text-brand-danger' : 'text-brand-primary'}`} />
                    <div>
                      <p className="text-[9px] font-black text-text-dim uppercase mb-1">예상 시간</p>
                      <p className={`text-xs font-black ${activeStep === 0 ? 'text-brand-danger' : 'text-brand-primary'}`}>{currentStep.timeEstimate}</p>
                    </div>
                  </div>
                )}
              </div>

              {currentStep.analogy && (
                <div className="flex gap-2 p-3 bg-bg-card rounded-xl border border-border-subtle/40">
                  <span className="text-amber-400 shrink-0">💬</span>
                  <p className="text-xs text-text-dim italic leading-relaxed">{currentStep.analogy}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 비교 화살표 */}
          {steps.length === 2 && activeStep === 0 && (
            <motion.button
              onClick={() => setActiveStep(1)}
              className="flex items-center gap-2 text-[10px] font-black text-brand-primary hover:text-text-bright transition-colors self-start"
              whileHover={{ x: 4 }}
            >
              <ArrowRight size={14} /> 개선된 시나리오 보기
            </motion.button>
          )}
        </div>
      )}

      {/* ── 하단: 기술 인사이트 + 학습가이드 ── */}
      <div className="grid md:grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-4">
          {scene.designNote && (
            <motion.div variants={itemVars} className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex gap-3">
              <PenTool size={14} className="text-brand-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-brand-primary uppercase mb-1">Design_Note</p>
                <p className="text-xs text-text-base font-bold leading-relaxed">{scene.designNote}</p>
              </div>
            </motion.div>
          )}

          {scene.keyTakeaways && (
            <motion.div variants={itemVars} className="p-4 bg-bg-card border border-border-subtle rounded-2xl space-y-2">
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} /> Key_Takeaways
              </p>
              {scene.keyTakeaways.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-bright font-bold">
                  <CheckCircle2 size={11} className="text-brand-primary shrink-0" /> {point}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}