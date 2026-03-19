import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { BackHeader } from '../../ui';
import scenarioData from '../../data/scenarios.json';

// 하위 연출 컴포넌트 임포트 (뼈대 파일들이 이미 해당 폴더에 있다고 가정)
import ScenarioScene from './ScenarioLab.Scene';
import ScenarioSummary from './ScenarioLab.Summary';
import ScenarioCaseStudy from './Scenariolab.casestudy';
import ScenarioSimulationStep from './Scenariolab.simulationstep';
import ScenarioUltimateDefense from './Scenariolab.ultimatedefense';

/**
 * ScenarioLab Component
 * 아카데미 제3섹션: 솔트, 페퍼, 그리고 실전 사례 시뮬레이션
 */
export default function ScenarioLab({ onBack }) {
  // 현재 진행 중인 장면의 인덱스 상태
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  
  const scenes = scenarioData.scenes;
  const currentScene = scenes[currentSceneIdx];

  // 내비게이션: 다음 장면
  const nextScene = () => {
    if (currentSceneIdx < scenes.length - 1) {
      setCurrentSceneIdx(prev => prev + 1);
    }
  };

  // 내비게이션: 이전 장면
  const prevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-bg-main text-text-base">
      {/* 아카데미 표준 헤더 유지 */}
      <BackHeader 
        onBack={onBack} 
        section="Scenario_Lab" 
        accent="primary" 
      />

      <div className="flex-1 min-h-0 px-6 pb-6 pt-4">
        <div className="h-full bg-bg-card rounded-2xl border-2 border-border-subtle overflow-hidden shadow-xl relative flex flex-col">
          
          {/* 장면 렌더링 영역 (framer-motion 슬라이드 효과) */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col p-8 md:p-12 overflow-y-auto custom-scrollbar"
              >
                {/* [타입 분기] 씬 타입에 따라 전용 컴포넌트로 라우팅 */}
                {currentScene.type === 'ULTIMATE_FORMULA' ? (
                  <ScenarioSummary scene={currentScene} />
                ) : currentScene.type === 'CASE_STUDY_START' ? (
                  <ScenarioCaseStudy scene={currentScene} />
                ) : currentScene.type === 'SIMULATION_STEP' ? (
                  <ScenarioSimulationStep scene={currentScene} />
                ) : currentScene.type === 'ULTIMATE_DEFENSE' ? (
                  <ScenarioUltimateDefense scene={currentScene} />
                ) : (
                  <ScenarioScene scene={currentScene} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 하단 타임라인 컨트롤 바 */}
          <footer className="px-6 py-4 bg-bg-input border-t border-border-subtle flex justify-between items-center shrink-0 gap-4">
            {/* 왼쪽: 카운터 + 클릭 가능한 점 네비 */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0">
                <span className="text-[9px] font-black font-mono text-brand-primary uppercase tracking-[0.2em] block">
                  Timeline
                </span>
                <span className="text-[11px] text-text-bright font-black font-mono">
                  {String(currentSceneIdx + 1).padStart(2, '0')}
                  <span className="text-text-dim font-normal"> / {String(scenes.length).padStart(2, '0')}</span>
                </span>
              </div>

              {/* 클릭 가능한 세그먼트 */}
              <div className="flex gap-1.5 items-center">
                {scenes.map((scene, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSceneIdx(i)}
                    title={scene.episode || scene.title}
                    className={`h-1.5 rounded-full transition-all duration-400 hover:opacity-100 ${
                      i === currentSceneIdx
                        ? 'w-10 bg-brand-primary opacity-100'
                        : i < currentSceneIdx
                          ? 'w-3 bg-brand-primary/50 hover:bg-brand-primary/80 transition-colors'
                          : 'w-3 bg-border-subtle hover:bg-text-dim/30 transition-colors'
                    }`}
                  />
                ))}
              </div>

              {/* 현재 씬 에피소드 레이블 */}
              {currentScene.episode && (
                <span className="hidden md:block text-[9px] font-black font-mono text-text-dim uppercase tracking-widest truncate max-w-[180px]">
                  {currentScene.episode}
                </span>
              )}
            </div>

            {/* 오른쪽: Prev / Next */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={prevScene}
                disabled={currentSceneIdx === 0}
                className="px-4 py-2 rounded-lg text-[10px] font-black text-text-dim hover:text-brand-primary hover:bg-bg-card disabled:opacity-15 transition-all uppercase tracking-widest border border-transparent hover:border-border-subtle"
              >
                ← PREV
              </button>

              <button
                onClick={currentSceneIdx === scenes.length - 1 ? onBack : nextScene}
                className="px-8 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black shadow-lg shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-2"
              >
                {currentSceneIdx === scenes.length - 1 ? (
                  'CLOSE CASE'
                ) : (
                  <> NEXT <ArrowRight size={13}/></>
                )}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}