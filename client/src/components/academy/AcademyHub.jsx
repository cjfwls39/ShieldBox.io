import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, Target, Activity, History, 
  ArrowRight, Sparkles, Lightbulb, ShieldAlert 
} from 'lucide-react';

// 1. 교육 섹션 컴포넌트 임포트
import AlgorithmLibrary from './sections/AlgorithmLibrary';

// 2. 아카데미 메인 데이터 (모듈 구조)
const ACADEMY_MODULES = [
  {
    id: 'algorithms',
    title: 'ALGORITHM LIBRARY',
    desc: '암호화 알고리즘의 물리적 장벽 분석: 복잡한 특수문자보다 중요한 것은 알고리즘의 선택입니다.',
    icon: <Binary size={28} />,
    tags: ['MD5', 'SHA-256', 'Argon2id'],
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/10'
  },
  {
    id: 'attacks',
    title: 'ATTACK VECTORS',
    desc: '습관의 사냥꾼: 해커는 당신의 뇌를 해킹합니다. 인간의 심리적 패턴이 어떻게 치명적인 빈틈이 되는지 목격하십시오.',
    icon: <Target size={28} />,
    tags: ['Human-Pattern', 'Mask-Attack'],
    colorClass: 'text-brand-danger',
    bgClass: 'bg-brand-danger/10'
  },
  {
    id: 'metrics',
    title: 'METRICS LOGIC',
    desc: '데이터의 실체: 엔트로피 점수와 리포트의 수치들이 증명하는 수학적 확신을 해석합니다.',
    icon: <Activity size={28} />,
    tags: ['Probability', 'Bit-Logic'],
    colorClass: 'text-brand-primary',
    bgClass: 'bg-brand-primary/10'
  },
  {
    id: 'scenarios',
    title: 'BREACH SCENARIOS',
    desc: '붕괴의 재구성: 실제 유출 사고를 통해 배우는 연쇄적인 보안 붕괴 시나리오를 탐구합니다.',
    icon: <History size={28} />,
    tags: ['Attack-Chain', 'Case-Study'],
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-400/10'
  }
];

export default function AcademyHub() {
  // 내부 라우팅 상태: 'hub'가 기본이며, 클릭 시 해당 id로 변경됨
  const [activeSection, setActiveSection] = useState('hub');

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <AnimatePresence mode="wait">
        {activeSection === 'hub' ? (
          /* ─── CASE A: 아카데미 메인 허브 (Gateway) ─── */
          <motion.div 
            key="hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto custom-scrollbar py-16 px-8 space-y-20"
          >
            {/* 히어로 섹션 */}
            <header className="text-center space-y-8">
              <div className="font-mono text-[10px] tracking-[0.4em] text-brand-primary opacity-70 uppercase flex items-center justify-center gap-3">
                <div className="h-[1px] w-8 bg-brand-primary/30" />
                Intelligence Protocol Activated
                <div className="h-[1px] w-8 bg-brand-primary/30" />
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black text-text-bright tracking-tighter italic uppercase">
                  Safety is not a habit,<br />
                  it's a <span className="text-brand-primary not-italic text-glow">Design.</span>
                </h2>
                <p className="text-text-dim max-w-2xl mx-auto text-base font-medium leading-relaxed">
                  잦은 비밀번호 변경이 정말 보안에 도움이 될까요? 사람의 인지적 한계는 결국 예측 가능한 패턴을 선택하게 만들고, 해커는 그 타협의 순간을 놓치지 않습니다. 
                  <span className="text-text-bright block mt-2 font-bold">단순한 반복보다 단 한 번의 견고한 설계가 왜 더 강력한지 그 이면의 진실을 탐구하십시오.</span>
                </p>
              </div>
            </header>

            {/* 메인 4대 모듈 그리드 */}
            <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {ACADEMY_MODULES.map((module, idx) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  onClick={() => setActiveSection(module.id)}
                  className="group relative p-12 bg-bg-input border border-border-subtle rounded-[3.5rem] cursor-pointer transition-all hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/5"
                >
                  <div className={`absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${module.colorClass}`}>
                    {React.cloneElement(module.icon, { size: 140 })}
                  </div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${module.bgClass} ${module.colorClass} shadow-inner border border-white/5`}>
                      {module.icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-text-bright italic tracking-tight uppercase group-hover:text-brand-primary transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-sm text-text-dim leading-relaxed font-medium pr-6">{module.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {module.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-bg-main border border-border-subtle rounded-full text-[9px] font-black text-text-dim uppercase tracking-widest">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    <ArrowRight className="text-brand-primary" size={24} />
                  </div>
                </motion.div>
              ))}
            </section>

            {/* 하단 푸터 인사이트 */}
            <footer className="max-w-6xl mx-auto pb-12">
              <div className="relative p-12 bg-brand-primary/5 border border-brand-primary/10 rounded-[3.5rem] overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="p-4 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20"><Lightbulb size={28} className="text-white" /></div>
                  <div className="space-y-4 max-w-3xl">
                    <h4 className="text-xl font-black text-text-bright italic tracking-tight uppercase">The Expiration Paradox: <span className="text-brand-primary not-italic">보안의 역설</span></h4>
                    <p className="text-sm text-text-dim font-medium leading-relaxed">
                      미국 국립표준기술연구소(NIST)는 더 이상 정기적인 암호 변경을 권고하지 않습니다. 잦은 변경은 사용자를 피로하게 만들어 결국 <code className="text-brand-primary font-bold px-1.5 py-0.5 bg-brand-primary/10 rounded">Summer2026!</code> 같은 뻔한 규칙을 만들게 하기 때문입니다. 바꾸는 행위보다 중요한 것은 해커가 예측할 수 없는 <strong>'무작위성'</strong>을 확보하는 것입니다.
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          /* ─── CASE B: 개별 교육 섹션 화면 ─── */
          <motion.div 
            key="section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex-1 p-10 overflow-hidden"
          >
            {/* 1. 알고리즘 도서관 연결 */}
            {activeSection === 'algorithms' && (
              <AlgorithmLibrary onBack={() => setActiveSection('hub')} />
            )}

            {/* 2. 그 외 섹션 (아직 구현 전 Placeholder) */}
            {!['algorithms', 'hub'].includes(activeSection) && (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-bg-input border border-border-subtle flex items-center justify-center text-brand-primary opacity-20">
                  <Sparkles size={40} />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-black text-text-bright italic uppercase tracking-tighter italic">Coming Soon</h3>
                  <p className="text-sm text-text-dim mt-2">"{activeSection.toUpperCase()}" 섹션의 컨텐츠를 정교하게 설계 중입니다.</p>
                </div>
                <button 
                  onClick={() => setActiveSection('hub')}
                  className="px-8 py-3 bg-bg-input border border-border-subtle rounded-2xl text-[11px] font-black text-brand-primary hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest shadow-xl"
                >
                  Return to Hub
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}