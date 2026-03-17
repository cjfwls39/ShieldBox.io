import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Zap } from 'lucide-react';

import attackData from '../../data/attacksContent.json';
import { BackHeader } from '../../ui';
import { 
  titleXl, 
  oneLinerBlock, 
  categoryBadge, 
  specLabel, 
  scrollArea, 
  cardOuter,
  pageContainer
} from '../../styles';

import AttackVectorsTabs     from './AttackVectors.Tabs';
import AttackVectorsPipeline from './AttackVectors.Pipeline';
import AttackVectorsDetail   from './AttackVectors.Detail';
import AttackVectorsIntro    from './AttackVectors.Intro';

export default function AttackVectors({ onBack }) {
  const [selectedId, setSelectedId] = useState('brute-force');
  const [viewMode, setViewMode]     = useState('INTRO'); // INTRO | ATTACK | HARDWARE

  const attacks  = attackData.attacks;
  const current  = attacks[selectedId];
  const hardware = attackData.hardware;

  // 탭 선택 핸들러
  const handleSelect = (id) => {
    if (id === 'intro') {
      setViewMode('INTRO');
    } else if (id === 'hardware') {
      setViewMode('HARDWARE');
    } else {
      setSelectedId(id);
      setViewMode('ATTACK');
    }
  };

  return (
    <div className={pageContainer}>
      {/* 상단 헤더: ui.jsx의 BackHeader 사용 */}
      <BackHeader onBack={onBack} section="Offensive_Lab" accent="danger" />

      {/* 탭 네비게이션 */}
      <AttackVectorsTabs
        attacks={attacks}
        selectedId={selectedId}
        onSelect={handleSelect}
        viewMode={viewMode}
      />

      <div className="flex-1 min-h-0 px-6 pb-6 pt-4">
        <div className={cardOuter}>
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode + (viewMode === 'ATTACK' ? selectedId : '')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={scrollArea}
            >
              {/* 1. 인트로 모드 */}
              {viewMode === 'INTRO' && (
                <AttackVectorsIntro 
                  data={attackData.intro} 
                  onStart={() => handleSelect('brute-force')} 
                />
              )}

              {/* 2. 하드웨어 모드 (The Arsenal) */}
              {viewMode === 'HARDWARE' && (
                <div className="max-w-6xl mx-auto space-y-16">
                  <header className="space-y-4 border-l-4 border-brand-danger pl-8 text-left">
                    <h2 className="text-5xl font-black italic uppercase text-text-bright tracking-tighter">
                      {hardware.title}
                    </h2>
                    <p className="text-lg text-text-dim max-w-2xl font-medium leading-relaxed break-keep">
                      {hardware.description}
                    </p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(hardware.items).map(([key, item]) => (
                      <div key={key} className="p-10 rounded-[2.5rem] bg-bg-input border-2 border-border-subtle hover:border-brand-danger/40 transition-all group shadow-inner relative overflow-hidden text-left">
                        <div className="mb-8 p-5 w-fit rounded-2xl bg-bg-main text-brand-danger border border-border-subtle shadow-md group-hover:scale-110 transition-transform">
                          {key === 'cpu' ? <Cpu size={36}/> : key === 'gpu' ? <Zap size={36}/> : <Terminal size={36}/>}
                        </div>
                        <h3 className="text-2xl font-black text-text-bright mb-1">{item.name}</h3>
                        <p className="text-[11px] font-black text-brand-danger uppercase tracking-[0.2em] mb-6">{item.label}</p>
                        <p className="text-sm text-text-dim leading-relaxed break-keep font-medium">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 공격 분석 모드 (실제 기법 상세) */}
              {viewMode === 'ATTACK' && (
                <div className="max-w-6xl mx-auto">
                  {/* 상단 타이틀 섹션 */}
                  <section className="space-y-5 text-left border-b-2 border-border-subtle pb-10 mb-10">
                    <div className="flex items-start justify-between gap-8">
                      <div className="space-y-3 flex-1">
                        <div className={`${categoryBadge.danger} inline-flex`}>
                          {current.category}
                        </div>
                        <h2 className={titleXl}>{current.name}</h2>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <p className={specLabel}>Attack Spec</p>
                        <p className="text-xs font-black text-brand-danger font-mono tracking-tight">
                          {current.physics}
                        </p>
                      </div>
                    </div>
                    <div className={oneLinerBlock.danger}>
                      <p className="text-lg font-black text-text-bright italic leading-tight">
                        "{current.oneLiner}"
                      </p>
                      {/* JSON 데이터에 mechanism이 있을 경우 노출 */}
                      {current.mechanism && (
                        <p className="text-sm text-text-base font-medium mt-3 leading-relaxed break-keep">
                          {current.mechanism}
                        </p>
                      )}
                    </div>
                  </section>

                  {/* 파이프라인 섹션: 시뮬레이터가 포함됨 */}
                  <AttackVectorsPipeline 
                    current={current} 
                    selectedId={selectedId} 
                  />

                  {/* 상세 정보 섹션 */}
                  <AttackVectorsDetail current={current} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}