
import React from 'react';
import { AppState } from '../types';
import { Link } from 'react-router-dom';
import BuddyFace from '../components/BuddyFace';

interface Props { state: AppState; }

const Home: React.FC<Props> = ({ state }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617] relative">
      {/* Deep Background Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-600/5 blur-[160px] rounded-full pointer-events-none animate-pulse"></div>
      
      <div className="max-w-5xl mx-auto px-8 py-16 space-y-16 relative z-10">
        
        {/* Central Spotlight */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="relative mb-12">
            <div className="absolute inset-[-40%] bg-indigo-500/10 blur-[90px] rounded-full animate-pulse"></div>
            <div className="absolute inset-[-15%] border border-indigo-400/10 rounded-full"></div>
            <BuddyFace size="lg" state="idle" className="relative z-10" />
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center bg-[#0d1425] border border-indigo-400/20 px-6 py-2 rounded-full shadow-2xl">
              <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                Neural Core v4.0 Online
              </span>
            </div>
            
            <h1 className="text-[5rem] font-black text-white leading-[1.1] tracking-tighter">
              Welcome back, <span className="inline-block px-5 py-2 bg-gradient-to-r from-[#818cf8] to-[#c084fc] rounded-sm text-white shadow-[0_0_30px_rgba(129,140,248,0.2)]">{state.settings.name}</span>
            </h1>
            
            <p className="text-slate-400 text-2xl font-semibold leading-relaxed max-w-xl mx-auto opacity-80">
              Ready to collaborate. Memory clusters synchronized and awaiting commands.
            </p>
          </div>
        </div>

        {/* Action Card as per Screenshot */}
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/chat" 
            className="group relative block w-full bg-[#0a0f1e]/40 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/5 transition-all hover:bg-[#0a0f1e]/60 hover:border-indigo-500/20 active:scale-[0.99] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl filter drop-shadow-md">💬</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[2.5rem] font-black text-white tracking-tighter leading-tight">Open Cognitive Interface</p>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mt-1 opacity-70">Start a conversation</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/30 transition-all group-hover:translate-x-2">
                <span className="text-3xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* System Health Status Row */}
        <div className="flex items-center justify-center gap-16">
           <div className="flex items-center gap-3 bg-slate-900/40 px-6 py-2.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Logic: Stable</span>
           </div>
           <div className="flex items-center gap-3 bg-slate-900/40 px-6 py-2.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Grounding: Synced</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
