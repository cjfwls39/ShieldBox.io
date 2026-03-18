import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, Unlock, Lock, Cpu,
  Database, User, FileText, Bot, Binary, RefreshCw, Layers,
  Hash, Shield, ShieldOff, Globe, Key, Server
} from 'lucide-react';

// ── 공통 진입 애니메이션 ────────────────────────────────────────────
const SCENE = {
  initial:    { opacity: 0, scale: 0.95 },
  animate:    { opacity: 1, scale: 1 },
  exit:       { opacity: 0, scale: 1.05 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

// ── 렌더 중 Math.random 방지용 외부 상수 ───────────────────────────
const BRUTE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#';
const BRUTE_SLOTS = [0, 1, 2].map(() => BRUTE_CHARS[Math.floor(Math.random() * BRUTE_CHARS.length)]);
const MASK_VAR_CHARS = ['X', '7$', 'K9'];
const BOT_POSITIONS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * 2 * Math.PI;
  const r = 120 + (i % 3) * 30;
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
});
const WAVE_HEIGHTS   = [20, 35, 25, 60, 30, 45, 28, 90, 32, 40, 22, 55, 28, 38, 25, 70, 30, 42, 26, 50];
const RAW_SIGNAL     = [45, 20, 88, 15, 72, 30, 95, 25, 60, 40, 18, 82, 35, 55, 22, 78, 28, 65, 42, 50];
const CLEAN_SIGNAL   = [10,  8, 90,  5, 75,  8, 95,  6, 62,  8,  5, 85,  7, 58,  6, 80,  7, 68,  8, 52];


// ════════════════════════════════════════════════════════════════════
// STEP 3 — 공격 실행 애니메이션
// ════════════════════════════════════════════════════════════════════

function BruteForceVis() {
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i}
            animate={{
              color:           i < 3 ? '#10b981' : '#ef4444',
              borderColor:     i < 3 ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)',
              backgroundColor: i < 3 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.05)',
            }}
            className="w-12 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-3xl font-black bg-black/40 shadow-2xl"
          >
            {i < 3 ? ['S', 'H', 'I'][i] : (
              <motion.span
                animate={{ y: [-20, 0, 20], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.12, delay: i * 0.06 }}
              >
                {BRUTE_SLOTS[i - 3]}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] font-black text-brand-danger uppercase tracking-[0.3em] animate-pulse">
        Exhausting_Full_Keyspace...
      </p>
    </motion.div>
  );
}

function MaskAttackVis() {
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2">
        {['?', '?', '?', '2', '0', '2', '6'].map((char, i) => (
          <div key={i}
            className={`w-10 h-14 border-2 rounded-lg flex flex-col items-center justify-center font-mono text-2xl font-black ${
              i < 3 ? 'border-brand-danger bg-brand-danger/10 text-brand-danger'
                    : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            <span className="text-[8px] font-black opacity-40 mb-1">{i < 3 ? 'POS' : 'FIX'}</span>
            {i < 3 ? (
              <motion.span
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
              >
                {MASK_VAR_CHARS[i]}
              </motion.span>
            ) : char}
          </div>
        ))}
      </div>
      <div className="text-[10px] font-black text-brand-danger uppercase tracking-[0.2em] flex items-center gap-2">
        <Layers size={12} /> Applied_Mask: [A-Z, 0-9]{'->'}2026
      </div>
    </motion.div>
  );
}

function RainbowVis() {
  const nodes = [
    { label: 'PLAIN',  icon: <FileText size={16} /> },
    { label: 'HASH',   icon: <Binary size={16} /> },
    { label: 'REDUCE', icon: <RefreshCw size={16} /> },
    { label: 'FOUND',  icon: <Unlock size={16} /> },
  ];
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-4 w-full max-w-lg px-8">
      <div className="w-full h-32 bg-black/40 rounded-2xl border border-brand-danger/20 flex items-center justify-between px-10 relative">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 z-10">
              <motion.div
                animate={{ borderColor: i === 2 ? '#ef4444' : 'rgba(239,68,68,0.2)' }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-10 h-10 rounded-xl border-2 flex items-center justify-center text-brand-danger bg-bg-card shadow-lg"
              >
                {node.icon}
              </motion.div>
              <span className="text-[8px] font-black text-text-dim uppercase">{node.label}</span>
            </div>
            {i < 3 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                className="flex-1 h-0.5 bg-brand-danger/30 origin-left"
              />
            )}
          </React.Fragment>
        ))}
        <div className="absolute bottom-2 right-4 text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          RECOVERY_SUCCESS: {'->'} "admin123"
        </div>
      </div>
      <p className="text-[10px] font-black text-brand-danger uppercase tracking-[0.2em] italic">
        Lookup_In_Precomputed_Rainbow_Chain
      </p>
    </motion.div>
  );
}

function SideChannelVis() {
  return (
    <motion.div {...SCENE} className="w-full max-w-md flex flex-col items-center gap-6">
      <div className="w-full h-32 bg-black/60 rounded-2xl border-2 border-brand-danger/20 relative overflow-hidden flex items-end px-4 pb-4">
        {[...Array(30)].map((_, i) => (
          <motion.div key={i}
            animate={{
              height:          i % 8 === 0 ? [30, 90, 30] : [10, 40, 10],
              backgroundColor: i % 8 === 0 ? '#ef4444' : '#ef444433',
            }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.02 }}
            className="w-full mx-[1px] rounded-t-sm"
          />
        ))}
        <div className="absolute top-4 left-6 flex items-center gap-2 text-[9px] font-black text-brand-danger/60 uppercase tracking-widest">
          <Zap size={12} /> Leakage_Signal_Analyzing
        </div>
      </div>
      <div className="flex gap-4 font-mono text-[11px] font-black text-brand-danger">
        EXTRACTED_KEY: <span className="text-white animate-pulse">1 0 1 1 0 0 ...</span>
      </div>
    </motion.div>
  );
}

function DictionaryVis() {
  const words = ['password', '123456', 'admin', 'shadow', 'master', 'shield'];
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-32 bg-black/40 rounded-2xl border-2 border-brand-danger/20 overflow-hidden">
        <motion.div
          animate={{ y: [-200, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="flex flex-col gap-4 items-center py-4"
        >
          {[...words, ...words].map((w, i) => (
            <span key={i} className={`text-sm font-black uppercase italic ${i % 6 === 2 ? 'text-brand-danger' : 'text-brand-danger/20'}`}>
              {w}
            </span>
          ))}
        </motion.div>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y-2 border-brand-danger bg-brand-danger/5 flex items-center justify-center z-10">
          <Search size={18} className="text-brand-danger animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      </div>
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">
        Scanning_Common_Pass_DB...
      </p>
    </motion.div>
  );
}

function BotnetVis() {
  return (
    <motion.div {...SCENE} className="relative w-full min-h-[220px] flex items-center justify-center overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.1, 1], borderColor: ['#ef444433', '#ef4444', '#ef444433'] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="z-10 w-24 h-24 bg-bg-card border-4 rounded-full flex items-center justify-center text-brand-danger shadow-[0_0_40px_rgba(239,68,68,0.2)]"
      >
        <Lock size={32} />
      </motion.div>
      {BOT_POSITIONS.map((pos, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0, x: pos.x, y: pos.y }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], x: 0, y: 0 }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.1 }}
          className="absolute w-8 h-8 bg-brand-danger/20 border border-brand-danger rounded-lg flex items-center justify-center text-brand-danger"
        >
          <Bot size={16} />
        </motion.div>
      ))}
      <div className="absolute top-4 left-6 text-[9px] font-black text-brand-danger/60 uppercase tracking-widest">
        Botnet_Auth_Flood_Active
      </div>
    </motion.div>
  );
}

function CollisionVis() {
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-4 w-full max-w-md">
      <div className="relative w-full h-32 bg-black/40 rounded-2xl border-2 border-brand-danger/20 flex items-center justify-center gap-20">
        <motion.div
          animate={{ x: [-100, 40], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 rounded-xl border-2 border-brand-danger/40 flex items-center justify-center text-brand-danger/40 bg-bg-card"
        >
          <FileText size={20} />
        </motion.div>
        <motion.div
          animate={{ x: [100, -40], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 rounded-xl border-2 border-brand-danger/40 flex items-center justify-center text-brand-danger/40 bg-bg-card"
        >
          <User size={20} />
        </motion.div>
        <motion.div
          animate={{ scale: [0.9, 1.2, 0.9], backgroundColor: ['rgba(239,68,68,0.05)', 'rgba(239,68,68,0.2)'] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-x-0 h-16 border-y-2 border-brand-danger bg-brand-danger/5 flex items-center justify-center z-10 font-mono font-black text-brand-danger uppercase"
        >
          <Unlock size={24} className="mr-2" /> Collision_Match
        </motion.div>
      </div>
      <p className="text-[10px] font-black text-brand-danger uppercase italic">
        Exploiting_Weak_Algorithm_Resistance
      </p>
    </motion.div>
  );
}


// ════════════════════════════════════════════════════════════════════
// STEP 1 — 분석·타겟팅 시각화
// ════════════════════════════════════════════════════════════════════

function AlgoVulnCards() {
  const algos = [
    { name: 'MD5',      bits: 128, status: 'BROKEN',  color: 'border-brand-danger/50 bg-brand-danger/5 text-brand-danger',    bar: 'bg-brand-danger',  pct: '15%' },
    { name: 'SHA-256',  bits: 256, status: 'FAST',    color: 'border-amber-400/50 bg-amber-400/5 text-amber-400',             bar: 'bg-amber-400',     pct: '50%' },
    { name: 'Bcrypt',   bits: 184, status: 'SLOW',    color: 'border-brand-primary/50 bg-brand-primary/5 text-brand-primary', bar: 'bg-brand-primary', pct: '80%' },
    { name: 'Argon2id', bits: 256, status: 'HARDEST', color: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400',       bar: 'bg-emerald-400',   pct: '98%' },
  ];
  return (
    <motion.div {...SCENE} className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      {algos.map((a, idx) => (
        <div key={a.name} className={`p-4 rounded-2xl border-2 ${a.color} space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-black">{a.name}</span>
            <Hash size={14} className="opacity-60" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{a.bits}-bit</p>
          <div className="h-1.5 bg-bg-main/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: a.pct }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: idx * 0.1 }}
              className={`h-full rounded-full ${a.bar}`}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest">{a.status}</p>
        </div>
      ))}
    </motion.div>
  );
}

function TargetProfileVis() {
  const tags = [
    { icon: <Globe size={14} />,  label: '국적·언어', val: '한국어권 → 한국어 사전' },
    { icon: <User size={14} />,   label: '연령대',    val: '2030대 → k-pop·게임·연예인' },
    { icon: <Key size={14} />,    label: '보안 정책', val: '8자+특수문자 → 마스크 병행' },
    { icon: <Server size={14} />, label: '유출 이력', val: 'Have I Been Pwned 조회' },
  ];
  return (
    <motion.div {...SCENE} className="grid grid-cols-2 gap-3 w-full">
      {tags.map(t => (
        <div key={t.label} className="flex items-start gap-3 p-4 bg-bg-input rounded-xl border border-border-subtle">
          <div className="p-2 bg-brand-danger/10 rounded-lg text-brand-danger shrink-0">{t.icon}</div>
          <div>
            <p className="text-[9px] font-black text-text-dim uppercase tracking-widest mb-1">{t.label}</p>
            <p className="text-xs font-bold text-text-bright">{t.val}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function PatternAnalysisVis() {
  const patterns = [
    { pattern: 'Abc12345', label: '대문자1 + 소문자3 + 숫자4',         pct: 28, color: 'text-brand-danger',  bar: 'bg-brand-danger'  },
    { pattern: 'abc1234!', label: '소문자4 + 숫자3 + 특수1',           pct: 21, color: 'text-amber-400',    bar: 'bg-amber-400'    },
    { pattern: 'Abc1234!', label: '대문자1 + 소문자3 + 숫자3 + 특수1', pct: 18, color: 'text-brand-primary', bar: 'bg-brand-primary' },
    { pattern: '기타',     label: '그 외 조합',                         pct: 33, color: 'text-text-dim',     bar: 'bg-text-dim/30'  },
  ];
  return (
    <motion.div {...SCENE} className="space-y-2 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">실제 유출 비밀번호 패턴 분포</p>
      {patterns.map((p, idx) => (
        <div key={p.pattern} className="flex items-center gap-4 p-3 bg-bg-input rounded-xl">
          <code className={`text-sm font-mono font-black w-24 shrink-0 ${p.color}`}>{p.pattern}</code>
          <span className="text-[10px] text-text-dim flex-1">{p.label}</span>
          <div className="w-24 h-1.5 bg-bg-main/40 rounded-full overflow-hidden shrink-0">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${p.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
              className={`h-full rounded-full ${p.bar}`}
            />
          </div>
          <span className={`text-sm font-black w-8 text-right shrink-0 ${p.color}`}>{p.pct}%</span>
        </div>
      ))}
    </motion.div>
  );
}

function LeakScaleVis() {
  const breaches = [
    { year: 2013, site: 'Adobe',     count: '1억 5,300만', pct: 25,  color: 'bg-amber-400'    },
    { year: 2016, site: 'LinkedIn',  count: '1억 1,700만', pct: 19,  color: 'bg-brand-primary' },
    { year: 2019, site: 'Facebook',  count: '5억 4,000만', pct: 44,  color: 'bg-cyan-400'      },
    { year: 2024, site: 'HIBP 누적', count: '120억+',      pct: 100, color: 'bg-brand-danger'  },
  ];
  return (
    <motion.div {...SCENE} className="space-y-3 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">주요 데이터 유출 사고 누적 계정 수</p>
      {breaches.map((b, idx) => (
        <div key={b.site} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black">
            <span className="text-text-dim">{b.year} · {b.site}</span>
            <span className="text-text-bright font-mono">{b.count}건</span>
          </div>
          <div className="h-2 bg-bg-main/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${b.pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: idx * 0.15 }}
              className={`h-full rounded-full ${b.color} opacity-70`}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function WaveformVis() {
  return (
    <motion.div {...SCENE} className="w-full space-y-3">
      <div className="p-5 bg-bg-card rounded-2xl border border-border-subtle space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-black text-text-dim uppercase tracking-widest">
          <Zap size={12} className="text-brand-danger" /> 전력 소비 파형 — 암호 연산 중 측정
        </div>
        <div className="flex items-end gap-1 h-20">
          {WAVE_HEIGHTS.map((h, i) => (
            <motion.div key={i}
              initial={{ height: 0 }} animate={{ height: `${h}%` }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: 'easeOut' }}
              className={`flex-1 rounded-t-sm ${i === 7 || i === 15 ? 'bg-brand-danger' : 'bg-brand-danger/25'}`}
            />
          ))}
        </div>
        <p className="text-[9px] text-text-dim">
          <span className="text-brand-danger font-black">빨간 스파이크</span> = 특정 비트 처리 시 발생하는 고유 전력 패턴
        </p>
      </div>
    </motion.div>
  );
}

function AlgoStatusVis() {
  const algos = [
    { name: 'MD5',     safe: false, status: '완전 파쇄',   note: '2004년 충돌 증명, 현재 초 단위 파훼' },
    { name: 'SHA-1',   safe: false, status: '이론적 파쇄', note: '2017년 Google SHAttered 공격 성공'  },
    { name: 'SHA-256', safe: true,  status: '현재 안전',   note: '2²⁵⁶ 공간, 현대 기술로 파훼 불가'   },
    { name: 'SHA-3',   safe: true,  status: '현재 안전',   note: '완전히 다른 설계, 충돌 내성 강화'   },
  ];
  return (
    <motion.div {...SCENE} className="grid grid-cols-2 gap-3 w-full">
      {algos.map((a, idx) => (
        <motion.div key={a.name}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-2xl border-2 space-y-2 ${a.safe ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-brand-danger/5 border-brand-danger/30'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-text-bright">{a.name}</span>
            {a.safe ? <Shield size={14} className="text-emerald-400" /> : <ShieldOff size={14} className="text-brand-danger" />}
          </div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${a.safe ? 'text-emerald-400' : 'text-brand-danger'}`}>{a.status}</p>
          <p className="text-[9px] text-text-dim leading-snug">{a.note}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
// Rainbow Table Step 1 — Pre-computation 가능성 체크
// (Brute Force의 AlgoVulnCards와 다른 맥락: "이 알고리즘으로 정답지를 만들 수 있는가")
function RainbowPrecomputeVis() {
  const checks = [
    {
      algo: 'MD5',
      precomputable: true,
      saltable: false,
      note: '솔트 없음 → 테이블 재사용 가능, 즉시 조회',
      color: 'border-brand-danger/50 bg-brand-danger/5 text-brand-danger',
    },
    {
      algo: 'SHA-1',
      precomputable: true,
      saltable: false,
      note: '솔트 없음 → 수십 GB 테이블로 커버',
      color: 'border-amber-400/50 bg-amber-400/5 text-amber-400',
    },
    {
      algo: 'MD5 + Salt',
      precomputable: false,
      saltable: true,
      note: '사용자마다 다른 솔트 → 테이블 무한 필요',
      color: 'border-brand-primary/50 bg-brand-primary/5 text-brand-primary',
    },
    {
      algo: 'Bcrypt / Argon2',
      precomputable: false,
      saltable: true,
      note: '내장 솔트 + 느린 연산 → 테이블 생성 자체 불가',
      color: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400',
    },
  ];
  return (
    <motion.div {...SCENE} className="space-y-3 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">
        레인보우 테이블 공격 가능 여부 — 알고리즘별 판정
      </p>
      {checks.map((c, idx) => (
        <motion.div
          key={c.algo}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`flex items-center gap-4 p-4 rounded-xl border-2 ${c.color}`}
        >
          <span className="text-sm font-black w-28 shrink-0">{c.algo}</span>
          <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0 ${
            c.precomputable
              ? 'bg-brand-danger/20 text-brand-danger border border-brand-danger/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {c.precomputable ? '공격 가능' : '공격 불가'}
          </div>
          <span className="text-[10px] text-text-dim flex-1">{c.note}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}




// ════════════════════════════════════════════════════════════════════
// STEP 2 — 준비 시각화
// ════════════════════════════════════════════════════════════════════

function CharsetVis() {
  const sets = [
    { label: '숫자',          chars: '0–9',      count: 10, combo: '1억',     time: '< 1초',    color: 'border-emerald-500/40 text-emerald-400', bar: 'bg-emerald-500' },
    { label: '소문자',        chars: 'a–z',      count: 26, combo: '2천억',   time: '수 분',    color: 'border-cyan-400/40 text-cyan-400',        bar: 'bg-cyan-400'    },
    { label: '대+소문자',     chars: 'A–Z+a–z',  count: 52, combo: '50조',    time: '수 시간',  color: 'border-amber-400/40 text-amber-400',      bar: 'bg-amber-400'   },
    { label: '혼합+특수문자', chars: 'A–z+!@#…', count: 95, combo: '6,600조', time: '수 일~주', color: 'border-brand-danger/40 text-brand-danger', bar: 'bg-brand-danger' },
  ];
  return (
    <motion.div {...SCENE} className="space-y-2 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">8자리 기준 조합 수 & GPU 파훼 시간</p>
      {sets.map((s, idx) => (
        <div key={s.label} className={`flex items-center gap-3 p-3 rounded-xl border bg-bg-input/50 ${s.color}`}>
          <span className="text-xs font-black w-24 shrink-0">{s.label}</span>
          <code className="text-[10px] font-mono text-text-dim w-20 shrink-0">{s.chars}</code>
          <div className="flex-1 h-1.5 bg-bg-main/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Math.log(s.count) / Math.log(95)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
              className={`h-full rounded-full ${s.bar}`}
            />
          </div>
          <span className="text-[10px] font-black w-14 text-right shrink-0">{s.combo}</span>
          <span className="text-[10px] text-text-dim w-16 text-right shrink-0">{s.time}</span>
        </div>
      ))}
    </motion.div>
  );
}

function WordlistScaleVis() {
  const dbs = [
    { name: 'RockYou (2009)',      count: '14,000,000',  pct: 12,  color: 'bg-amber-400'    },
    { name: 'LinkedIn (2012)',     count: '117,000,000', pct: 45,  color: 'bg-brand-primary' },
    { name: 'Adobe (2013)',        count: '153,000,000', pct: 56,  color: 'bg-cyan-400'      },
    { name: 'HIBP 통합 DB (2024)', count: '613,584,246', pct: 100, color: 'bg-brand-danger'  },
  ];
  return (
    <motion.div {...SCENE} className="space-y-3 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">주요 유출 데이터베이스 규모</p>
      {dbs.map((db, idx) => (
        <div key={db.name} className="space-y-1">
          <div className="flex justify-between text-[10px] font-black">
            <span className="text-text-dim">{db.name}</span>
            <span className="text-text-bright font-mono">{db.count}건</span>
          </div>
          <div className="h-2 bg-bg-main/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${db.pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: idx * 0.15 }}
              className={`h-full rounded-full ${db.color} opacity-70`}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function MaskSlotVis() {
  const slots = [
    { type: '대문자', char: 'A', color: 'border-brand-danger/50 bg-brand-danger/10 text-brand-danger'    },
    { type: '소문자', char: 'b', color: 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' },
    { type: '소문자', char: 'c', color: 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' },
    { type: '소문자', char: 'd', color: 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' },
    { type: '소문자', char: 'e', color: 'border-brand-primary/50 bg-brand-primary/10 text-brand-primary' },
    { type: '숫자',   char: '1', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'       },
    { type: '숫자',   char: '2', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'       },
    { type: '특수',   char: '!', color: 'border-amber-400/50 bg-amber-400/10 text-amber-400'             },
  ];
  return (
    <motion.div {...SCENE} className="space-y-4 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">마스크 패턴 예시: ?u?l?l?l?l?d?d?s</p>
      <div className="flex gap-2 flex-wrap">
        {slots.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`w-14 h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-1 ${s.color}`}
          >
            <span className="text-lg font-mono font-black">{s.char}</span>
            <span className="text-[8px] font-black opacity-60 uppercase">{s.type}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] text-text-dim font-medium">
        탐색 공간: 26 × 26⁴ × 10² × 33 ={' '}
        <span className="text-brand-danger font-black">약 1.9조 가지</span>
        {'  →  '}전체 무차별(6,600조) 대비{' '}
        <span className="text-emerald-400 font-black">3,500분의 1</span>
      </p>
    </motion.div>
  );
}

function RainbowScaleVis() {
  return (
    <motion.div {...SCENE} className="grid md:grid-cols-2 gap-4 w-full">
      <div className="p-5 bg-brand-danger/5 border border-brand-danger/30 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-brand-danger">
          <ShieldOff size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Salt 없는 시스템</span>
        </div>
        {[
          { label: 'MD5 전체 테이블',   size: '~64 GB',  time: '수 주 생성' },
          { label: 'SHA-1 전체 테이블', size: '~160 GB', time: '수 개월 생성' },
        ].map(r => (
          <div key={r.label} className="flex items-center justify-between p-3 bg-bg-card rounded-xl">
            <span className="text-xs text-text-dim">{r.label}</span>
            <div className="text-right">
              <p className="text-xs font-black text-brand-danger">{r.size}</p>
              <p className="text-[9px] text-text-dim">{r.time}</p>
            </div>
          </div>
        ))}
        <p className="text-[10px] font-black text-brand-danger">→ 공격 시 조회 시간: 0.1초</p>
      </div>
      <div className="p-5 bg-emerald-500/5 border border-emerald-500/30 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Shield size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Salt 적용 시스템</span>
        </div>
        <p className="text-sm font-medium text-text-dim leading-relaxed">
          사용자 100만 명 × 각자 다른 Salt ={' '}
          <span className="font-black text-emerald-400">테이블 100만 개</span> 필요
        </p>
        <p className="text-xs text-text-dim">
          MD5 기준 64GB × 100만 ={' '}
          <span className="font-black text-emerald-400">64 엑사바이트</span>
        </p>
        <p className="text-[10px] font-black text-emerald-400">→ 현실적으로 불가능한 비용</p>
      </div>
    </motion.div>
  );
}

function BotFlowVis() {
  const steps = [
    { icon: <Database size={16} />, label: 'Combo List',  sub: '이메일+비밀번호',   color: 'text-brand-danger'  },
    { icon: <Cpu size={16} />,      label: 'Bot Engine',  sub: 'OpenBullet 등',    color: 'text-amber-400'    },
    { icon: <Globe size={16} />,    label: 'Proxy Pool',  sub: '수천 개 IP 우회',  color: 'text-brand-primary' },
    { icon: <Server size={16} />,   label: 'Target Site', sub: '로그인 엔드포인트', color: 'text-cyan-400'     },
    { icon: <Key size={16} />,      label: 'Hit Account', sub: '탈취 성공 계정',   color: 'text-emerald-400'  },
  ];
  return (
    <motion.div {...SCENE} className="flex items-center gap-2 w-full overflow-x-auto pb-2">
      {steps.map((s, i) => (
        <React.Fragment key={s.label}>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className={`p-3 bg-bg-input rounded-xl border border-border-subtle ${s.color}`}>{s.icon}</div>
            <p className={`text-[9px] font-black uppercase tracking-tight ${s.color}`}>{s.label}</p>
            <p className="text-[8px] text-text-dim text-center">{s.sub}</p>
          </div>
          {i < steps.length - 1 && (
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="text-brand-danger font-black text-lg shrink-0 mx-1"
            >→</motion.span>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

function NoiseFilterVis() {
  return (
    <motion.div {...SCENE} className="grid md:grid-cols-2 gap-4 w-full">
      {[
        { label: '필터 전 — 원시 신호', data: RAW_SIGNAL,   barColor: 'bg-text-dim/30',     accent: 'text-text-dim'     },
        { label: '필터 후 — 정제 신호', data: CLEAN_SIGNAL, barColor: 'bg-brand-danger/60', accent: 'text-brand-danger' },
      ].map(chart => (
        <div key={chart.label} className="p-4 bg-bg-card rounded-2xl border border-border-subtle space-y-2">
          <p className={`text-[9px] font-black uppercase tracking-widest ${chart.accent}`}>{chart.label}</p>
          <div className="flex items-end gap-0.5 h-14">
            {chart.data.map((h, i) => (
              <motion.div key={i}
                initial={{ height: 0 }} animate={{ height: `${h}%` }}
                transition={{ duration: 0.4, delay: i * 0.02, ease: 'easeOut' }}
                className={`flex-1 rounded-t-sm ${chart.barColor}`}
              />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function BirthdayParadoxVis() {
  const cases = [
    { people: 10, pct: 12, label: '10명 모임' },
    { people: 23, pct: 50, label: '23명 모임' },
    { people: 50, pct: 97, label: '50명 모임' },
    { people: 70, pct: 99, label: '70명 모임' },
  ];
  return (
    <motion.div {...SCENE} className="space-y-3 w-full">
      <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-2">
        생일 파티 — "같은 생일인 두 사람이 있을 확률"
      </p>
      {cases.map((c, idx) => (
        <div key={c.people} className="space-y-1">
          <div className="flex justify-between text-xs font-black">
            <span className="text-text-dim">{c.label}</span>
            <span className={c.pct >= 50 ? 'text-brand-danger' : 'text-text-bright'}>{c.pct}%</span>
          </div>
          <div className="h-2 bg-bg-main/40 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${c.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.15 }}
              className={`h-full rounded-full ${c.pct >= 50 ? 'bg-brand-danger' : 'bg-brand-primary'}`}
            />
          </div>
        </div>
      ))}
      <p className="text-[10px] text-text-dim font-medium pt-1">
        해시 함수도 동일한 원리 — 출력 공간이 유한하면 충분한 입력으로 충돌이{' '}
        <span className="text-brand-danger font-black">반드시</span> 발생합니다.
      </p>
    </motion.div>
  );
}


// ════════════════════════════════════════════════════════════════════
// 메인 라우터 — step 파라미터로 분기
// ════════════════════════════════════════════════════════════════════
function getVisual(id, step) {
  if (step === 'step1') {
    if (id.includes('brute'))   return <AlgoVulnCards        key={`${id}-s1`} />;
    if (id.includes('rainbow'))  return <RainbowPrecomputeVis key={`${id}-s1`} />;
    if (id.includes('dictionary'))                       return <TargetProfileVis   key={`${id}-s1`} />;
    if (id.includes('mask'))                             return <PatternAnalysisVis key={`${id}-s1`} />;
    if (id.includes('stuffing'))                         return <LeakScaleVis       key={`${id}-s1`} />;
    if (id.includes('side'))                             return <WaveformVis        key={`${id}-s1`} />;
    if (id.includes('collision'))                        return <AlgoStatusVis      key={`${id}-s1`} />;
  }

  if (step === 'step2') {
    if (id.includes('brute'))      return <CharsetVis         key={`${id}-s2`} />;
    if (id.includes('dictionary')) return <WordlistScaleVis   key={`${id}-s2`} />;
    if (id.includes('mask'))       return <MaskSlotVis        key={`${id}-s2`} />;
    if (id.includes('rainbow'))    return <RainbowScaleVis    key={`${id}-s2`} />;
    if (id.includes('stuffing'))   return <BotFlowVis         key={`${id}-s2`} />;
    if (id.includes('side'))       return <NoiseFilterVis     key={`${id}-s2`} />;
    if (id.includes('collision'))  return <BirthdayParadoxVis key={`${id}-s2`} />;
  }

  // step3 (기본값)
  if (id.includes('brute'))      return <BruteForceVis  key={`${id}-s3`} />;
  if (id.includes('mask'))       return <MaskAttackVis  key={`${id}-s3`} />;
  if (id.includes('rainbow'))    return <RainbowVis     key={`${id}-s3`} />;
  if (id.includes('side'))       return <SideChannelVis key={`${id}-s3`} />;
  if (id.includes('dictionary')) return <DictionaryVis  key={`${id}-s3`} />;
  if (id.includes('stuffing'))   return <BotnetVis      key={`${id}-s3`} />;
  if (id.includes('collision'))  return <CollisionVis   key={`${id}-s3`} />;

  return (
    <div className="flex flex-col items-center gap-4 opacity-20">
      <Cpu size={48} className="text-brand-danger animate-pulse" />
    </div>
  );
}

export default function AttackVectorsVisualizer({ selectedId, step = 'step3' }) {
  const id = String(selectedId || '').toLowerCase();
  return (
    <div className="relative w-full flex items-center justify-center p-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {getVisual(id, step)}
      </AnimatePresence>
    </div>
  );
}