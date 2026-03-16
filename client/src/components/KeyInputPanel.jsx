import React from 'react';
import { Lock } from 'lucide-react';

/**
 * KeyInputPanel Component
 * @param {string} pw - 현재 입력된 비밀번호
 * @param {function} setPw - 비밀번호 변경 함수
 * @param {boolean} isShielded - 해싱/공격 진행 여부 (입력 잠금용)
 * @param {function} onGenerate - 무작위 비밀번호 생성 함수
 */
const KeyInputPanel = ({ pw, setPw, isShielded, onGenerate }) => {
  return (
    /* 원본 폼 디자인 유지: bg-bg-card, border-border-subtle, rounded-2xl */
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 shadow-sm shrink-0">
      
      {/* 1. 상단 헤더 및 생성 버튼 섹션 */}
      <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase text-text-dim">
        <span className="flex items-center gap-2 font-mono text-xs">
          <Lock size={12} className="text-brand-primary" /> Key Registry
        </span>
        
        {/* 원본 로직: 보호 모드가 아닐 때만 생성 버튼 노출 */}
        {!isShielded && (
          <div className="flex gap-1.5">
            {[8, 16, 32].map(l => (
              <button 
                key={l} 
                onClick={() => onGenerate(l)} 
                className="px-2.5 py-1 rounded-lg border border-border-subtle hover:text-brand-primary hover:border-brand-primary transition-all text-[10px] font-bold font-mono"
              >
                {l}L 생성
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 메인 입력 필드 (원본 스타일 적용) */}
      <input 
        disabled={isShielded} 
        className="w-full bg-bg-input border-2 border-border-subtle rounded-xl p-4 text-lg font-mono text-text-bright outline-none focus:border-brand-primary transition-colors disabled:opacity-50" 
        value={pw} 
        onChange={e => {
          setPw(e.target.value);
          // 팁: 여기서 setIsGenerated(false) 등의 부가 로직은 훅 내부에서 처리하도록 설계되었습니다.
        }} 
        placeholder="Secret Key..." 
      />
    </div>
  );
};

export default KeyInputPanel;