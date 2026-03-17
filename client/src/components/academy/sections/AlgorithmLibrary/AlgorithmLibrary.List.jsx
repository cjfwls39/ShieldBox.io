import React from 'react';
import { FlaskConical } from 'lucide-react';

export default function AlgorithmLibraryList({ algorithms, selectedId, onSelect }) {
  return (
    <aside className="lg:col-span-3 flex flex-col min-h-0 text-left">
      <div className="flex-1 bg-bg-card rounded-2xl border-2 border-border-subtle p-4 overflow-y-auto custom-scrollbar shadow-xl">
        <h3 className="text-[10px] font-black text-brand-primary tracking-[0.3em] uppercase mb-6 italic flex items-center gap-2 px-2">
          <FlaskConical size={14} /> Registry_List
        </h3>
        <div className="space-y-2">
          {Object.values(algorithms).map((algo) => (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left group ${
                selectedId === algo.id
                  ? 'bg-brand-primary border-brand-primary shadow-lg scale-[1.02]'
                  : 'bg-bg-input border-border-subtle hover:border-brand-primary/40'
              }`}
            >
              <p className={`text-sm font-black italic tracking-tight ${selectedId === algo.id ? 'text-white' : 'text-text-bright'}`}>
                {algo.name}
              </p>
              <p className={`text-[9px] font-bold uppercase tracking-tight mt-0.5 ${selectedId === algo.id ? 'text-white/70' : 'text-text-dim'}`}>
                {algo.category}
              </p>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}