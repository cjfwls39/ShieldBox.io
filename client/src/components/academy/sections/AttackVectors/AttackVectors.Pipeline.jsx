import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Target, 
  Database, 
  Activity, 
  Unlock, 
  FunctionSquare 
} from 'lucide-react';

import { StepRow, InfoPanel, BodyText } from '../../ui';
import { pipelineLabel, titleLg } from '../../styles';
import AttackVectorsVisualizer from './AttackVectors.Visualizer';

export default function AttackVectorsPipeline({ current }) {
  // 데이터 안전성 검사
  if (!current?.pipeline) return null;
  const p = current.pipeline;

  return (
    <section className="space-y-20">
      {/* ── 1. 헤더 및 엔진 공식 섹션 ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-subtle pt-12 pb-10 mb-12">
        <div className="space-y-3">
          <div className={pipelineLabel.danger}>
            <Code size={16} /> Integrated_Attack_Engine
          </div>
          <h3 className={`${titleLg} text-left`}>실행 공정 시뮬레이션</h3>
        </div>

        {/* 공격 논리 수식 박스 (Attack Logic) */}
        <div className="flex items-center gap-6 px-8 py-5 bg-bg-input border-2 border-brand-danger/20 rounded-[2rem] shadow-inner group hover:border-brand-danger/40 transition-all min-w-[380px]">
          <div className="p-3 bg-brand-danger/10 rounded-2xl text-brand-danger group-hover:rotate-12 transition-transform shadow-sm">
            <FunctionSquare size={28} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black text-brand-danger uppercase tracking-[0.3em] mb-1">
              Attack Logic
            </span>
            <span className="text-2xl md:text-3xl font-mono font-black text-text-bright tracking-tighter italic opacity-90">
              {current.formula}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. 단계별 실행 프로세스 (StepRow) ── */}
      <div className="space-y-0">
        
        {/* Phase 01: 타겟 분석 (Targeting) */}
        <StepRow
          number="01"
          icon={<Target size={16} className="text-brand-danger" />}
          title={`Phase_01: ${p.step1.title}`}
          subLabel={p.step1.desc}
          accent="danger"
        >
          <InfoPanel>
            <BodyText>{p.step1.detail}</BodyText>
          </InfoPanel>
        </StepRow>

        {/* Phase 02: 공격 준비 (Preparation) */}
        <StepRow
          number="02"
          icon={<Database size={16} className="text-brand-danger" />}
          title={`Phase_02: ${p.step2.title}`}
          subLabel={p.step2.desc}
          accent="danger"
        >
          <InfoPanel>
            <BodyText>{p.step2.detail}</BodyText>
          </InfoPanel>
        </StepRow>

        {/* Phase 03: 공격 실행 (Exhaustion / 핵심 시뮬레이션 단계) */}
        <StepRow
          number="03"
          icon={<Activity size={16} className="text-brand-danger" />}
          title={`Phase_03: ${p.step3.title}`}
          subLabel={p.step3.desc}
          accent="danger"
        >
          <InfoPanel>
            <BodyText className="mb-8">{p.step3.detail}</BodyText>
            
            {/* 🛠️ 시각화 엔진 이식 영역 (current.id 강제 주입) */}
            <div className="w-full p-8 bg-bg-card rounded-2xl border border-border-subtle shadow-inner overflow-hidden min-h-[300px] flex items-center justify-center">
              <AttackVectorsVisualizer selectedId={current.id} />
            </div>
          </InfoPanel>
        </StepRow>

        {/* Phase 04: 최종 결과 (Discovery) */}
        <StepRow
          number="04"
          icon={<Unlock size={16} className="text-brand-danger" />}
          title={`Phase_04: ${p.step4.title}`}
          subLabel={p.step4.desc}
          accent="danger"
          hasLine={false}
          last
        >
          <div className="p-10 bg-bg-card rounded-2xl border-2 border-brand-danger/30 flex flex-col items-center justify-center gap-6 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-danger to-transparent" />
            
            <div className="relative">
              <Unlock size={52} className="text-brand-danger/40 group-hover:text-brand-danger group-hover:scale-110 transition-all duration-500" />
              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-brand-danger/20 blur-xl rounded-full"
              />
            </div>

            <div className="space-y-4 text-center">
              <BodyText variant="dim" className="max-w-md mx-auto italic">
                {p.step4.detail}
              </BodyText>
              
              <div className="inline-block px-6 py-2 bg-brand-danger/10 rounded-full border border-brand-danger/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <span className="text-lg font-mono font-black text-brand-danger uppercase tracking-tighter italic">
                  STATUS: BREACH_SUCCESSFUL
                </span>
              </div>
            </div>
          </div>
        </StepRow>
      </div>
    </section>
  );
}