import React from 'react';
import { Layers, Zap, Sword, Info, Cpu, ShieldAlert } from 'lucide-react';
import { PhaseHeader, VerdictPanel, InsightFooter, BodyText } from '../../ui';
import { section, titleMd, bodyBase } from '../../styles';

export default function AlgorithmLibraryDetail({ current, algorithms }) {
  const algoList = algorithms ? Object.values(algorithms) : [];

  return (
    <>
      {/* 1. Origin */}
      <section className={section}>
        <PhaseHeader icon={<Layers size={18} />} label="Phase: Origin" color="primary" />
        <div className="grid md:grid-cols-2 gap-12 mt-10">
          <div className="space-y-6">
            <h4 className={titleMd}>기원과 기술적 본질</h4>
            <BodyText>{current.origin}</BodyText>
            <div className="pt-6 border-t border-border-subtle/30">
              <p className="text-xs text-text-dim italic leading-relaxed break-keep">
                <span className="font-black text-brand-primary not-italic mr-2 uppercase tracking-tighter">Inner Mechanism:</span>
                {current.mechanism}
              </p>
            </div>
          </div>
          <div className="p-10 bg-bg-input rounded-3xl border-2 border-border-subtle flex flex-col justify-center gap-6 shadow-inner">
            <div className="flex items-start gap-5 text-left">
              <div className={`p-4 rounded-xl ${current.bgLight} ${current.visualTheme} border border-border-subtle/50 shrink-0 shadow-md`}>
                <Zap size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-base text-text-bright font-black leading-snug italic">"{current.metaphorDesc}"</p>
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest opacity-70">{current.metaphorTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Conflict */}
      <section className={section}>
        <PhaseHeader icon={<Sword size={18} />} label="Phase: Conflict Area" color="danger" />
        <div className="grid md:grid-cols-12 gap-10 mt-10">
          <div className="md:col-span-7 space-y-4">
            <h4 className={titleMd}>해커의 관점: 취약점 분석</h4>
            <BodyText>{current.hackerContext}</BodyText>
          </div>
          <div className="md:col-span-5 grid grid-rows-2 gap-5">
            <div className="p-8 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex flex-col justify-center shadow-md group hover:border-emerald-500/60 transition-colors text-left">
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black mb-2 uppercase tracking-[0.35em] opacity-80 italic">Defense_Capability</p>
              <p className="text-sm font-bold text-text-base leading-snug">{current.strongAgainst}</p>
            </div>
            <div className="p-8 bg-brand-danger/10 rounded-2xl border border-brand-danger/30 flex flex-col justify-center shadow-md group hover:border-brand-danger/60 transition-colors text-left">
              <p className="text-[10px] text-brand-danger font-black mb-2 uppercase tracking-[0.35em] opacity-80 italic">Critical_Exposure</p>
              <p className="text-sm font-bold text-text-base leading-snug">{current.weakAgainst}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Security Spectrum + Usage Guide */}
      <section className={section}>
        <PhaseHeader icon={<ShieldAlert size={18} />} label="Phase: Security_Spectrum" color="dim" />
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          {/* 강도 비교 바 */}
          <div className="space-y-6">
            <h4 className="text-xl font-black text-text-bright uppercase italic tracking-tight text-left">알고리즘 보안 강도 비교</h4>
            <div className="space-y-2">
              {algoList.map((algo) => {
                const isCurrent = algo.id === current.id;
                const barWidth  = `${(algo.tier / 5) * 100}%`;
                return (
                  <div key={algo.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCurrent ? 'bg-bg-input' : ''}`}>
                    <span className={`text-xs font-black w-20 shrink-0 ${isCurrent ? algo.visualTheme : 'text-text-dim'}`}>
                      {algo.name}
                    </span>
                    <div className="flex-1 h-2.5 bg-border-subtle/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isCurrent ? algo.bgLight.replace('/10', '/60') : 'bg-border-subtle/30'}`}
                        style={{ width: barWidth, filter: isCurrent ? 'brightness(1.5)' : 'none' }}
                      />
                    </div>
                    {isCurrent && (
                      <span className={`text-[9px] font-black uppercase tracking-widest shrink-0 ${algo.visualTheme}`}>
                        ◀ CURRENT SELECTION
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Verdict 체크리스트 */}
          <VerdictPanel usageGuide={current.usageGuide} />
        </div>
      </section>

      {/* 4. Expert Insight */}
      <InsightFooter
        accent="primary"
        icon={<Info size={36} />}
        label="Strategical Intelligence Summary"
        body={current.expertInsight}
        bgIcon={<Cpu size={180} />}
      />
    </>
  );
}