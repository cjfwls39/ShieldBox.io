/**
 * AlgorithmLibrary.Visualizer.jsx
 *
 * [설계 원칙]
 * - isHashing prop 완전 제거. 조건부 animate 분기가 framer-motion repeat 루프를
 *   강제 중단시키는 것이 모든 버그의 근본 원인이었음.
 * - 각 Vis 컴포넌트는 마운트되는 순간부터 무조건 루프 재생.
 * - AnimatePresence(mode="wait")가 알고리즘 전환 시 exit → enter를 처리.
 * - animate에 배열 keyframe만 사용. transition은 repeat:Infinity + ease만.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Memory-Hard 블록 딜레이 — 컴포넌트 외부 상수로 고정
const MEM_DELAYS = Array.from({ length: 40 }, (_, i) => parseFloat(((i * 0.09) % 2.2).toFixed(2)));

// ── 공통 씬 전환 (AnimatePresence용) ────────────────────────────────────
const SCENE = {
  initial:    { opacity: 0, y: 10  },
  animate:    { opacity: 1, y: 0   },
  exit:       { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

// ── MD5: 4개 레지스터 — 순차 파동 부유 ──────────────────────────────────
function MD5Vis() {
  return (
    <motion.div key="md5" {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-5">
        {['A', 'B', 'C', 'D'].map((reg, i) => (
          <motion.div
            key={reg}
            animate={{ y: [0, -16, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 1.4,
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
            className="w-16 h-16 rounded-2xl bg-brand-danger/15 border-2 border-brand-danger/50
                       flex items-center justify-center text-brand-danger font-black text-xl
                       shadow-[0_0_0px_rgba(239,68,68,0)]"
          >
            {reg}
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] font-black text-brand-danger/40 italic tracking-[0.25em] uppercase">
        64-Round Bitwise Transformation
      </p>
    </motion.div>
  );
}

// ── SHA-256: 8개 레지스터 — 좌→우 연쇄 점등 ─────────────────────────────
function SHA256Vis() {
  return (
    <motion.div key="sha256" {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2.5 flex-wrap justify-center">
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((reg, i) => (
          <motion.div
            key={reg}
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.15, 1] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 1.8,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
            className="w-12 h-12 rounded-xl border-2 border-brand-primary/40 bg-brand-primary/10
                       flex items-center justify-center text-brand-primary font-black text-sm"
          >
            {reg}
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] font-black text-brand-primary/40 italic tracking-[0.25em] uppercase">
        64-Round Compression — Σ · Ch · Maj
      </p>
    </motion.div>
  );
}

// ── SHA-512: 8개 레지스터 — 웨이브 스케일 전파 ───────────────────────────
function SHA512Vis() {
  return (
    <motion.div key="sha512" {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="flex gap-2.5 flex-wrap justify-center">
        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((reg, i) => (
          <motion.div
            key={reg}
            animate={{ scale: [1, 1.22, 1], opacity: [0.35, 1, 0.35] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 1.6,
              ease: 'easeInOut',
              delay: i * 0.14,
            }}
            className="w-12 h-12 rounded-xl bg-blue-500/10 border-2 border-blue-500/40
                       flex items-center justify-center text-blue-400 font-black text-sm"
          >
            {reg}
          </motion.div>
        ))}
      </div>
      <p className="text-[10px] font-black text-blue-400/40 italic tracking-[0.25em] uppercase">
        80-Round · 64-bit Word · High-Spec Core
      </p>
    </motion.div>
  );
}

// ── Bcrypt: 아이콘 자전 + 링 방사 확산 ───────────────────────────────────
function BcryptVis() {
  return (
    <motion.div key="bcrypt" {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* 방사 링 3겹 — 순차 지연으로 물결처럼 퍼짐 */}
        {[0, 1, 2].map((n) => (
          <motion.span
            key={n}
            animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2.4,
              ease: 'easeOut',
              delay: n * 0.7,
            }}
            className="absolute w-16 h-16 rounded-full border-2 border-purple-400/50 block"
          />
        ))}
        {/* 중앙 아이콘 자전 — [0, 360] 배열로 순간이동 없는 연속 회전 */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 3.0,
            ease: 'linear',
          }}
          className="relative z-10 p-4 bg-purple-500/15 border-2 border-purple-500/40 rounded-full"
        >
          <RefreshCw size={40} className="text-purple-400" />
        </motion.div>
      </div>
      <p className="text-[10px] font-black text-purple-400/40 italic tracking-[0.25em] uppercase">
        Adaptive Key Stretching — 2^Cost Rounds
      </p>
    </motion.div>
  );
}

// ── Memory-Hard (Scrypt / Argon2id): RAM 블록 순차 점멸 ──────────────────
function MemHardVis() {
  return (
    <motion.div key="mem" {...SCENE} className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-md grid grid-cols-8 gap-1.5">
        {MEM_DELAYS.map((delay, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.1, 0.85, 0.1], scaleY: [1, 1.3, 1] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 1.8,
              ease: 'easeInOut',
              delay,
            }}
            style={{ originY: 1 }}
            className="h-7 bg-emerald-500/70 rounded"
          />
        ))}
      </div>
      <p className="text-[10px] font-black text-emerald-400/40 italic tracking-[0.25em] uppercase">
        Sequential RAM Allocation — Memory-Hard Mixing
      </p>
    </motion.div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────
export default function AlgorithmLibraryVisualizer({ selectedId }) {
  return (
    <div className="relative w-full min-h-[200px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {selectedId === 'md5'                                   && <MD5Vis     />}
        {selectedId === 'sha256'                                && <SHA256Vis  />}
        {selectedId === 'sha512'                                && <SHA512Vis  />}
        {selectedId === 'bcrypt'                                && <BcryptVis  />}
        {(selectedId === 'scrypt' || selectedId === 'argon2id') && <MemHardVis />}
      </AnimatePresence>
    </div>
  );
}