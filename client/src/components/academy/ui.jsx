/**
 * academy/ui.jsx
 * 아카데미 섹션 전용 공용 UI 컴포넌트.
 * 단순 클래스 상수는 styles.js 참조.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { VERDICT_STYLE, phaseLabel, stepTitle, stepSubLabel, bodyBase, bodyDim, panel } from './styles';

// ─────────────────────────────────────────────────────────────
// BackHeader — 뒤로가기 + 브레드크럼
// ─────────────────────────────────────────────────────────────
/**
 * @param {function} onBack
 * @param {string}   section   - 브레드크럼 텍스트 (e.g. "Algorithm_Lab")
 * @param {'primary'|'danger'} accent
 */
export function BackHeader({ onBack, section, accent = 'primary' }) {
  // ✅ 완전한 클래스명 사전 정의 — Tailwind purge 대응
  const ACCENT = {
    primary: { hoverBg: 'hover:bg-brand-primary', textAccent: 'text-brand-primary' },
    danger:  { hoverBg: 'hover:bg-brand-danger',  textAccent: 'text-brand-danger'  },
  };
  const ac = ACCENT[accent] ?? ACCENT.primary;

  return (
    <header className="flex items-center gap-4 shrink-0 px-6 pt-4 pb-2">
      <button
        onClick={onBack}
        className={`p-2 bg-bg-card ${ac.hoverBg} rounded-xl text-text-bright hover:text-white border border-border-subtle transition-all shadow-sm group`}
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      </button>
      <nav className="flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-text-dim">
        <span>ACADEMY</span>
        <ChevronRight size={12} className={ac.textAccent} />
        <span className={`${ac.textAccent} italic`}>{section}</span>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// PhaseHeader — "Phase: XXX" 섹션 레이블
// ─────────────────────────────────────────────────────────────
/**
 * @param {React.ReactNode} icon
 * @param {string}          label
 * @param {'primary'|'danger'|'dim'} color
 */
export function PhaseHeader({ icon, label, color = 'primary' }) {
  return (
    <div className={phaseLabel[color]}>
      {icon} {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// StepRow — Pipeline 스텝 1개 (번호 + 콘텐츠)
// ─────────────────────────────────────────────────────────────
/**
 * @param {string}          number   - "01" ~ "04"
 * @param {React.ReactNode} icon
 * @param {string}          title
 * @param {string}          subLabel
 * @param {React.ReactNode} children - 스텝 내부 콘텐츠
 * @param {boolean}         hasLine
 * @param {'primary'|'danger'} accent
 * @param {boolean}         last
 */
export function StepRow({ number, icon, title, subLabel, children, hasLine = true, accent = 'primary', last = false }) {
  const stepBg      = accent === 'danger' ? 'bg-brand-danger' : 'bg-brand-primary';
  const subLabelCls = stepSubLabel[accent];

  return (
    <div className={`grid md:grid-cols-12 gap-8 items-start text-left ${last ? 'pb-16' : ''}`}>
      {/* 번호 */}
      <div className="md:col-span-1 flex flex-col items-center pt-1">
        <div className={`w-10 h-10 rounded-xl ${stepBg} text-white flex items-center justify-center font-black text-sm shadow-lg z-10`}>
          {number}
        </div>
        {hasLine && <div className="w-px flex-1 bg-border-subtle mt-3 opacity-40" />}
      </div>
      {/* 콘텐츠 */}
      <div className="md:col-span-11 space-y-4">
        <div className="flex flex-col gap-1">
          <h4 className={stepTitle}>
            {icon} {title}
          </h4>
          {subLabel && <p className={subLabelCls}>{subLabel}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BodyText — 본문 단락
// ─────────────────────────────────────────────────────────────
/**
 * @param {'base'|'dim'} variant
 */
export function BodyText({ children, variant = 'base', className = '' }) {
  const cls = variant === 'dim' ? bodyDim : bodyBase;
  return <p className={`${cls} ${className}`}>{children}</p>;
}

// ─────────────────────────────────────────────────────────────
// InfoPanel — 기본 bg-input 패딩 패널
// ─────────────────────────────────────────────────────────────
export function InfoPanel({ children, className = '' }) {
  return (
    <div className={`${panel} ${className}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// InsightFooter — Expert/Hacker Insight 하단 푸터
// ─────────────────────────────────────────────────────────────
/**
 * @param {React.ReactNode} icon
 * @param {string}          label    - 상단 소라벨
 * @param {string}          title
 * @param {string}          body
 * @param {React.ReactNode} extra    - 추가 슬롯 (optional)
 * @param {'primary'|'danger'} accent
 * @param {React.ReactNode} bgIcon   - 배경 대형 아이콘 (optional)
 */
export function InsightFooter({ icon, label, title, body, extra, accent = 'primary', bgIcon }) {
  // ✅ 완전한 클래스명 사전 정의 — 동적 조합 제거 (Tailwind purge 대응)
  const ACCENT = {
    primary: {
      borderBot: 'border-b-brand-primary',
      iconBg:    'bg-brand-primary/15',
      iconBorder:'border-brand-primary/30',
      iconText:  'text-brand-primary',
    },
    danger: {
      borderBot: 'border-b-brand-danger',
      iconBg:    'bg-brand-danger/15',
      iconBorder:'border-brand-danger/30',
      iconText:  'text-brand-danger',
    },
  };
  const ac = ACCENT[accent] ?? ACCENT.primary;

  return (
    <footer className={`p-12 bg-bg-input rounded-[2.5rem] border-2 border-border-subtle flex flex-col md:flex-row gap-10 items-start shadow-2xl border-b-8 ${ac.borderBot} relative overflow-hidden group transition-all text-left mt-20`}>
      {bgIcon && (
        <div className={`absolute top-0 right-0 p-8 opacity-[0.04] group-hover:scale-105 transition-transform duration-700 ${ac.iconText}`}>
          {bgIcon}
        </div>
      )}
      <div className={`p-5 ${ac.iconBg} rounded-2xl ${ac.iconText} shrink-0 border ${ac.iconBorder} transition-transform group-hover:rotate-6 shadow-lg`}>
        {icon}
      </div>
      <div className="space-y-4 relative z-10 flex-1">
        {label && (
          <p className={`text-[10px] font-black ${ac.iconText} uppercase tracking-[0.4em] italic`}>{label}</p>
        )}
        {title && (
          <h4 className="text-xl font-black text-text-bright italic uppercase tracking-tight">{title}</h4>
        )}
        <p className={`${bodyDim} max-w-3xl`}>{body}</p>
        {extra}
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// VerdictPanel — 사용 가이드 체크리스트 박스
// ─────────────────────────────────────────────────────────────
/**
 * @param {object} usageGuide  - { verdict, verdictLabel, checks[] }
 */
export function VerdictPanel({ usageGuide }) {
  const style  = VERDICT_STYLE[usageGuide?.verdict] || VERDICT_STYLE.CONDITIONAL;
  const checks = usageGuide?.checks || [];

  return (
    <div className={`p-10 rounded-[2.5rem] border-2 ${style.bg} ${style.border} space-y-6 shadow-xl text-left`}>
      <div className="flex items-center gap-3">
        <span className={`px-4 py-1.5 rounded-full border border-current text-[11px] font-black uppercase tracking-widest ${style.text} bg-current/5 shadow-sm`}>
          VERDICT: {usageGuide?.verdictLabel}
        </span>
      </div>
      <div className="space-y-4 pt-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-start gap-4 p-1">
            {check.ok
              ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              : <XCircle      size={18} className="text-brand-danger shrink-0 mt-0.5" />
            }
            <p className={bodyBase}>{check.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SpectrumBar — 강도 스펙트럼 바 (Tabs 공용)
// ─────────────────────────────────────────────────────────────
/**
 * @param {Array}   spectrum    - ALGO_SPECTRUM or ATTACK_SPECTRUM
 * @param {number|null} currentTier
 * @param {string}  leftLabel
 * @param {string}  rightLabel
 */
export function SpectrumBar({ spectrum, currentTier, leftLabel = 'Security Tier', rightLabel = 'STRONGEST' }) {
  // layoutId를 leftLabel 기반으로 분리 — 두 Tabs가 동시에 렌더되면 충돌 방지
  const dotId = `spectrum-dot-${leftLabel.replace(/\s/g, '-').toLowerCase()}`;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-bg-card/40 rounded-full border border-border-subtle/30 shadow-inner w-full">
      <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] shrink-0">{leftLabel}</span>
      <div className="flex-1 flex items-center gap-1">
        {spectrum.map((tier) => {
          const isCurrentTier = tier.tier === currentTier;
          return (
            <div key={tier.tier} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-full transition-all duration-300 ${tier.color} ${isCurrentTier ? 'opacity-100 h-3' : 'opacity-25 h-1.5'}`} />
              {isCurrentTier && (
                <motion.div
                  layoutId={dotId}
                  className={`text-[8px] font-black uppercase tracking-widest ${tier.textColor} whitespace-nowrap`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {tier.label}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-[9px] font-black text-text-dim uppercase tracking-[0.3em] shrink-0">{rightLabel}</span>
    </div>
  );
}