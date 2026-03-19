import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, X, ShieldCheck, AlertTriangle, Info, Keyboard } from 'lucide-react';
import { generateKShieldPassword, getRandomWord, K_DICTIONARY } from './utils/kShieldLogic';
import content from '../../data/entropyContent.json';
import { titleMd, bodyBase, bodyDim, panelAccent } from '../../styles';
import { InsightFooter } from '../../ui';

const data = content.phases[2];

const GRADE_COLOR = {
  F:{ text:'text-brand-danger',  bg:'bg-brand-danger/10',  border:'border-brand-danger/30',  bar:'bg-brand-danger' },
  C:{ text:'text-amber-400',     bg:'bg-amber-400/10',     border:'border-amber-400/30',     bar:'bg-amber-400' },
  B:{ text:'text-brand-primary', bg:'bg-brand-primary/10', border:'border-brand-primary/30', bar:'bg-brand-primary' },
  A:{ text:'text-blue-400',      bg:'bg-blue-400/10',      border:'border-blue-400/30',      bar:'bg-blue-400' },
  S:{ text:'text-emerald-400',   bg:'bg-emerald-400/10',   border:'border-emerald-400/30',   bar:'bg-emerald-400' },
};
const GRADE_WIDTH = { F:'15%', C:'30%', B:'50%', A:'72%', S:'100%' };
const CATEGORIES = Object.keys(K_DICTIONARY);

export default function EntropyGenerator({ onNext }) {
  const [customWords, setCustomWords] = useState([]);
  const [inputWord, setInputWord] = useState('');
  const [category, setCategory] = useState('RANDOM');
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const r = generateKShieldPassword({ customWords, category, includeSymbol });
      setResult(r);
      setLoading(false);
    }, 300);
  }, [customWords, category, includeSymbol]);

  const addWord = () => {
    const w = inputWord.trim();
    if (!w || customWords.length >= 3) return;
    setCustomWords(prev => [...prev, w]);
    setInputWord('');
  };
  const removeWord = (i) => setCustomWords(prev => prev.filter((_, idx) => idx !== i));
  const addRandom = () => {
    if (customWords.length >= 3) return;
    const w = getRandomWord(category);
    if (!customWords.includes(w)) setCustomWords(prev => [...prev, w]);
  };

  const gc = result ? GRADE_COLOR[result.analysis.strength.grade] : null;

  return (
    <div className="space-y-14 py-8">

      {/* 헤더 */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest">
          <Keyboard size={11} /> {data.badge}
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

      {/* 작동 원리 4단계 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-5">작동 원리</p>
        <div className="grid md:grid-cols-2 gap-4">
          {data.howItWorks.map((step, i) => (
            <div key={i} className="p-5 bg-bg-card border border-border-subtle rounded-2xl space-y-2 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl font-black text-text-dim/5 font-mono select-none">
                {String(step.step).padStart(2,'0')}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-primary flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {step.step}
                </div>
                <p className="text-sm font-black text-text-bright">{step.title}</p>
              </div>
              <p className={bodyDim}>{step.desc}</p>
              {step.tip && (
                <p className="text-[10px] text-brand-primary/70 font-black italic border-t border-brand-primary/10 pt-2">
                  💡 {step.tip}
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 변환 예시 글자별 시각화 */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-4">변환 예시 — "{data.exampleConversion.korean}"</p>
        <div className="p-6 bg-bg-card rounded-3xl border border-border-subtle space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {data.exampleConversion.annotated.map((a, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="px-3 py-2 bg-bg-input border border-border-subtle rounded-xl">
                  <span className="text-xl font-black text-text-bright">{a.char}</span>
                </div>
                <div className="flex gap-1">
                  {a.jamos.map((j, ji) => (
                    <span key={ji} className="text-[9px] font-black text-text-dim bg-bg-input border border-border-subtle rounded px-1">{j}</span>
                  ))}
                </div>
                <div className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                  <span className="text-sm font-black font-mono text-brand-primary">{a.mapped}</span>
                </div>
                <span className="text-[8px] text-text-dim max-w-[80px] text-center leading-tight">{a.note}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 pl-4 border-l border-border-subtle ml-2">
              <span className="text-[9px] text-text-dim">최종</span>
              <span className="text-xl font-black font-mono text-emerald-400">{data.exampleConversion.roman}</span>
              <span className="text-[9px] text-text-dim">{data.exampleConversion.length}자</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 생성기 ── */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className={`${panelAccent.primary} space-y-6`}>

        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">K-Shield Generator</p>

        {/* 카테고리 선택 */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">단어 카테고리</label>
          <div className="flex flex-wrap gap-2">
            {['RANDOM', ...CATEGORIES].map(cat => (
              <button key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                  category === cat
                    ? 'bg-brand-primary/15 border-brand-primary/50 text-brand-primary'
                    : 'bg-bg-main border-border-subtle text-text-dim hover:border-brand-primary/30'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 직접 입력 */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">
            단어 직접 입력 (최대 3개) — 비워두면 사전 자동 선택
          </label>
          <div className="flex gap-2">
            <input
              value={inputWord}
              onChange={e => setInputWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWord()}
              placeholder="한글 단어 입력..."
              maxLength={20}
              className="flex-1 bg-bg-main border border-border-subtle rounded-xl px-4 py-2.5 text-sm font-mono text-text-bright placeholder:text-text-dim/40 focus:outline-none focus:border-brand-primary/50 transition-colors"
            />
            <button onClick={addWord} disabled={!inputWord.trim() || customWords.length >= 3}
              className="px-4 py-2.5 bg-brand-primary text-white rounded-xl font-black text-xs disabled:opacity-40 hover:brightness-110 transition-all">
              <Plus size={16} />
            </button>
            <button onClick={addRandom} disabled={customWords.length >= 3}
              className="px-4 py-2.5 bg-bg-main border border-border-subtle rounded-xl text-xs font-black text-text-dim hover:border-brand-primary/50 disabled:opacity-40 transition-all flex items-center gap-1.5">
              <RefreshCw size={13} /> 랜덤
            </button>
          </div>
          {/* 선택된 단어 태그 */}
          {customWords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {customWords.map((w, i) => (
                <span key={i}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-xs font-black text-brand-primary">
                  {w}
                  <button onClick={() => removeWord(i)} className="hover:text-brand-danger transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 옵션 */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-black text-text-dim uppercase tracking-widest">특수문자 삽입</label>
          <button
            onClick={() => setIncludeSymbol(v => !v)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 overflow-hidden ${includeSymbol ? 'bg-emerald-500' : 'bg-border-subtle'}`}>
            <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: includeSymbol ? '23px' : '4px' }} />
          </button>
        </div>

        {/* 생성 버튼 */}
        <button onClick={generate}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          {loading ? (
            <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:0.6 }}>
              <RefreshCw size={16} />
            </motion.div>
          ) : <><ShieldCheck size={16} /> 비밀번호 생성</>}
        </button>
      </motion.div>

      {/* ── 결과 ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            key={result.password}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
            className="space-y-5"
          >
            {/* 안전장치 알림 */}
            {result.wasGuarded && (
              <div className="flex items-start gap-3 p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
                <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs font-black text-amber-400">
                  입력한 단어만으로는 보안이 부족해 <strong>[{result.autoAdded.join(', ')}]</strong>를 자동으로 추가했습니다. (80bits 미만 → A등급 보장)
                </p>
              </div>
            )}

            {/* 비밀번호 출력 */}
            <div className={`p-6 rounded-3xl border-2 ${gc.bg} ${gc.border} space-y-4`}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">생성된 비밀번호</p>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${gc.bg} ${gc.text} ${gc.border}`}>
                  {result.analysis.strength.grade}등급 — {result.analysis.strength.label}
                </span>
              </div>
              <p className={`font-mono text-xl md:text-2xl font-black break-all ${gc.text}`}>
                {result.password}
              </p>
              {/* 엔트로피 바 */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-text-dim font-mono">
                  <span>엔트로피</span>
                  <span>{result.analysis.entropy} bits / charset R={result.analysis.charsetSize}</span>
                </div>
                <div className="h-2 bg-bg-main rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width: GRADE_WIDTH[result.analysis.strength.grade] }}
                    transition={{ duration:0.7, ease:'easeOut' }}
                    className={`h-full rounded-full ${gc.bar}`}
                  />
                </div>
              </div>
            </div>

            {/* 단어별 변환 분해 */}
            <div className="p-5 bg-bg-card border border-border-subtle rounded-2xl space-y-3">
              <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">단어별 변환 추적</p>
              {result.mnemonic.breakdown.map((b, i) => (
                <div key={i} className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-bg-input border border-border-subtle rounded-lg text-sm font-black text-text-bright">{b.korean}</span>
                  <span className="text-text-dim text-xs">→</span>
                  <span className="font-mono text-sm font-black text-brand-primary">{b.english}</span>
                  <span className="text-[9px] text-text-dim">({b.length}자)</span>
                </div>
              ))}
            </div>

            {/* 기억하는 방법 */}
            <div className="p-4 bg-brand-primary/5 border border-brand-primary/15 rounded-2xl flex items-start gap-3">
              <Info size={14} className="text-brand-primary shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-text-base">{result.mnemonic.instruction}</p>
            </div>

            {/* 크랙 시간 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.benchmarks.map((b, i) => (
                <div key={i} className={`p-4 rounded-2xl border text-center space-y-1 ${b.isSafe ? 'bg-emerald-400/5 border-emerald-400/20' : 'bg-brand-danger/5 border-brand-danger/20'}`}>
                  <p className="text-base">{b.icon}</p>
                  <p className="text-[9px] font-black text-text-dim uppercase tracking-wide leading-tight">{b.name}</p>
                  <p className={`text-xs font-black font-mono ${b.isSafe ? 'text-emerald-400' : 'text-brand-danger'}`}>{b.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 단어 수별 강도 */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-3">단어 수별 예상 강도</p>
        <div className="grid grid-cols-3 gap-3">
          {data.strengthByWordCount.map((s, i) => {
            const g = s.grade.split('~')[0];
            const gc2 = GRADE_COLOR[g] || GRADE_COLOR.A;
            return (
              <div key={i} className={`p-4 rounded-2xl border ${gc2.bg} ${gc2.border} text-center space-y-1`}>
                <p className="text-2xl font-black font-mono text-text-bright">{s.words}<span className="text-sm ml-1">개</span></p>
                <p className={`text-xs font-black font-mono ${gc2.text}`}>{s.exampleBits} bits</p>
                <p className={`text-[9px] font-black ${gc2.text}`}>{s.grade}등급</p>
                <p className="text-[9px] text-text-dim">{s.verdict}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 해커 인용구 */}
      <InsightFooter
        accent="danger"
        icon={<AlertTriangle size={28} />}
        label="Hacker's Perspective"
        title="분석 불가능한 문자열"
        body={data.hackerQuote.text}
        extra={<p className="text-[10px] text-text-dim italic mt-1">{data.hackerQuote.source}</p>}
        bgIcon={<Keyboard size={180} />}
      />
    </div>
  );
}