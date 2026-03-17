import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Binary, Target, Activity, History, 
  ArrowRight, Sparkles, Lightbulb, ShieldAlert 
} from 'lucide-react';

import AlgorithmLibrary from './sections/AlgorithmLibrary/AlgorithmLibrary';
import AttackVectors from './sections/AttackVectors/AttackVectors';

// 1. 아카데미 메인 데이터
const ACADEMY_MODULES = [
  {
    id: 'algorithms',
    title: 'ALGORITHM LIBRARY',
    desc: '암호화 알고리즘의 물리적 장벽 분석: 복잡한 특수문자보다 중요한 것은 알고리즘의 선택입니다.',
    icon: <Binary size={28} />,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/10'
  },
  {
    id: 'attacks',
    title: 'ATTACK VECTORS',
    desc: '습관의 사냥꾼: 해커는 당신의 뇌를 해킹합니다. 인간의 심리적 패턴이 어떻게 치명적인 빈틈이 되는지 목격하십시오.',
    icon: <Target size={28} />,
    colorClass: 'text-brand-danger',
    bgClass: 'bg-brand-danger/10'
  },
  {
    id: 'monitoring',
    title: 'REAL-TIME MONITORING',
    desc: '현재 시스템에서 발생하는 실시간 패스워드 크래킹 시도와 위협 로그를 시각화합니다.',
    icon: <Activity size={28} />,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-400/10'
  },
  {
    id: 'history',
    title: 'CRYPTOGRAPHY HISTORY',
    desc: '고전 암호부터 현대의 양자 암호까지, 인류가 정보를 지키기 위해 싸워온 기록입니다.',
    icon: <History size={28} />,
    colorClass: 'text-purple-400',
    bgClass: 'bg-purple-400/10'
  }
];

export default function AcademyHub() {
  const [activeSection, setActiveSection] = useState('hub');

  return (
    <div className="h-full w-full bg-bg-main overflow-y-auto custom-scrollbar flex flex-col font-sans select-none text-left">
      <AnimatePresence mode="wait">
        {activeSection === 'hub' ? (
          <motion.div 
            key="hub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 px-10 py-12 flex flex-col items-center max-w-7xl mx-auto w-full"
          >
            {/* 상단 헤더 섹션 */}
            <div className="text-center mb-16 space-y-5 shrink-0">
              <div className="flex items-center justify-center gap-3 text-brand-primary font-black text-[10px] tracking-[0.4em] uppercase opacity-70">
                <ShieldAlert size={16} /> Cyber_Security_Academy
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-text-bright italic uppercase tracking-tighter leading-normal">
                Knowledge is <span className="text-brand-primary">Shield</span>
              </h1>
              <p className="text-lg text-text-dim max-w-2xl mx-auto font-medium break-keep leading-relaxed">
                보안은 기술을 넘어선 철학입니다. 암호화의 원리부터 해커의 관점까지, 
                강력한 방어 체계를 구축하기 위한 지식을 탐구하십시오.
              </p>
            </div>

            {/* 모듈 선택 그리드: auto-rows-fr을 사용하여 줄의 높이를 맞춤 */}
            <div className="grid md:grid-cols-2 gap-8 w-full mb-12">
              {ACADEMY_MODULES.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveSection(module.id)}
                  className="group relative p-10 bg-bg-card border-2 border-border-subtle rounded-[2.5rem] hover:border-brand-primary/50 transition-all duration-500 text-left shadow-xl flex flex-col min-h-[320px]"
                >
                  {/* 배경 장식용 아이콘 (절대 위치) */}
                  <div className={`absolute top-0 right-0 p-8 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 ${module.colorClass}`}>
                    {module.icon}
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full w-full">
                    {/* 아이콘 */}
                    <div className={`w-16 h-16 rounded-2xl ${module.bgClass} ${module.colorClass} flex items-center justify-center shadow-md shrink-0 mb-8 transition-transform group-hover:scale-105 border border-white/5`}>
                      {module.icon}
                    </div>
                    
                    {/* 텍스트 영역: 고정 패딩 대신 여백(margin)으로 공간 확보 */}
                    <div className="flex-1 flex flex-col pr-4">
                      <h3 className="text-2xl md:text-3xl font-black text-text-bright italic uppercase tracking-tighter leading-normal mb-4">
                        {module.title}
                      </h3>
                      <p className="text-base text-text-dim leading-relaxed font-medium break-keep opacity-90 mb-12">
                        {module.desc}
                      </p>
                    </div>
                  </div>

                  {/* 하단 화살표 액션 버튼 (우측 하단 고정) */}
                  <div className="absolute bottom-10 right-10 p-3.5 bg-bg-input border border-border-subtle rounded-xl text-text-bright group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                    <ArrowRight size={22} />
                  </div>
                </button>
              ))}
            </div>

            {/* 하단 팁 섹션 */}
            <div className="flex items-center gap-6 p-8 bg-bg-input rounded-3xl border border-border-subtle w-full shadow-inner">
              <div className="p-4 bg-brand-primary/10 rounded-2xl text-brand-primary shrink-0">
                <Lightbulb size={24} />
              </div>
              <p className="text-sm text-text-dim font-medium italic break-keep leading-relaxed">
                <span className="font-black text-text-bright uppercase mr-2 not-italic tracking-tighter text-xs">Academy_Tip:</span> 
                "모든 암호 체계는 깨지기 위해 존재합니다. 관건은 해커가 해독하는 데 드는 비용이 그 가치보다 높게 만드는 것입니다."
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            {/* 세부 섹션 라우팅 */}
            {activeSection === 'algorithms' && (
              <AlgorithmLibrary onBack={() => setActiveSection('hub')} />
            )}
            {activeSection === 'attacks' && (
              <AttackVectors onBack={() => setActiveSection('hub')} />
            )}
            
            {/* 준비 중인 섹션 처리 */}
            {!['algorithms', 'attacks', 'hub'].includes(activeSection) && (
              <div className="h-full flex flex-col items-center justify-center space-y-8 bg-bg-main">
                <div className="w-24 h-24 rounded-3xl bg-bg-input border border-border-subtle flex items-center justify-center text-brand-primary opacity-20">
                  <Sparkles size={48} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black text-text-bright italic uppercase tracking-tighter">Coming Soon</h3>
                  <p className="text-base text-text-dim">"{activeSection.toUpperCase()}" 섹션의 컨텐츠를 정교하게 설계 중입니다.</p>
                </div>
                <button 
                  onClick={() => setActiveSection('hub')}
                  className="px-10 py-4 bg-bg-input border border-border-subtle rounded-2xl text-xs font-black text-brand-primary hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest shadow-xl"
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