import React from 'react';
import { 
  History, Zap, Sword, ShieldAlert, CheckCircle2, XCircle, 
  Clock, Shield, AlertTriangle, Cpu, Terminal, Gauge, 
  Eye, Wrench, BarChart3
} from 'lucide-react';
import { PhaseHeader, InsightFooter, BodyText } from '../../ui';
import { VERDICT_STYLE } from '../../styles';

// ── timeToBreach 위험도 판별 ────────────────────────────────────────
function getDanger(value) {
  const s = value.toLowerCase();
  if (s.includes('불가능') || s.includes('파훼 불가') || s.includes('3,000년') || s.includes('침투 실패') || s.includes('어려움'))
    return 'safe';
  if (s.includes('즉시') || s.includes('0.001') || s.includes('1초 미만') || s.includes('수 초') || s.includes('이미 파쇄'))
    return 'critical';
  if (s.includes('수 분') || s.includes('1시간') || s.includes('수 시간') || s.includes('수 일') || s.includes('1~2일'))
    return 'high';
  return 'medium';
}

const DANGER_STYLE = {
  critical: { row: 'border-brand-danger/40 bg-brand-danger/5',   badge: 'bg-brand-danger/15 text-brand-danger border-brand-danger/30',   icon: <AlertTriangle size={14} className="text-brand-danger shrink-0" />,  label: 'CRITICAL' },
  high:     { row: 'border-amber-400/40 bg-amber-400/5',         badge: 'bg-amber-400/15 text-amber-400 border-amber-400/30',             icon: <AlertTriangle size={14} className="text-amber-400 shrink-0" />,    label: 'HIGH'     },
  medium:   { row: 'border-brand-primary/30 bg-brand-primary/5', badge: 'bg-brand-primary/10 text-brand-primary border-brand-primary/30', icon: <Clock size={14} className="text-brand-primary shrink-0" />,        label: 'MEDIUM'   },
  safe:     { row: 'border-emerald-500/30 bg-emerald-500/5',     badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',       icon: <Shield size={14} className="text-emerald-500 shrink-0" />,         label: 'SAFE'     },
};

function parseBreachRow(value) {
  const colonIdx = value.indexOf(':');
  if (colonIdx === -1) return { condition: value, time: '' };
  return { condition: value.slice(0, colonIdx).trim(), time: value.slice(colonIdx + 1).trim() };
}

// ── 하드웨어 아이콘 매핑 ────────────────────────────────────────────
const HW_ICON = {
  cpu:  { icon: <Cpu size={14} />,      label: 'CPU',  color: 'bg-brand-primary/10 text-brand-primary border-brand-primary/30' },
  gpu:  { icon: <Zap size={14} />,      label: 'GPU',  color: 'bg-amber-400/10 text-amber-400 border-amber-400/30'             },
  asic: { icon: <Terminal size={14} />, label: 'ASIC', color: 'bg-brand-danger/10 text-brand-danger border-brand-danger/30'   },
};

export default function AttackVectorsDetail({ current }) {
  const style        = VERDICT_STYLE[current.usageGuide?.verdict] || VERDICT_STYLE.CONDITIONAL;
  const checks       = current.usageGuide?.checks || [];
  const probabilityWidth = { 1: '20%', 2: '40%', 3: '60%', 4: '80%', 5: '95%' }[current.tier] || '50%';
  const insightTitle = current.hackerAction?.title || '해커의 전략과 경제성';
  const breachEntries = current.timeToBreach ? Object.entries(current.timeToBreach) : [];

  return (
    <div className="space-y-0">

      {/* ── 1. Origin ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 text-left">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-bg-input rounded-xl border border-border-subtle text-text-dim shadow-inner">
            <History size={20} />
          </div>
          <h3 className="text-[10px] font-black text-text-dim tracking-[0.3em] uppercase italic">
            Attack_Origin_History
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 좌측 — 기원 텍스트 */}
          <p className="text-xl font-black text-text-bright leading-snug break-keep italic">
            {current.origin}
          </p>
          {/* 우측 — 메타포 카드 */}
          {current.metaphorTitle && (
            <div className="p-8 bg-bg-input rounded-2xl border-2 border-border-subtle shadow-inner flex items-start gap-5">
              <div className={`p-4 rounded-xl ${current.bgLight} ${current.visualTheme} border border-border-subtle/50 shrink-0 shadow-md`}>
                <Sword size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-danger opacity-70">
                  Attack Metaphor
                </p>
                <p className="text-base font-black text-text-bright italic leading-snug">
                  "{current.metaphorDesc}"
                </p>
                <p className="text-[10px] font-black text-text-dim uppercase tracking-widest opacity-60">
                  — {current.metaphorTitle}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 2. Time to Breach ─────────────────────────────────────── */}
      {breachEntries.length > 0 && (
        <section className="py-24 border-t-2 border-border-subtle text-left">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-bg-input rounded-xl border border-border-subtle text-text-dim shadow-inner">
              <Clock size={20} />
            </div>
            <h3 className="text-[10px] font-black text-text-dim tracking-[0.3em] uppercase italic">
              Time_To_Breach
            </h3>
          </div>
          <div className="space-y-3">
            {breachEntries.map(([key, value]) => {
              const danger = getDanger(value);
              const ds     = DANGER_STYLE[danger];
              const parsed = parseBreachRow(value);
              return (
                <div key={key} className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-colors ${ds.row}`}>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shrink-0 ${ds.badge}`}>
                    {ds.icon} {ds.label}
                  </div>
                  <span className="text-sm font-black text-text-bright shrink-0 min-w-[180px]">
                    {parsed.condition}
                  </span>
                  <div className="flex-1 h-px bg-border-subtle/40" />
                  <span className="text-sm font-bold text-text-dim text-right shrink-0 max-w-[280px]">
                    {parsed.time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 3. Lethality Assessment ───────────────────────────────── */}
      <section className="py-24 border-t-2 border-border-subtle text-left space-y-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-danger/10 rounded-xl border border-brand-danger/20 text-brand-danger shadow-sm">
            <ShieldAlert size={20} />
          </div>
          <h3 className="text-[10px] font-black text-brand-danger tracking-[0.3em] uppercase italic">
            Lethality_Assessment
          </h3>
        </div>

        {/* attackSpec 스탯 카드 + hackerTools + mainHardware */}
        {current.attackSpec && (
          <div className="grid md:grid-cols-12 gap-6">
            {/* 스탯 3개 */}
            <div className="md:col-span-7 grid grid-cols-3 gap-4">
              {[
                { icon: <BarChart3 size={16} />, label: '공격 효율',   value: current.attackSpec.efficiency     },
                { icon: <Gauge size={16} />,     label: '필요 자원',   value: current.attackSpec.resource       },
                { icon: <Eye size={16} />,       label: '탐지 가능성', value: current.attackSpec.detectability  },
              ].map((stat) => (
                <div key={stat.label} className="p-5 bg-bg-input rounded-2xl border border-border-subtle text-left space-y-3">
                  <div className="flex items-center gap-2 text-brand-danger">
                    {stat.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-dim">{stat.label}</span>
                  </div>
                  <p className="text-xs font-bold text-text-base leading-snug">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* 툴 + 하드웨어 */}
            <div className="md:col-span-5 space-y-4">
              {/* hackerTools */}
              {current.hackerTools?.length > 0 && (
                <div className="p-5 bg-bg-input rounded-2xl border border-border-subtle space-y-3">
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-brand-danger" />
                    <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">Hacker Tools</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.hackerTools.map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-[10px] font-black text-brand-danger uppercase tracking-tight">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* mainHardware */}
              {current.mainHardware?.length > 0 && (
                <div className="p-5 bg-bg-input rounded-2xl border border-border-subtle space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-brand-danger" />
                    <span className="text-[9px] font-black text-text-dim uppercase tracking-widest">Required Hardware</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {current.mainHardware.map((hw) => {
                      const h = HW_ICON[hw];
                      if (!h) return null;
                      return (
                        <span key={hw} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${h.color}`}>
                          {h.icon} {h.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 판정 + 체크리스트 */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-stretch">
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
                <div className={`h-full transition-all duration-1000 ${style.bg.replace('/10', '')}`} style={{ width: probabilityWidth }} />
              </div>
              <p className="text-[9px] font-black text-text-dim opacity-40 text-right">{probabilityWidth}</p>
            </div>
          </div>
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

      {/* ── 4. Hacker's Insight ───────────────────────────────────── */}
      <InsightFooter
        accent="danger"
        icon={<Sword size={36} />}
        label="Hacker's_Perspective"
        title={insightTitle}
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