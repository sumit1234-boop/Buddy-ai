
import React, { useState } from 'react';

interface Props {
  type: string;
  data: any;
  sources?: any[];
}

const SkillRenderer: React.FC<Props> = ({ type, data, sources }) => {
  // --- Plan Architect Skill ---
  if (type === 'plan' && data?.steps) {
    const [checked, setChecked] = useState<Record<number, boolean>>({});

    return (
      <div className="mt-6 p-8 bg-slate-950 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-600/20">🗓️</div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">{data.title}</h3>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Plan Matrix</p>
          </div>
        </div>

        <div className="space-y-3">
          {data.steps.map((step: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-4 ${
                checked[idx] 
                  ? 'bg-indigo-600/10 border-indigo-500/30 opacity-60' 
                  : 'bg-slate-900 border-white/5 hover:border-indigo-500/20'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                checked[idx] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-700 group-hover:border-indigo-500/50'
              }`}>
                {checked[idx] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`text-sm font-bold tracking-tight ${checked[idx] ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {step.task}
                  </h4>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    step.importance === 'high' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    step.importance === 'med' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-slate-500/10 border-slate-500/20 text-slate-500'
                  }`}>
                    {step.importance}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${checked[idx] ? 'text-slate-600' : 'text-slate-400'}`}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Execution Ready
            </span>
          </div>
          <p className="text-[10px] font-black text-indigo-400">
            {Object.values(checked).filter(Boolean).length} / {data.steps.length} Milestones Reached
          </p>
        </div>
      </div>
    );
  }

  // --- QR Code Skill ---
  if (type === 'qr' && data?.url) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data.url)}&color=6366f1&bgcolor=0f172a`;
    return (
      <div className="mt-4 p-6 bg-slate-950 rounded-[2rem] border border-indigo-500/20 flex flex-col items-center gap-4 animate-in zoom-in duration-500 shadow-2xl shadow-indigo-500/10">
        <div className="bg-white p-3 rounded-2xl shadow-2xl">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Neural QR Synthesis</p>
          <p className="text-xs text-slate-500 font-mono truncate max-w-[240px]">{data.url}</p>
        </div>
        <a 
          href={qrUrl} 
          target="_blank"
          rel="noreferrer"
          className="bg-indigo-600/10 text-indigo-400 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
        >
          View Full Image
        </a>
      </div>
    );
  }

  // --- Visual Art Skill ---
  if (type === 'image' && data?.base64) {
    const imageUrl = `data:${data.mime || 'image/png'};base64,${data.base64}`;
    return (
      <div className="mt-4 animate-in zoom-in duration-500 group relative">
        <img src={imageUrl} alt="AI Art" className="rounded-3xl border border-white/5 shadow-2xl max-w-full" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-3xl">
           <a href={imageUrl} download="buddy_creation.png" className="bg-white text-slate-950 px-6 py-2 rounded-full font-bold text-xs">Download Artwork</a>
        </div>
      </div>
    );
  }

  // --- Neural Grounding (Search & Maps) ---
  if (sources && sources.length > 0) {
    return (
      <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">External Knowledge Discovered</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sources.map((chunk, i) => {
            const url = chunk.web?.uri || chunk.maps?.uri;
            const title = chunk.web?.title || chunk.maps?.title || "Neural Citation";
            const isMap = !!chunk.maps;
            if (!url) return null;
            return (
              <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-950/40 border border-white/5 p-3 rounded-2xl flex items-center gap-3 hover:bg-indigo-600/10 hover:border-indigo-500/20 transition-all group overflow-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-sm shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                  {isMap ? '📍' : '🌐'}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-200 truncate">{title}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter truncate opacity-60">
                    {new URL(url).hostname}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default SkillRenderer;
