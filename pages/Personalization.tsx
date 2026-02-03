
import React, { useState } from 'react';
import { UserSettings, Tone } from '../types';
import { db } from '../services/dbService';

interface Props {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

const Personalization: React.FC<Props> = ({ settings, onUpdate }) => {
  const [syncCode, setSyncCode] = useState('');
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, name: e.target.value });
  };

  const handleToneChange = (tone: Tone) => {
    onUpdate({ ...settings, tone });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = settings.interests.includes(interest)
      ? settings.interests.filter(i => i !== interest)
      : [...settings.interests, interest];
    onUpdate({ ...settings, interests: newInterests });
  };

  const handleGenerateSync = () => {
    const code = db.generateSyncCode(settings);
    setSyncCode(code);
    navigator.clipboard.writeText(code);
    alert("Sync Code generated and copied to clipboard!");
  };

  const handleImportSync = () => {
    const imported = db.importSyncCode(syncCode);
    if (imported) {
      onUpdate(imported);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
      setSyncCode('');
    } else {
      alert("Invalid Neural Sync Code. Please check the string and try again.");
    }
  };

  const commonInterests = ['Coding', 'Music', 'Cooking', 'Fitness', 'Art', 'Finance', 'Sci-Fi'];

  return (
    <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-slate-950">
      <div className="max-w-3xl mx-auto py-6 pb-24 space-y-8">
        <header className="space-y-1">
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Customization</p>
          </div>
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight">Configuration</h1>
          <p className="text-slate-400 text-sm font-medium">Refine Buddy's core logic and persona link.</p>
        </header>
        
        <div className="space-y-6">
          {/* Identity Section */}
          <section className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
              <span className="text-lg">👤</span> Identity
            </h2>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Sync Subject Name</label>
              <input 
                type="text" 
                value={settings.name}
                onChange={handleNameChange}
                placeholder="Subject Name..."
                className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-white shadow-inner placeholder:text-slate-800 transition-all"
              />
            </div>
          </section>

          {/* Tone Section */}
          <section className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-4">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
              <span className="text-lg">🗣️</span> Logic Tone
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(Tone).map(t => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex items-center justify-between group ${
                    settings.tone === t 
                      ? 'border-indigo-600 bg-indigo-600/10 text-indigo-400' 
                      : 'border-white/5 bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0">
                    <span className={`text-xs font-black uppercase tracking-tight ${settings.tone === t ? 'text-indigo-300' : 'text-slate-400'}`}>{t}</span>
                    <p className="text-[10px] mt-1 font-medium opacity-60 leading-snug">
                      {t === Tone.FRIENDLY && "Conversational, supportive, and warm logic."}
                      {t === Tone.PROFESSIONAL && "Formal, structured, and efficiency-first logic."}
                      {t === Tone.CONCISE && "Direct, minimal, and high-speed logic."}
                      {t === Tone.ENTHUSIASTIC && "Vibrant, high-energy, and creative logic."}
                    </p>
                  </div>
                  {settings.tone === t && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0 ml-4 animate-in zoom-in duration-300">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Interests Section */}
          <section className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-5">
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
              <span className="text-lg">⭐</span> Preference Nodes
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {commonInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all border ${
                    settings.interests.includes(interest)
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 active:scale-95'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </section>

          {/* Neural Sync Section */}
          <section className="bg-indigo-600/10 backdrop-blur-xl p-8 rounded-[3rem] border border-indigo-500/20 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-all"></div>
            
            <header className="space-y-1 relative z-10">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2">
                <span className="text-lg">🔗</span> Neural Sync
              </h2>
              <p className="text-slate-300 text-xs font-medium leading-relaxed max-w-sm">
                Synchronize your persona across different devices or browsers using a secure manual link code.
              </p>
            </header>

            <div className="space-y-4 relative z-10">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={syncCode}
                  onChange={e => setSyncCode(e.target.value)}
                  placeholder="Paste Neural Sync Code..."
                  className="flex-1 bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 text-xs font-mono focus:ring-2 focus:ring-indigo-600 outline-none text-indigo-300 placeholder:text-slate-800 transition-all"
                />
                <button 
                  onClick={handleImportSync}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Sync
                </button>
              </div>

              {showSyncSuccess && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-[10px] font-bold text-green-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span>✅</span> Link Established. Sync Complete.
                </div>
              )}

              <button 
                onClick={handleGenerateSync}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
              >
                <span>📤</span> Generate & Copy Sync Code
              </button>
            </div>
            
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter text-center pt-2 opacity-50">
              Stored locally for persistence on this device.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Personalization;
