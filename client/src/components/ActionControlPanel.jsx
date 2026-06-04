/**
 * ShieldBox.io - Strategic Action Control Panel (Fully Fixed)
 * [위치] src/components/ActionControlPanel.jsx
 * [수정 사항]
 * 1. 암호화/공격 연산 시 UI 동결 방지를 위한 비동기 로딩 상태 추가
 * 2. 원본의 2단계 Depth UI 및 애니메이션 스타일 100% 보존
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, ChevronRight, Shield, Sword, Sliders, Cpu, RefreshCw // RefreshCw 추가
} from 'lucide-react';
import { 
  ALGORITHMS, ALGO_PARAMS, ATTACK_METHODS, ATTACK_PARAMS, HARDWARE_OPTIONS 
} from '../constants/ShieldBoxConstants';

const ActionControlPanel = ({ engine }) => {
  const {
    pw, config, setConfig, isShielded,
    attackConfig, setAttackConfig, selectedAlgo, setSelectedAlgo,
    selectedAttackMethod, setSelectedAttackMethod, selectedHardware,
    setSelectedHardware, resetEngine, startAttack, startHashing, isHashing
  } = engine;

  // isHashing은 useShieldEngine에서 관리 (브라우저 해싱 진행 중 여부)

  // 특정 알고리즘(Bcrypt, Argon2id, Scrypt)은 설계상 솔트가 필수입니다.
  const isInternalSaltAlgo = ['bcrypt', 'argon2id', 'scrypt'].includes(config.algorithm);

  const genPepper = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const pepper = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setConfig(prev => ({ ...prev, pepperValue: pepper, usePepper: true }));
  };

  // 공격 분석 전용 래퍼 (해싱은 startHashing이 직접 처리)
  const handleAttackAction = (actionFn) => {
    setTimeout(async () => { await actionFn(); }, 50);
  };

  return (
    <div className="flex-1 bg-bg-card border border-border-subtle rounded-[2rem] p-5 shadow-sm flex flex-col gap-5 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!isShielded ? (
          /* --- [1단계: 방어 설정 모드] --- */
          <motion.div key="shield-flow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col h-full">
            <AnimatePresence mode="wait">
              {!selectedAlgo ? (
                /* 알고리즘 목록 선택 */
                <motion.div key="algo-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-2 shrink-0">
                    <Settings size={14} className="text-brand-primary"/>
                    <h3 className="text-xs font-black text-text-bright uppercase tracking-widest font-mono">Defense Config</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {ALGORITHMS.map(algo => (
                      <button 
                        key={algo.id} 
                        onClick={() => { setSelectedAlgo(algo.id); setConfig(prev => ({ ...prev, algorithm: algo.id })); }}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${config.algorithm === algo.id ? `${algo.gradeBorder} ${algo.gradeBg} shadow-md` : 'border-border-subtle bg-bg-input hover:border-border-subtle/60'}`}
                      >
                        <div className={`p-2.5 rounded-xl ${config.algorithm === algo.id ? algo.gradeBg : 'bg-bg-main'}`}>
                          <span className={config.algorithm === algo.id ? algo.gradeColor : 'text-text-dim'}>{algo.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-black font-mono ${config.algorithm === algo.id ? 'text-text-bright' : 'text-text-dim'}`}>{algo.name}</p>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono border ${config.algorithm === algo.id ? `${algo.gradeColor} ${algo.gradeBg} ${algo.gradeBorder}` : 'text-text-dim border-border-subtle'}`}>
                              {algo.grade}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-dim mt-0.5">{algo.category}</p>
                        </div>
                        <ChevronRight size={14} className={config.algorithm === algo.id ? algo.gradeColor : 'text-text-dim'}/>
                      </button>
                    ))}
                  </div>
                  {/* [수정] 클릭 시 로딩 상태 적용 */}
                  <button
                    disabled={isHashing || !pw}
                    onClick={() => startHashing(pw)}
                    className="w-full bg-brand-primary py-3.5 rounded-xl font-black text-white text-xs shrink-0 font-mono tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isHashing ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14}/>}
                    {isHashing ? 'SHIELDING...' : 'INITIATE SHIELDING'}
                  </button>
                </motion.div>
              ) : (
                /* 알고리즘 세부 파라미터 설정 */
                (() => {
                  const algo = ALGORITHMS.find(a => a.id === selectedAlgo);
                  const paramDef = ALGO_PARAMS[selectedAlgo] || { params: [], ranges: {} };
                  return (
                    <motion.div key="algo-detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="flex flex-col gap-4 h-full">
                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={() => setSelectedAlgo(null)} className="p-1.5 rounded-lg hover:bg-bg-input text-text-dim hover:text-text-bright transition-all"><ChevronRight size={16} className="rotate-180"/></button>
                        <div className={`p-2 rounded-xl ${algo?.gradeBg || 'bg-bg-input'}`}><span className={algo?.gradeColor || 'text-brand-primary'}>{algo?.icon}</span></div>
                        <div>
                          <h3 className="text-sm font-black text-text-bright font-mono">{algo?.name}</h3>
                          <span className={`text-[9px] font-bold ${algo?.gradeColor}`}>{algo?.category} · Grade {algo?.grade}</span>
                        </div>
                      </div>

                      <div className={`shrink-0 px-4 py-3 rounded-2xl border ${algo?.gradeBorder} ${algo?.gradeBg}`}>
                        <p className={`text-xs leading-relaxed ${algo?.gradeColor}`}>{algo?.tip}</p>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-5 custom-scrollbar pr-1">
                        {paramDef.params.map(pk => {
                          const r = paramDef.ranges[pk];
                          if (!r) return null;
                          const val = config[pk] ?? r.min;
                          return (
                            <div key={pk} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-text-dim uppercase tracking-wide">{r.label}</label>
                                <span className={`text-sm font-black font-mono px-3 py-1 rounded-xl ${algo?.gradeBg} ${algo?.gradeColor}`}>
                                  {val.toLocaleString()}{r.unit}
                                </span>
                              </div>
                              <input type="range" min={r.min} max={r.max} step={r.step} value={val} onChange={e => setConfig({...config, [pk]: parseInt(e.target.value)})} className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand-primary bg-bg-input"/>
                            </div>
                          );
                        })}

                        <div className="shrink-0 pt-3 border-t border-border-subtle space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-xs font-bold text-text-dim uppercase tracking-wide flex items-center gap-1.5">
                                <span className="text-emerald-400">⬡</span> Salt Protection
                              </label>
                              {isInternalSaltAlgo && (
                                <p className="text-[8px] font-black text-emerald-500 uppercase mt-0.5 tracking-tighter">Algorithm Enforced</p>
                              )}
                            </div>
                            <button
                              disabled={isInternalSaltAlgo}
                              onClick={() => setConfig({ ...config, useSalt: !config.useSalt })}
                              className={`relative w-12 h-7 rounded-full transition-colors duration-200 overflow-hidden ${config.useSalt || isInternalSaltAlgo ? 'bg-emerald-500' : 'bg-border-subtle'} ${isInternalSaltAlgo ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                              <span
                                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                                style={{ left: config.useSalt || isInternalSaltAlgo ? '23px' : '4px' }}
                              />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-bold text-text-dim uppercase tracking-wide flex items-center gap-1.5">
                                <span className="text-brand-primary">⬡</span> Server Pepper
                              </label>
                              <button onClick={genPepper} className="text-[9px] font-black font-mono px-2.5 py-1 rounded-lg border border-brand-primary/40 bg-brand-primary/10 text-brand-primary">GEN</button>
                            </div>
                            <input 
                              type="text" 
                              value={config.pepperValue} 
                              onChange={e => setConfig({ ...config, pepperValue: e.target.value, usePepper: e.target.value.length > 0 })} 
                              placeholder="Pepper Key..." 
                              className="w-full bg-bg-input border border-border-subtle rounded-xl px-3 py-2 text-[11px] font-mono text-text-bright" 
                            />
                          </div>
                        </div>
                      </div>
                      {/* [수정] 클릭 시 로딩 상태 적용 */}
                      <button
                        disabled={isHashing || !pw}
                        onClick={() => startHashing(pw)}
                        className="w-full bg-brand-primary py-3.5 rounded-xl font-black text-white text-xs shrink-0 font-mono tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isHashing ? <RefreshCw size={14} className="animate-spin" /> : <Shield size={14}/>}
                        {isHashing ? 'SHIELDING...' : 'APPLY & SHIELDING'}
                      </button>
                    </motion.div>
                  );
                })()
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* --- [2단계: 공격 시나리오 모드] --- */
          <motion.div key="attack-flow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2">
                { (selectedAttackMethod || selectedHardware) && (
                  <button onClick={() => selectedHardware ? setSelectedHardware(null) : setSelectedAttackMethod(null)} className="p-1.5 rounded-lg hover:bg-bg-input text-text-dim hover:text-text-bright transition-all"><ChevronRight size={16} className="rotate-180"/></button>
                )}
                <Sword size={14} className="text-brand-danger"/>
                <h3 className="text-xs font-black text-brand-danger uppercase tracking-widest font-mono">Attack Scenario</h3>
              </div>
              <button onClick={resetEngine} className="text-xs font-bold text-text-dim hover:text-brand-primary transition-all">Reset</button>
            </div>

            <AnimatePresence mode="wait">
              {!selectedAttackMethod ? (
                /* 공격 기법 리스트 */
                <motion.div key="attack-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {ATTACK_METHODS.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => {
                        setSelectedAttackMethod(m.id);
                        setAttackConfig(prev => ({ ...prev, method: m.id }));
                      }} 
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all border-border-subtle bg-bg-input hover:${m.border} hover:${m.bg}`}
                    >
                      <div className={`p-2.5 rounded-xl bg-bg-main ${m.color}`}>{m.icon}</div>
                      <p className="text-sm font-black font-mono text-text-bright">{m.label}</p>
                      <ChevronRight size={14} className="ml-auto text-text-dim/40"/>
                    </button>
                  ))}
                </motion.div>
              ) : !selectedHardware ? (
                /* 공격 파라미터 조정 */
                (() => {
                  const method = ATTACK_METHODS.find(m => m.id === selectedAttackMethod);
                  const params = ATTACK_PARAMS[selectedAttackMethod] || { params: [], ranges: {} };
                  return (
                    <motion.div key="attack-params" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 flex-1 min-h-0">
                      <div className="flex items-center gap-2 px-1 text-brand-danger">
                        <Sliders size={12}/><p className="text-[11px] font-black font-mono uppercase tracking-widest">Adjust Parameters</p>
                      </div>
                      
                      <div className={`shrink-0 px-4 py-3 rounded-2xl border ${method?.border} ${method?.bg}`}>
                        <p className={`text-xs leading-relaxed ${method?.color}`}>{method?.tip}</p>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
                        {params.params.map(pk => {
                          const p = params.ranges[pk];
                          if (!p) return null;
                          return (
                            <div key={pk} className="space-y-3">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-text-dim uppercase tracking-wider">{p.label}</label>
                                <span className={`text-xs font-black font-mono px-2 py-1 rounded-lg bg-brand-danger/10 text-brand-danger`}>
                                  {(attackConfig[pk] || p.min).toLocaleString()}{p.unit}
                                </span>
                              </div>
                              <input type="range" min={p.min} max={p.max} step={p.step} value={attackConfig[pk] || p.min} onChange={e => setAttackConfig({...attackConfig, [pk]: parseInt(e.target.value)})} className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-brand-danger bg-bg-input"/>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={() => setSelectedHardware(true)} className="w-full bg-brand-danger/10 border-2 border-brand-danger/20 py-3.5 rounded-xl font-black text-brand-danger text-[11px] shrink-0 font-mono tracking-widest flex items-center justify-center gap-2 mt-auto">
                        HARDWARE SELECT <ChevronRight size={14}/>
                      </button>
                    </motion.div>
                  );
                })()
              ) : (
                /* 하드웨어 선택 및 분석 시작 */
                <motion.div key="hw-choice" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 flex-1 min-h-0">
                  <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                    {HARDWARE_OPTIONS.map(hw => (
                      <button 
                        key={hw.id} 
                        onClick={() => setAttackConfig({...attackConfig, hardware: hw.id})} 
                        className={`w-full p-4 rounded-2xl border-2 transition-all ${attackConfig.hardware === hw.id ? 'border-brand-danger bg-brand-danger/5 shadow-md' : 'border-border-subtle bg-bg-input hover:border-brand-danger/20'}`}
                      >
                        <div className="flex items-center gap-4 text-left">
                          <div className={`p-2.5 rounded-xl bg-bg-main ${attackConfig.hardware === hw.id ? 'text-brand-danger' : 'text-text-dim'}`}>
                            {hw.icon}
                          </div>
                          <div>
                            <p className={`text-sm font-black font-mono ${attackConfig.hardware === hw.id ? 'text-text-bright' : 'text-text-dim'}`}>{hw.label}</p>
                            <p className="text-[10px] text-text-dim">{hw.sub}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* [수정] 클릭 시 로딩 상태 적용 */}
                  <button
                    disabled={isHashing}
                    onClick={() => handleAttackAction(startAttack)}
                    className="w-full bg-brand-danger py-3.5 rounded-xl font-black text-white text-xs shrink-0 font-mono tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-danger/20 disabled:opacity-50"
                  >
                    {isHashing ? <RefreshCw size={14} className="animate-spin" /> : <Sword size={14}/>}
                    {isHashing ? 'ANALYZING...' : 'INITIATE ATTACK'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionControlPanel;