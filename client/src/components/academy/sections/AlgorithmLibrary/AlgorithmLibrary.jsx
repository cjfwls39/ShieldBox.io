import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import academyData from '../../data/academyContent.json';
import { BackHeader }             from '../../ui';
import { titleXl, oneLinerBlock, categoryBadge, specLabel, scrollArea, cardOuter } from '../../styles';
import AlgorithmLibraryTabs     from './AlgorithmLibrary.Tabs';
import AlgorithmLibraryPipeline from './AlgorithmLibrary.Pipeline';
import AlgorithmLibraryDetail   from './AlgorithmLibrary.Detail';

export default function AlgorithmLibrary({ onBack }) {
  const [selectedId, setSelectedId]   = useState('md5');
  const [sampleInput, setSampleInput] = useState('ShieldBox_2026');

  const algorithms = academyData.algorithms;
  const current    = algorithms[selectedId];

  return (
    <div className="flex flex-col h-full min-h-0 bg-bg-main text-text-base">

      <BackHeader onBack={onBack} section="Algorithm_Lab" accent="primary" />

      <AlgorithmLibraryTabs
        algorithms={algorithms}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="flex-1 min-h-0 px-6 pb-6 pt-4">
        <div className={cardOuter}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={scrollArea}
            >
              {/* 타이틀 */}
              <section className="space-y-5 text-left border-b-2 border-border-subtle pb-10">
                <div className="flex items-start justify-between gap-8">
                  <div className="space-y-3 flex-1">
                    <div className={`${categoryBadge.primary} ${current.visualTheme}`}>
                      {current.category}
                    </div>
                    <h2 className={titleXl}>{current.name}</h2>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <p className={specLabel}>Physics Spec</p>
                    <p className={`text-xs font-black ${current.visualTheme} font-mono tracking-tight`}>{current.physics}</p>
                  </div>
                </div>
                <div className={oneLinerBlock.primary}>
                  <p className="text-lg font-black text-text-bright italic leading-snug">"{current.oneLiner}"</p>
                  <p className="text-sm text-text-base font-medium leading-relaxed break-keep">{current.fullDesc}</p>
                </div>
              </section>

              <AlgorithmLibraryPipeline
                current={current}
                selectedId={selectedId}
                sampleInput={sampleInput}
                setSampleInput={setSampleInput}
              />

              <AlgorithmLibraryDetail current={current} algorithms={algorithms} />

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}