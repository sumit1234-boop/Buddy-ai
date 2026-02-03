
import React from 'react';

const Skills: React.FC = () => {
  const skills = [
    { title: "Neural Plan Architect", icon: "🗓️", color: "bg-indigo-600/10", textColor: "text-indigo-400", desc: "Transforms vague goals into high-fidelity actionable roadmaps with progress tracking." },
    { title: "Practical/Technical", icon: "🛠️", color: "bg-amber-500/10", textColor: "text-amber-400", desc: "Specialized in architecture mapping, regex generation, and precision unit conversions." },
    { title: "Socratic Tutor", icon: "🏫", color: "bg-rose-500/10", textColor: "text-rose-400", desc: "Interactive teaching mode that uses strategic inquiry to lead you to mastery." },
    { title: "Project Blueprinting", icon: "🏗️", color: "bg-blue-600/10", textColor: "text-blue-400", desc: "Generates full project structures, directory maps, and cross-file boilerplate logic." },
    { title: "Visual Synthesis", icon: "🎨", color: "bg-purple-500/10", textColor: "text-purple-400", desc: "High-fidelity image generation and manipulation using Gemini 2.5 Flash Image." },
    { title: "Web Grounding", icon: "🌐", color: "bg-cyan-500/10", textColor: "text-cyan-400", desc: "Live Google Search citations to ensure all facts are synchronized with reality." },
  ];

  const proposed = [
    { title: "Emotional Sync", icon: "🫂", desc: "Advanced empathy mapping to detect and adapt to user stress or excitement levels." },
    { title: "Deep Reader", icon: "📄", desc: "Multi-document summarization and cross-reference analysis for complex PDF sets." },
    { title: "API Integrator", icon: "🔌", desc: "Direct execution of third-party API requests to automate external workflows." }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-950 custom-scrollbar pb-24">
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"></span>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Module Matrix v4.5</p>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">Skill Clusters</h1>
          <p className="text-slate-400 font-medium max-w-xl leading-relaxed text-lg">Buddy's cognitive architecture is divided into specialized domains. These modules are synchronized for cross-functional intelligence.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map(s => (
            <div key={s.title} className={`${s.color} p-8 rounded-[2.5rem] flex flex-col gap-5 border border-white/5 shadow-2xl group hover:border-indigo-500/20 transition-all cursor-default relative overflow-hidden`}>
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/5 group-hover:scale-110 transition-transform relative z-10">{s.icon}</div>
              <div className="relative z-10">
                <h3 className={`font-black ${s.textColor} tracking-[0.1em] text-xs uppercase mb-3`}>{s.title}</h3>
                <p className="text-slate-300 text-[14px] leading-relaxed font-semibold">{s.desc}</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-white/10 transition-all"></div>
            </div>
          ))}
        </div>

        <section className="space-y-6">
          <div className="flex items-center gap-4">
             <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2">Evolving Intelligence</h2>
             <div className="flex-1 h-px bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-60 hover:opacity-100 transition-opacity">
            {proposed.map(p => (
              <div key={p.title} className="bg-slate-900/40 p-6 rounded-[2rem] border border-dashed border-white/10 group">
                <div className="text-2xl mb-4 group-hover:animate-bounce">{p.icon}</div>
                <h4 className="text-white font-bold text-xs mb-2 uppercase tracking-wide">{p.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-indigo-600/10 p-10 rounded-[3rem] border border-indigo-500/20 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xl shadow-indigo-600/20 mb-4 animate-pulse">💡</div>
          <h3 className="text-white font-black uppercase tracking-widest text-sm">Request Neural Upgrade</h3>
          <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed">Buddy evolves based on your needs. Just describe the capability you need, and the engine will adapt.</p>
        </div>
      </div>
    </div>
  );
};

export default Skills;
