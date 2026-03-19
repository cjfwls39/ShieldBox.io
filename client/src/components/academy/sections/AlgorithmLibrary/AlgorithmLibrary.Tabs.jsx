import React from 'react';
import { SpectrumBar } from '../../ui';
import { ALGO_SPECTRUM } from '../../styles';

export default function AlgorithmLibraryTabs({ algorithms, selectedId, onSelect }) {
  const algoList    = Object.values(algorithms);
  const current     = algorithms[selectedId];
  const currentTier = current.tier;

  return (
    <div className="shrink-0 px-6 pt-4 space-y-3">

      {/* 탭 */}
      <div className="flex gap-2 flex-wrap">
        {algoList.map((algo) => {
          const isActive = algo.id === selectedId;
          return (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              className={`relative px-5 py-2.5 rounded-xl border-2 font-black text-xs tracking-widest uppercase transition-all ${
                isActive
                  ? `${algo.bgLight} border-current ${algo.visualTheme} shadow-md`
                  : 'bg-bg-input border-border-subtle text-text-dim hover:border-brand-primary/40 hover:text-text-bright transition-colors'
              }`}
            >
              <span className="relative z-10">{algo.name}</span>
            </button>
          );
        })}
      </div>

      {/* 스펙트럼 바 */}
      <SpectrumBar
        spectrum={ALGO_SPECTRUM}
        currentTier={currentTier}
        leftLabel="Security Tier"
        rightLabel="STRONGEST"
      />

    </div>
  );
}