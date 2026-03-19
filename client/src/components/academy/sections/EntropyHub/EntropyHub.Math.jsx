import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Shield, Info } from 'lucide-react';
import content from '../../data/entropyContent.json';
import { titleMd, bodyBase, bodyDim, panelAccent } from '../../styles';
import { InsightFooter } from '../../ui';

const data = content.phases[1];

/* 등급별 색상 */
const BG_HEX = {
  F: 'rgba(239,68,68,0.3)',
  C: 'rgba(251,191,36,0.3)',
  B: 'rgba(99,102,241,0.3)',
  A: 'rgba(96,165,250,0.3)',
  S: 'rgba(52,211,153,0.3)',
};
const BORDER_HEX = {
  F: 'rgba(239,68,68,0.3)',
  C: 'rgba(251,191,36,0.3)',
  B: 'rgba(99,102,241,0.3)',
  A: 'rgba(96,165,250,0.3)',
  S: 'rgba(52,211,153,0.3)',
};

const GRADE_COLOR = {
  F:{ text:'text-brand-danger',  bg:'bg-brand-danger/10',  border:'border-brand-danger/30' },
  C:{ text:'text-amber-400',     bg:'bg-amber-400/10',     border:'border-amber-400/30' },
  B:{ text:'text-brand-primary', bg:'bg-brand-primary/10', border:'border-brand-primary/30' },
  A:{ text:'text-blue-400',      bg:'bg-blue-400/10',      border:'border-blue-400/30' },
  S:{ text:'text-emerald-400',   bg:'bg-emerald-400/10',   border:'border-emerald-400/30' },
};

/* 인터랙티브 엔트로피 슬라이더 */
function EntropySlider() {
  const [length, setLength] = useState(8);
  const [charsetIdx, setCharsetIdx] = useState(0);
  const charsets = [
    { label:'소문자', size:26 },
    { label:'대+소문자', size:52 },
    { label:'+숫자', size:62 },
    { label:'+특수문자', size:94 },
  ];
  const R = charsets[charsetIdx].size;
  const E = Math.floor(length * Math.log2(R));
  const grade = E>=128?'S':E>=80?'A':E>=60?'B':E>=40?'C':'F';
  const gc = GRADE_COLOR[grade];

  // 크랙 시간 (RTX 4090 기준)
  const seconds = Math.pow(2, E) / 1e10 / 2;
  const crackLabel = !isFinite(seconds)||seconds>1e25 ? '∞ (우주적 한계)' :
    seconds < 1 ? '1초 미만' : seconds < 60 ? `${Math.floor(seconds)}초` :
    seconds < 3600 ? `${Math.floor(seconds/60)}분` :
    seconds < 86400 ? `${Math.floor(seconds/3600)}시간` :
    seconds < 31536000 ? `${Math.floor(seconds/86400)}일` :
    seconds/31536000 < 10000 ? `${Math.floor(seconds/31536000).toLocaleString()}년` :
    seconds/31536000 < 1e8 ? `${(seconds/31536000/1e4).toFixed(1)}만년` : '∞';

  return (
    <div className={`${panelAccent.primary} space-y-6`}>
      <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest">
        <TrendingUp size={12} /> Live Entropy Calculator
      </div>

      {/* 길이 슬라이더 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-black text-text-dim uppercase tracking-widest">길이 (L)</label>
          <span className="text-lg font-black text-text-bright font-mono">{length}자</span>
        </div>
        <input type="range" min={4} max={32} value={length}
          onChange={e => setLength(+e.target.value)}
          className="w-full accent-brand-primary" />
        <div className="flex justify-between text-[9px] text-text-dim font-mono">
          <span>4</span><span>32</span>
        </div>
      </div>

      {/* 문자 집합 */}
      <div className="space-y-2">
        <label className="text-xs font-black text-text-dim uppercase tracking-widest">문자 집합 (R)</label>
        <div className="grid grid-cols-4 gap-2">
          {charsets.map((c, i) => (
            <button key={i} onClick={() => setCharsetIdx(i)}
              className={`py-2 px-2 rounded-xl text-[10px] font-black border transition-all ${
                i === charsetIdx
                  ? 'bg-brand-primary/15 border-brand-primary/50 text-brand-primary'
                  : 'bg-bg-main border-border-subtle text-text-dim hover:border-brand-primary/30'
              }`}>
              {c.label}<br/>
              <span className="font-mono text-[9px]">({c.size})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div className={`p-5 rounded-2xl border ${gc.bg} ${gc.border} flex items-center justify-between`}>
        <div>
          <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">엔트로피 E = {length} × log₂({R})</p>
          <p className={`text-4xl font-black font-mono ${gc.text}`}>{E} <span className="text-base">bits</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">RTX 4090 크랙 시간</p>
          <p className={`text-lg font-black font-mono ${gc.text}`}>{crackLabel}</p>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${gc.bg} ${gc.text} border ${gc.border} mt-1 inline-block`}>
            {grade}등급
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EntropyMath({ onNext }) {
  return (
    <div className="space-y-16 py-8">

      {/* 헤더 */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
          <TrendingUp size={11} /> {data.badge}
        </div>
        <h2 className={titleMd}>{data.title}: {data.subTitle}</h2>
      </motion.div>

      {/* 내러티브 */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        className="space-y-4">
        {data.narrative.map((p, i) => (
          <p key={i} className={`${bodyBase} text-base leading-relaxed`}>{p}</p>
        ))}
      </motion.div>

      {/* 수식 블록 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <div className="p-8 bg-bg-card rounded-3xl border border-border-subtle space-y-6">
          <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{data.formula.label}</p>
          <div className="text-center py-6">
            <span className="text-5xl font-black font-mono text-text-bright tracking-tight">
              {data.formula.expression}
            </span>
          </div>
          <p className="text-xs text-text-dim font-medium italic border-t border-border-subtle pt-4">
            {data.formula.note}
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {data.formula.variables.map((v, i) => (
              <div key={i} className="p-4 bg-bg-input rounded-2xl border border-border-subtle space-y-1">
                <span className="text-2xl font-black font-mono text-brand-primary">{v.symbol}</span>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{v.name}</p>
                <p className="text-xs text-text-base">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 인터랙티브 계산기 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <EntropySlider />
      </motion.div>

      {/* 비교 카드 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4">같은 노력, 다른 결과</p>
        <div className="grid md:grid-cols-2 gap-4">
          {data.comparison.map((c, i) => {
            const gc = GRADE_COLOR[c.grade];
            const isDangerous = c.verdict === 'DANGEROUS';
            return (
              <div key={i} className={`p-6 rounded-3xl border-2 ${gc.bg} ${gc.border} space-y-4`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">{c.label}</p>
                    <p className={`font-mono text-xl font-black mt-1 ${gc.text}`}>{c.example}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${gc.bg} ${gc.text} ${gc.border} shrink-0`}>
                    {c.verdictLabel}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] text-text-dim uppercase tracking-widest">엔트로피</p>
                    <p className={`text-2xl font-black font-mono ${gc.text}`}>{c.bits}<span className="text-sm ml-1">bits</span></p>
                  </div>
                  <div>
                    <p className="text-[9px] text-text-dim uppercase tracking-widest">크랙 시간</p>
                    <p className={`text-sm font-black ${gc.text}`}>{c.crackTime}</p>
                  </div>
                </div>
                <p className="text-xs text-text-dim leading-relaxed">{c.reason}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 엔트로피 등급 스케일 바 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4">엔트로피 등급 기준</p>
        <div className="space-y-2">
          {data.entropyScale.map((s, i) => {
            const gc = GRADE_COLOR[s.grade];
            const widthMap = { F:'20%', C:'35%', B:'55%', A:'75%', S:'100%' };
            return (
              <motion.div key={i}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                transition={{ delay: 0.3 + i*0.07 }}
                className="flex items-center gap-3"
              >
                <span className={`text-[10px] font-black font-mono w-4 shrink-0 ${gc.text}`}>{s.grade}</span>
                <div className="flex-1 h-7 bg-bg-input rounded-xl overflow-hidden border border-border-subtle">
                  <motion.div
                    initial={{ width:0 }} animate={{ width: widthMap[s.grade] || '50%' }}
                    transition={{ delay: 0.4 + i*0.07, duration:0.6, ease:'easeOut' }}
                    className="h-full border-r flex items-center px-3"
                    style={{ backgroundColor: BG_HEX[s.grade], borderColor: BORDER_HEX[s.grade] }}
                  >
                    <span className={`text-[10px] font-black ${gc.text} whitespace-nowrap`}>{s.bits}+ bits — {s.label}</span>
                  </motion.div>
                </div>
                <span className="text-[9px] text-text-dim font-mono w-20 shrink-0">{s.example}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 학습 포인트 */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
        className="p-6 bg-bg-card rounded-3xl border border-border-subtle space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2">
          <Info size={12} /> Learning Guide
        </div>
        {data.learningGuide.map((g, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-brand-primary font-black shrink-0 mt-0.5">▹</span>
            <p className={bodyDim}>{g}</p>
          </div>
        ))}
      </motion.div>

      {/* 해커 인용구 */}
      <InsightFooter
        accent="danger"
        icon={<AlertTriangle size={28} />}
        label="Hacker's Perspective"
        title="공격자의 시각"
        body={data.hackerQuote.text}
        extra={<p className="text-[10px] text-text-dim italic mt-1">{data.hackerQuote.source}</p>}
        bgIcon={<AlertTriangle size={180} />}
      />
    </div>
  );
}