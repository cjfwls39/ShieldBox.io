import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Activity, Search, Unlock, Lock, Cpu, 
  Database, User, FileText, Bot, Binary, RefreshCw, Layers 
} from 'lucide-react';

const SCENE = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
  transition: { duration: 0.4, ease: "easeOut" }
};

// ── 1. Brute-Force ──────────────────────────────────────────────────
function BruteForceVis() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#";
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              color: i < 3 ? "#10b981" : "#ef4444",
              borderColor: i < 3 ? "rgba(16,185,129,0.5)" : "rgba(239,68,68,0.5)",
              backgroundColor: i < 3 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.05)",
            }}
            className="w-12 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-3xl font-black bg-black/40 shadow-2xl relative overflow-hidden"
          >
            {i < 3 ? (
              ["S", "H", "I"][i] 
            ) : (
              <motion.span 
                animate={{ y: [-20, 0, 20], opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.1, delay: i * 0.05 }}
              >
                {chars[Math.floor(Math.random() * chars.length)]}
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

// ── 2. Mask Attack ──────────────────────────────────────────────────
function MaskAttackVis() {
  const variableChars = "X7$K9";
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2">
        {["?", "?", "?", "2", "0", "2", "6"].map((char, i) => (
          <div 
            key={i} 
            className={`w-10 h-14 border-2 rounded-lg flex flex-col items-center justify-center font-mono text-2xl font-black ${
              i < 3 ? 'border-brand-danger bg-brand-danger/10 text-brand-danger' : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            <span className="text-[8px] font-black opacity-40 mb-1">{i < 3 ? "POS" : "FIX"}</span>
            {i < 3 ? (
              <motion.span 
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }} 
                transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.1 }}
              >
                {variableChars.charAt(Math.floor(Math.random() * variableChars.length))}
              </motion.span>
            ) : (
              char
            )}
          </div>
        ))}
      </div>
      <div className="text-[10px] font-black text-brand-danger uppercase tracking-[0.2em] flex items-center gap-2">
        <Layers size={12} /> Applied_Mask: [A-Z, 0-9]{"->"}2026
      </div>
    </motion.div>
  );
}

// ── 3. Rainbow Table ────────────────────────────────────────────────
function RainbowVis() {
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-4 w-full max-w-lg px-8">
      <div className="w-full h-32 bg-black/40 rounded-2xl border border-brand-danger/20 flex items-center justify-between px-10 relative">
        {[
          { label: "PLAIN", icon: <FileText size={16}/> },
          { label: "HASH",  icon: <Binary size={16}/> },
          { label: "REDUCE", icon: <RefreshCw size={16} className="animate-spin-slow"/> },
          { label: "FOUND", icon: <Unlock size={16}/> }
        ].map((node, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-2 z-10">
              <motion.div 
                animate={{ borderColor: i === 2 ? "#ef4444" : "rgba(239,68,68,0.2)" }} 
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
          RECOVERY_SUCCESS: {"->"} "admin123"
        </div>
      </div>
      <p className="text-[10px] font-black text-brand-danger uppercase tracking-[0.2em] italic">
        Lookup_In_Precomputed_Rainbow_Chain
      </p>
    </motion.div>
  );
}

// ── 4. Side-Channel ─────────────────────────────────────────────────
function SideChannelVis() {
  return (
    <motion.div {...SCENE} className="w-full max-w-md flex flex-col items-center gap-6">
      <div className="w-full h-32 bg-black/60 rounded-2xl border-2 border-brand-danger/20 relative overflow-hidden flex items-end px-4 pb-4">
        {[...Array(30)].map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ 
              height: i % 8 === 0 ? [30, 90, 30] : [10, 40, 10], 
              backgroundColor: i % 8 === 0 ? "#ef4444" : "#ef444433" 
            }} 
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.02 }} 
            className="w-full mx-[1px] rounded-t-sm shadow-[0_0_10px_#ef444433]" 
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

// ── 5. Dictionary ───────────────────────────────────────────────────
function DictionaryVis() {
  const words = ["password", "123456", "admin", "shadow", "master", "shield"];
  return (
    <motion.div {...SCENE} className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-32 bg-black/40 rounded-2xl border-2 border-brand-danger/20 overflow-hidden">
        <motion.div 
          animate={{ y: [-200, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
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

// ── 6. Credential Stuffing ──────────────────────────────────────────
function BotnetVis() {
  return (
    <motion.div {...SCENE} className="relative w-full min-h-[220px] flex items-center justify-center overflow-hidden">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], borderColor: ["#ef444433", "#ef4444", "#ef444433"] }} 
        transition={{ duration: 1, repeat: Infinity }} 
        className="z-10 w-24 h-24 bg-bg-card border-4 rounded-full flex items-center justify-center text-brand-danger shadow-[0_0_40px_rgba(239,68,68,0.2)]"
      >
         <Lock size={32} />
      </motion.div>
      {[...Array(12)].map((_, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, scale: 0, x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 }} 
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], x: 0, y: 0 }} 
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} 
          className="absolute w-8 h-8 bg-brand-danger/20 border border-brand-danger rounded-lg flex items-center justify-center text-brand-danger"
        >
          <Bot size={16}/>
        </motion.div>
      ))}
      <div className="absolute top-4 left-6 text-[9px] font-black text-brand-danger/60 uppercase tracking-widest">
        Botnet_Auth_Flood_Active
      </div>
    </motion.div>
  );
}

// ── 7. Collision Attack ─────────────────────────────────────────────
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
          animate={{ scale: [0.9, 1.2, 0.9], backgroundColor: ["rgba(239,68,68,0.05)", "rgba(239,68,68,0.2)"] }} 
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

// ── 메인 시각화 엔진 (안전성 대폭 강화) ──────────────────────────────────
export default function AttackVectorsVisualizer({ selectedId }) {
  const renderVisualizer = () => {
    // 혹시 모를 null/undefined 방어 및 소문자 변환
    const id = String(selectedId || '').toLowerCase();

    // 🛠️ 핵심 변경: 정확한 이름 대신 키워드 포함 여부(includes)로 매칭
    if (id.includes('brute'))   return <BruteForceVis key="brute" />;
    if (id.includes('mask'))    return <MaskAttackVis key="mask" />;
    if (id.includes('rainbow')) return <RainbowVis    key="rainbow" />;
    if (id.includes('side') || id.includes('sca')) return <SideChannelVis key="sca" />;
    if (id.includes('dictionary') || id.includes('dict')) return <DictionaryVis key="dict" />;
    if (id.includes('stuffing') || id.includes('botnet')) return <BotnetVis key="botnet" />;
    if (id.includes('collision')) return <CollisionVis key="collision" />;

    // 매칭되지 않을 경우 나오는 에러 방지용 기본 화면
    return (
      <div className="flex flex-col items-center gap-4 opacity-20">
        <Cpu size={48} className="text-brand-danger animate-pulse" />
        <p className="text-[10px] font-black text-text-dim uppercase tracking-widest">
          Simulation_Ready ({id})
        </p>
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-[220px] flex items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {renderVisualizer()}
      </AnimatePresence>
    </div>
  );
}