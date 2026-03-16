/**
 * ShieldBox.io - Intelligence Report Modal
 * [위치] src/components/ReportModal.jsx
 *
 * [수정 사항]
 * 1. [외부검수] Narrative 스텝 번호 배경색을 등급 테마로 완전 통일
 *    - 기존: 마지막 스텝(idx===2)만 isCritical 여부로 분기 → B/C(amber)와 불일치
 *    - 수정: 모든 스텝 번호에 theme 색상 적용, isCritical일 때 brand-danger 유지
 * 2. [외부검수] Section C 분석 박스 border Tailwind 동적 클래스 제거
 *    - 기존: `${theme.border}/20` → 빌드 시 purge될 위험
 *    - 수정: border는 정적 클래스로 두고 opacity를 인라인 style로 처리
 * 3. 헤더 등급 박스에 score 수치 추가 표시
 * 4. 사용하지 않는 lucide-react import 정리
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck,
  Fingerprint, ArrowRight, ShieldAlert,
  Target, Lightbulb, BarChart3,
} from 'lucide-react';

const ReportModal = ({ engine }) => {
  if (!engine) return null;
  const { showAnalysis, setShowAnalysis, analysisResult } = engine;
  if (!showAnalysis || !analysisResult) return null;

  const {
    grade, score, summary, metaphor, narrative = [],
    evidence = [], vulnerability, mitigation = [],
    attackVector, cryptoAnalysis,
  } = analysisResult;

  // ── 등급별 컬러 테마 ────────────────────────────────────────────────
  const getTheme = () => {
    const g = grade ? grade.charAt(0) : 'F';
    if (['S', 'A'].includes(g)) return {
      color:       'brand-primary',
      bg:          'bg-brand-primary/10',
      border:      'border-brand-primary',
      text:        'text-brand-primary',
      stepBg:      'bg-brand-primary',   // [수정1] 스텝 번호 배경
    };
    if (['B', 'C'].includes(g)) return {
      color:       'amber-500',
      bg:          'bg-amber-500/10',
      border:      'border-amber-500',
      text:        'text-amber-500',
      stepBg:      'bg-amber-500',       // [수정1] 스텝 번호 배경
    };
    return {
      color:       'brand-danger',
      bg:          'bg-brand-danger/10',
      border:      'border-brand-danger',
      text:        'text-brand-danger',
      stepBg:      'bg-brand-danger',    // [수정1] 스텝 번호 배경
    };
  };

  const theme      = getTheme();
  const isCritical = ['D', 'F'].includes(grade ? grade.charAt(0) : 'F');

  // [수정2] Section C 분석 박스 스타일 — border purge 위험 제거
  const analysisBoxClass = isCritical
    ? 'bg-brand-danger/5 border-brand-danger'
    : `${theme.bg} ${theme.border}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-bg-card w-full max-w-4xl max-h-[95vh] rounded-[2.5rem] shadow-2xl border border-border-subtle overflow-hidden flex flex-col relative"
        >
          {/* ── 1. 헤더 (등급 + 요약) ─────────────────────────────── */}
          <div className={`p-8 ${theme.bg} border-b border-border-subtle relative`}>
            <button
              onClick={() => setShowAnalysis(false)}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors text-text-dim"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 등급 박스 */}
              <div className="relative group">
                <div className={`absolute inset-0 blur-3xl opacity-20 bg-${theme.color}`} />
                <div className={`w-32 h-32 rounded-3xl border-4 ${theme.border} ${theme.bg} flex flex-col items-center justify-center shadow-2xl relative z-10 transform group-hover:rotate-6 transition-transform`}>
                  <span className={`text-6xl font-black font-mono ${theme.text}`}>
                    {grade ? grade.charAt(0) : 'N/A'}
                  </span>
                  {/* [수정3] score 수치 추가 */}
                  <span className={`text-sm font-black font-mono ${theme.text} opacity-80`}>
                    {score ?? '—'}pts
                  </span>
                  <span className="text-[9px] font-black opacity-50 uppercase tracking-tighter">
                    Security Grade
                  </span>
                </div>
              </div>
              {/* 요약 텍스트 */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-text-bright mb-2 font-mono tracking-tight leading-none uppercase">
                  {summary}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                  <span className="px-3 py-1 bg-white/40 border border-border-subtle rounded-full text-[10px] font-black text-text-dim font-mono uppercase">
                    {attackVector}
                  </span>
                  <span className="px-3 py-1 bg-white/40 border border-border-subtle rounded-full text-[10px] font-black text-text-dim font-mono uppercase">
                    {cryptoAnalysis}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. 메인 컨텐츠 (스크롤) ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar bg-bg-card">

            {/* [Section A] 비유 분석 (Metaphor) */}
            <section className="bg-bg-input rounded-[2.5rem] p-10 border border-border-subtle relative overflow-hidden group">
              <div className={`absolute top-0 right-0 p-8 opacity-10 ${theme.text} group-hover:scale-110 transition-transform`}>
                <Lightbulb size={120} />
              </div>
              <div className="relative z-10">
                <div className={`flex items-center gap-2 ${theme.text} font-black text-xs uppercase tracking-widest mb-4 font-mono`}>
                  <Fingerprint size={16} /> Understanding the Risk
                </div>
                <h3 className="text-2xl font-black text-text-bright mb-4">{metaphor?.title}</h3>
                <p className="text-text-base leading-relaxed text-base font-medium max-w-2xl">{metaphor?.description}</p>
              </div>
            </section>

            {/* [Section B] 공격 시나리오 (Narrative) */}
            <section className="space-y-8">
              <div className="flex items-center gap-2 text-text-bright font-black text-xs uppercase tracking-widest mb-2 font-mono">
                <Target size={16} /> Attack Execution Narrative
              </div>
              <div className="grid md:grid-cols-3 gap-6 relative">
                {narrative.map((item, idx) => (
                  <div key={idx} className="bg-white border border-border-subtle p-8 rounded-3xl relative group hover:shadow-xl transition-all">
                    {/* [수정1] 스텝 번호 배경색 → theme.stepBg로 통일 */}
                    <span className={`absolute -top-3 -left-3 w-10 h-10 ${theme.stepBg} text-white rounded-xl flex items-center justify-center font-black text-sm font-mono shadow-lg`}>
                      {item.step}
                    </span>
                    <h4 className="text-sm font-black text-text-bright mb-2 mt-2">{item.title || `Phase 0${idx + 1}`}</h4>
                    <p className="text-xs font-bold leading-relaxed text-text-dim">{item.desc}</p>
                    {idx < 2 && (
                      <ArrowRight size={24} className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-border-subtle z-10" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* [Section C] Forensic Evidence + 분석 박스 */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Forensic Evidence */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-text-dim font-black text-xs uppercase tracking-widest font-mono">
                  <BarChart3 size={16} /> Forensic Evidence
                </div>
                <div className="bg-bg-input rounded-3xl p-6 border border-border-subtle divide-y divide-border-subtle">
                  {evidence.map((ev, i) => (
                    <div key={i} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                      <span className="text-xs font-black text-text-dim uppercase">{ev.label}</span>
                      <span className="text-sm font-mono font-black text-text-bright">
                        {ev.value} <span className="text-[10px] opacity-60 ml-0.5">{ev.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 분석 박스 (Root Cause / Security Strength) */}
              <section className="space-y-4">
                <div className={`flex items-center gap-2 ${theme.text} font-black text-xs uppercase tracking-widest font-mono`}>
                  <ShieldAlert size={16} />
                  {isCritical ? 'Root Cause Analysis' : 'Security Strength Analysis'}
                </div>
                {/* [수정2] border 동적 클래스 → 정적 클래스 + style opacity */}
                <div
                  className={`${analysisBoxClass} rounded-3xl p-8 border h-full`}
                  style={{ borderOpacity: isCritical ? 1 : 0.2 }}
                >
                  <h4 className={`${theme.text} font-black text-base mb-2`}>
                    {vulnerability?.type}
                  </h4>
                  <p className={`text-xs font-bold ${theme.text} opacity-80 leading-relaxed`}>
                    {vulnerability?.reason}
                  </p>
                </div>
              </section>
            </div>

            {/* [Section D] Mitigation Roadmap */}
            <section className="space-y-6 pb-6">
              <div className="flex items-center gap-2 text-brand-primary font-black text-xs uppercase tracking-widest font-mono">
                <ShieldCheck size={16} /> Mitigation Roadmap
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {mitigation.map((m, i) => (
                  <div key={i} className="group p-6 bg-bg-input border border-border-subtle rounded-3xl hover:border-brand-primary/30 transition-all cursor-default">
                    <span className="text-[10px] font-black text-brand-primary font-mono mb-2 block opacity-60">
                      ACTION {m.step}
                    </span>
                    <h5 className="text-base font-black text-text-bright mb-1">{m.title}</h5>
                    <p className="text-xs text-text-dim leading-relaxed font-medium">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── 3. 하단 액션 바 ───────────────────────────────────── */}
          <div className="p-8 bg-bg-main border-t border-border-subtle">
            <button
              onClick={() => setShowAnalysis(false)}
              className={`w-full py-5 rounded-[1.5rem] font-black text-white text-xs font-mono tracking-widest shadow-xl transition-all active:scale-[0.98] ${
                isCritical
                  ? 'bg-brand-danger shadow-brand-danger/20'
                  : 'bg-brand-primary shadow-brand-primary/20 hover:brightness-110'
              }`}
            >
              CONFIRM & APPLY SECURITY UPDATES
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReportModal;