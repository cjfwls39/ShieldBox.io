import React from 'react';
import { History, Zap, Sword, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { PhaseHeader, InsightFooter, BodyText } from '../../ui';
import { VERDICT_STYLE, section, titleMd } from '../../styles';

export default function AttackVectorsDetail({ current }) {
  const style  = VERDICT_STYLE[current.usageGuide?.verdict] || VERDICT_STYLE.CONDITIONAL;
  const checks = current.usageGuide?.checks || [];

  return (
    <div className="space-y-0">

      {/* 1. Origin */}
      <section className="pt-32 pb-24 text-left">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-bg-input rounded-xl border border-border-subtle text-text-dim shadow-inner">
            <History size={20} />
          </div>
          <h3 className="text-[10px] font-black text-text-dim tracking-[0.3em] uppercase italic">
            Attack_Origin_History
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <p className="text-xl md:text-2xl font-black text-text-bright leading-snug break-keep italic">
              {current.origin}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end">
            <p className="text-xs text-text-dim font-medium leading-relaxed opacity-70">
              * 해당 공격 기법은 기술적 발전에 따라 CPU 연산에서 GPU/ASIC 화력전으로 진화해왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Lethality Assessment */}
      <section className="py-24 border-t-2 border-border-subtle text-left">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-brand-danger/10 rounded-xl border border-brand-danger/20 text-brand-danger shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <h3 className="text-[10px] font-black text-brand-danger tracking-[0.3em] uppercase italic">
            Lethality_Assessment
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-stretch">
          {/* 판정 */}
          <div className={`lg:col-span-4 p-10 rounded-[2.5rem] border-2 shadow-2xl flex flex-col justify-between transition-all ${style.bg} ${style.border}`}>
            <div className="space-y-6">
              <div className={`inline-flex px-4 py-1.5 rounded-full border-2 font-black text-[10px] tracking-widest uppercase ${style.border} ${style.text} bg-bg-card`}>
                {current.usageGuide?.verdict}
              </div>
              <h4 className={`text-4xl font-black italic tracking-tighter leading-none uppercase ${style.text}`}>
                {current.usageGuide?.verdictLabel}
              </h4>
            </div>
            <div className="mt-12 space-y-2">
              <p className="text-[9px] font-black text-text-dim uppercase tracking-widest opacity-60">Success Probability</p>
              <div className="h-1.5 w-full bg-bg-main/50 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${style.bg.replace('/10', '')}`} style={{ width: '75%' }} />
              </div>
            </div>
          </div>
          {/* 체크리스트 */}
          <div className="lg:col-span-6 p-10 bg-bg-input rounded-[2.5rem] border-2 border-border-subtle shadow-inner">
            <div className="space-y-6">
              {checks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-bg-card/40 rounded-2xl border border-border-subtle/50 group hover:border-brand-danger/30 transition-all">
                  {check.ok
                    ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    : <XCircle      size={18} className="text-brand-danger shrink-0 mt-0.5" />
                  }
                  <BodyText className="group-hover:text-text-bright transition-colors">{check.text}</BodyText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Hacker's Insight */}
      <InsightFooter
        accent="danger"
        icon={<Sword size={36} />}
        label="Hacker's_Perspective"
        title="지능적 패턴 사냥과 경제성"
        body={current.hackerContext}
        bgIcon={<Zap size={180} />}
        extra={
          <div className="pt-6 border-t border-border-subtle/50">
            <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] tracking-widest uppercase mb-3">
              <Zap size={14} /> Critical_Defense_Counter
            </div>
            <p className="text-sm text-text-base font-bold leading-relaxed break-keep p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl italic">
              {current.counterStrategy}
            </p>
          </div>
        }
      />
    </div>
  );
}