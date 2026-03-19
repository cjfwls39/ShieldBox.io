import React from 'react';
import { Info, Cpu } from 'lucide-react';
import { SpectrumBar } from '../../ui';
import { ATTACK_SPECTRUM } from '../../styles';

export default function AttackVectorsTabs({ attacks, selectedId, onSelect, viewMode }) {
  const attackList  = Object.values(attacks);
  const current     = attacks[selectedId];
  const currentTier = viewMode === 'ATTACK' ? current?.tier : null;

  const tabCls = (isActive) =>
    `relative px-4 py-2.5 rounded-xl border-2 transition-all flex-1 min-w-[120px] group flex items-center justify-center gap-2 ${
      isActive
        ? 'bg-brand-danger border-brand-danger shadow-md scale-[1.02] z-10'
        : 'bg-bg-input border-border-subtle hover:border-brand-danger/40 transition-colors'
    }`;

  const labelCls = (isActive) =>
    `text-[10px] font-black italic tracking-tight uppercase transition-colors whitespace-nowrap ${
      isActive ? 'text-white' : 'text-text-dim group-hover:text-brand-danger'
    }`;

  return (
    <div className="shrink-0 px-6 pt-4 space-y-4">

      {/* 탭 */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onSelect('intro')} className={`${tabCls(viewMode === 'INTRO')} max-w-[140px]`}>
          <Info size={14} className={viewMode === 'INTRO' ? 'text-white' : 'text-text-dim group-hover:text-brand-danger'} />
          <span className={labelCls(viewMode === 'INTRO')}>Overview</span>
        </button>

        {attackList.map((attack) => {
          const isActive = viewMode === 'ATTACK' && attack.id === selectedId;
          return (
            <button key={attack.id} onClick={() => onSelect(attack.id)} className={tabCls(isActive)}>
              <span className={labelCls(isActive)}>{attack.id.replace(/-/g, ' ').toUpperCase()}</span>
            </button>
          );
        })}

        <button onClick={() => onSelect('hardware')} className={`${tabCls(viewMode === 'HARDWARE')} max-w-[140px]`}>
          <Cpu size={14} className={viewMode === 'HARDWARE' ? 'text-white' : 'text-text-dim group-hover:text-brand-danger'} />
          <span className={labelCls(viewMode === 'HARDWARE')}>The Arsenal</span>
        </button>
      </div>

      {/* 스펙트럼 바 */}
      <SpectrumBar
        spectrum={ATTACK_SPECTRUM}
        currentTier={currentTier}
        leftLabel="Lethality Tier"
        rightLabel="Deadliest"
      />

    </div>
  );
}