import React from 'react';
import { Code, Terminal, Database, Cpu, Hash, Box, Fingerprint, FunctionSquare } from 'lucide-react';
import { StepRow, InfoPanel, BodyText } from '../../ui';
import { pipelineLabel, stepSubLabel, titleLg, bodyBase } from '../../styles';
import AlgorithmLibraryVisualizer from './AlgorithmLibrary.Visualizer';

export default function AlgorithmLibraryPipeline({ current, selectedId, sampleInput, setSampleInput }) {
  const p = current.pipeline;

  return (
    <section className="space-y-20">

      {/* 헤더 + 공식 박스 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-subtle pt-12 pb-10 mb-12">
        <div className="space-y-3">
          <div className={pipelineLabel.primary}>
            <Code size={16} /> Integrated_Pipeline_Flow
          </div>
          <h3 className={`${titleLg} text-left`}>디지털 암호 공정 시뮬레이션</h3>
        </div>
        <div className="flex items-center gap-6 px-8 py-5 bg-bg-input border-2 border-brand-primary/30 rounded-[2rem] shadow-inner min-w-[420px]">
          <div className="p-3 bg-brand-primary/10 rounded-xl shrink-0">
            <FunctionSquare size={28} className="text-brand-primary" />
          </div>
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.3em] opacity-90 italic">
              Algorithm Definition Logic
            </span>
            <code className="text-2xl font-mono font-black text-text-bright tracking-tighter italic">
              {current.formula}
            </code>
          </div>
        </div>
      </div>

      {/* Step 01 */}
      <StepRow
        number="01"
        icon={<Terminal size={16} className="text-brand-primary" />}
        title="Phase_01: Raw_Data_Input"
        subLabel={p.step1.desc}
        accent="primary"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <BodyText>{p.step1.detail}</BodyText>
            <div className="p-6 bg-bg-input rounded-2xl border-2 border-brand-primary shadow-inner">
              <label className="text-[10px] font-black text-brand-primary uppercase mb-3 block tracking-widest">Source Data Input</label>
              <input
                type="text"
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                className="w-full bg-transparent border-b-2 border-brand-primary/30 py-1 font-mono text-base text-text-bright outline-none focus:border-brand-primary transition-all font-bold"
              />
            </div>
          </div>
          <div className="p-6 bg-bg-card rounded-2xl border border-border-subtle flex flex-col justify-center shadow-md">
            <label className="text-[10px] font-black text-text-dim uppercase tracking-[0.25em] mb-3">Binary Output (UTF-8)</label>
            <p className="font-mono text-[10px] text-brand-primary break-all leading-relaxed bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/20 opacity-80">
              {sampleInput.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')}
            </p>
          </div>
        </div>
      </StepRow>

      {/* Step 02 */}
      <StepRow
        number="02"
        icon={<Database size={16} className="text-brand-primary" />}
        title="Phase_02: Padding_Logic"
        subLabel={p.step2.desc}
        accent="primary"
      >
        <InfoPanel className="space-y-6">
          <BodyText>{p.step2.detail}</BodyText>
          <div className="space-y-4">
            <h5 className="text-[11px] font-black text-text-bright uppercase flex items-center gap-2 tracking-widest">
              <Box size={14} className="text-brand-primary" /> Block_Padding_Structure
            </h5>
            <div className="flex flex-col gap-3">
              <div className="h-10 w-full bg-brand-primary/10 border border-brand-primary/30 rounded-lg flex items-center px-5 justify-between">
                <span className="text-xs font-black text-text-bright uppercase">Original Message</span>
                <span className="text-sm font-mono text-brand-primary font-black">{sampleInput.length * 8} bits</span>
              </div>
              <div className="flex gap-3 h-10">
                <div className="w-1/4 bg-brand-danger/15 border border-brand-danger/40 rounded-xl flex items-center justify-center text-brand-danger font-black text-[9px] uppercase">1-bit Pad</div>
                <div className="flex-1 bg-bg-card border border-border-subtle rounded-xl flex items-center justify-center text-text-dim font-black text-[9px] uppercase tracking-widest">Zero Filling</div>
                <div className="w-1/3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase">Length Info</div>
              </div>
            </div>
          </div>
        </InfoPanel>
      </StepRow>

      {/* Step 03 */}
      <StepRow
        number="03"
        icon={<Cpu size={16} className="text-brand-primary" />}
        title="Phase_03: Core_Engine"
        subLabel={p.step3.desc}
        accent="primary"
      >
        <InfoPanel className="space-y-8">
          <BodyText>{p.step3.detail}</BodyText>
          <div className="w-full p-8 bg-bg-card rounded-2xl border border-border-subtle shadow-inner">
            <AlgorithmLibraryVisualizer selectedId={selectedId} />
          </div>
        </InfoPanel>
      </StepRow>

      {/* Step 04 */}
      <StepRow
        number="04"
        icon={<Hash size={16} className="text-brand-primary" />}
        title="Phase_04: Final_Digest"
        subLabel={p.step4.desc}
        accent="primary"
        hasLine={false}
        last
      >
        <div className="p-10 bg-bg-card rounded-2xl border-2 border-brand-primary/30 flex flex-col items-center justify-center gap-6 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          <Fingerprint size={52} className="text-brand-primary/60 group-hover:text-brand-primary group-hover:scale-110 transition-all duration-500" />
          <div className="space-y-4 text-center">
            <BodyText variant="dim" className="max-w-md mx-auto">{p.step4.detail}</BodyText>
            <span className="block text-xl md:text-2xl font-mono font-black text-text-bright break-all text-center px-4 leading-tight tracking-tight opacity-70 italic">
              {p.step4.sampleHash || '0x' + Math.random().toString(16).slice(2, 28).toUpperCase()}
            </span>
          </div>
        </div>
      </StepRow>

    </section>
  );
}