/**
 * academy/styles.js
 * 아카데미 섹션 전용 Tailwind 클래스 상수.
 * 컴포넌트에서 직접 className에 삽입하는 단순 문자열.
 * 구조가 있는 컴포넌트는 ui.jsx 참조.
 */

// ─────────────────────────────────────────────────────────────
// 레이아웃 공통
// ─────────────────────────────────────────────────────────────

/** 섹션 최상위 래퍼 — 구분선 + 상하 여백 */
export const section = 'pt-32 border-t-2 border-border-subtle text-left pb-16';

/** 콘텐츠 최대 너비 래퍼 */
export const contentWrap = 'max-w-6xl mx-auto';

/** 페이지 진입 컨테이너 (h-full + 스크롤) */
export const pageContainer = 'flex flex-col h-full min-h-0 bg-bg-main text-text-base';

/** AnimatePresence 내부 스크롤 영역 */
export const scrollArea = 'h-full overflow-y-auto custom-scrollbar p-8 md:p-10';

/** 카드 외곽 wrapper */
export const cardOuter = 'h-full bg-bg-card rounded-2xl border-2 border-border-subtle overflow-hidden shadow-xl';

// ─────────────────────────────────────────────────────────────
// 네비게이션 헤더
// ─────────────────────────────────────────────────────────────

export const navHeader = 'flex items-center gap-4 shrink-0 px-6 pt-4 pb-2';

export const backBtn = (accentColor = 'brand-primary') =>
  `p-2 bg-bg-card hover:bg-${accentColor} rounded-xl text-text-bright hover:text-white border border-border-subtle transition-all shadow-sm group`;

export const navBreadcrumb = 'flex items-center gap-2 font-black text-[10px] tracking-widest uppercase text-text-dim';

// ─────────────────────────────────────────────────────────────
// 섹션 레이블 (Phase: XXX 헤더)
// ─────────────────────────────────────────────────────────────

/** Phase 레이블 공통 기반 */
const phaseBase = 'flex items-center gap-3 font-black text-[10px] tracking-[0.35em] uppercase opacity-80';

export const phaseLabel = {
  primary: `${phaseBase} text-brand-primary`,
  danger:  `${phaseBase} text-brand-danger`,
  dim:     `${phaseBase} text-text-dim`,
};

/** Pipeline 상단 소섹션 레이블 (더 작은 tracking) */
const pipelineLabelBase = 'flex items-center gap-3 font-black text-[10px] tracking-[0.25em] uppercase';

export const pipelineLabel = {
  primary: `${pipelineLabelBase} text-brand-primary`,
  danger:  `${pipelineLabelBase} text-brand-danger`,
};

/** Phase 스텝 설명 (h4 아래 서브라벨) */
export const stepSubLabel = {
  primary: 'text-[10px] font-black text-brand-primary/60 uppercase tracking-widest pl-6 italic',
  danger:  'text-[10px] font-black text-brand-danger/60 uppercase tracking-widest pl-6 italic',
};

// ─────────────────────────────────────────────────────────────
// 타이포그래피
// ─────────────────────────────────────────────────────────────

/** 페이지 메인 타이틀 (h2) */
export const titleXl = 'text-3xl md:text-4xl font-black italic tracking-tighter leading-none text-text-bright uppercase';

/** 섹션 서브 타이틀 (h3) */
export const titleLg = 'text-2xl font-black text-text-bright italic uppercase tracking-tighter';

/** 섹션 소제목 (h4) */
export const titleMd = 'text-2xl font-black text-text-bright uppercase italic leading-tight';

/** Pipeline 스텝 소제목 (h4 — 아이콘 포함) */
export const stepTitle = 'text-sm font-black text-text-bright flex items-center gap-2 italic uppercase tracking-wider';

/** 본문 텍스트 — 기본 (text-base 색상) */
export const bodyBase = 'text-sm text-text-base font-medium leading-relaxed break-keep';

/** 본문 텍스트 — 보조 (text-dim 색상) */
export const bodyDim = 'text-sm text-text-dim font-medium leading-relaxed break-keep';

/** 인용구 / oneLiner */
export const quoteText = 'text-lg font-black text-text-bright italic leading-snug';

/** 스펙 레이블 (우측 상단 뱃지 등) */
export const specLabel = 'text-[9px] font-black text-text-dim uppercase tracking-[0.3em]';

// ─────────────────────────────────────────────────────────────
// 카드 & 패널
// ─────────────────────────────────────────────────────────────

/** 기본 인풋 패널 */
export const panel = 'p-8 bg-bg-input rounded-2xl border-2 border-border-subtle shadow-md';

/** 기본 카드 패널 (bg-card 배경) */
export const card = 'p-8 bg-bg-card rounded-2xl border border-border-subtle shadow-md';

/** 강조 패널 — 브랜드 컬러 테두리 */
export const panelAccent = {
  primary: 'p-8 bg-bg-input rounded-2xl border-2 border-brand-primary/30 shadow-md',
  danger:  'p-8 bg-bg-input rounded-2xl border-2 border-brand-danger/20 shadow-md',
};

/** 인사이트 푸터 (Expert Insight / Hacker's Insight) */
export const insightFooter = (color = 'brand-primary') =>
  `p-12 bg-bg-input rounded-[2.5rem] border-2 border-border-subtle flex flex-col md:flex-row gap-10 items-start shadow-2xl border-b-8 border-b-${color} relative overflow-hidden group transition-all text-left mt-20`;

/** 인사이트 아이콘 박스 */
export const insightIcon = (color = 'brand-primary') =>
  `p-5 bg-${color}/15 rounded-2xl text-${color} shrink-0 border border-${color}/30 transition-transform group-hover:rotate-6 shadow-lg`;

// ─────────────────────────────────────────────────────────────
// oneLiner 블록
// ─────────────────────────────────────────────────────────────

export const oneLinerBlock = {
  primary: 'flex flex-col gap-3 border-l-4 border-brand-primary pl-6 py-2 bg-brand-primary/5 rounded-r-2xl',
  danger:  'border-l-4 border-brand-danger pl-6 py-2 bg-brand-danger/5 rounded-r-2xl',
};

// ─────────────────────────────────────────────────────────────
// 카테고리 뱃지 (알고리즘 / 공격 타입)
// ─────────────────────────────────────────────────────────────

export const categoryBadge = {
  primary: 'inline-flex px-3 py-1 rounded-lg border border-current font-black text-[10px] tracking-[0.2em] uppercase bg-current/5',
  danger:  'inline-flex px-3 py-1 rounded-lg border border-brand-danger text-brand-danger font-black text-[10px] tracking-[0.2em] uppercase bg-brand-danger/5',
};

// ─────────────────────────────────────────────────────────────
// Verdict (VERDICT_STYLE — 양쪽 Detail 공용)
// ─────────────────────────────────────────────────────────────

export const VERDICT_STYLE = {
  NEVER:       { bg: 'bg-brand-danger/10',  border: 'border-brand-danger/40',  text: 'text-brand-danger'  },
  CONDITIONAL: { bg: 'bg-amber-400/10',     border: 'border-amber-400/40',     text: 'text-amber-400'     },
  RECOMMENDED: { bg: 'bg-brand-primary/10', border: 'border-brand-primary/40', text: 'text-brand-primary' },
  GOOD:        { bg: 'bg-cyan-400/10',      border: 'border-cyan-400/40',      text: 'text-cyan-400'      },
  BEST:        { bg: 'bg-emerald-500/10',   border: 'border-emerald-500/40',   text: 'text-emerald-400'   },
};

// ─────────────────────────────────────────────────────────────
// Spectrum 바 (Tabs 공용)
// ─────────────────────────────────────────────────────────────

export const ALGO_SPECTRUM = [
  { tier: 1, label: 'BROKEN',  color: 'bg-brand-danger',  textColor: 'text-brand-danger'  },
  { tier: 2, label: 'FAST',    color: 'bg-amber-400',     textColor: 'text-amber-400'     },
  { tier: 3, label: 'SLOW',    color: 'bg-brand-primary', textColor: 'text-brand-primary' },
  { tier: 4, label: 'HARD',    color: 'bg-cyan-400',      textColor: 'text-cyan-400'      },
  { tier: 5, label: 'HARDEST', color: 'bg-emerald-400',   textColor: 'text-emerald-400'   },
];

export const ATTACK_SPECTRUM = [
  { tier: 1, label: 'LOW',      color: 'bg-emerald-400',   textColor: 'text-emerald-400'   },
  { tier: 2, label: 'MEDIUM',   color: 'bg-cyan-400',      textColor: 'text-cyan-400'      },
  { tier: 3, label: 'HIGH',     color: 'bg-brand-primary', textColor: 'text-brand-primary' },
  { tier: 4, label: 'CRITICAL', color: 'bg-amber-400',     textColor: 'text-amber-400'     },
  { tier: 5, label: 'FATAL',    color: 'bg-brand-danger',  textColor: 'text-brand-danger'  },
];

export const spectrumBar = 'flex items-center gap-3';
export const spectrumBarLabel = 'text-[9px] font-black text-text-dim uppercase tracking-[0.3em] shrink-0';