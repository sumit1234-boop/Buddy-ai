
import React from 'react';
import { NavLink } from 'react-router-dom';
import BuddyFace from './BuddyFace';

const Sidebar: React.FC = () => {
  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/chat', label: 'Buddy Chat', icon: '💬' },
    { to: '/skills', label: 'Skills', icon: '⚡' },
    { to: '/memory', label: 'Memory Control', icon: '🧠' },
    { to: '/personalize', label: 'Settings', icon: '⚙️' },
    { to: '/about', label: 'About', icon: '👋' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 h-screen flex flex-col p-4 sticky top-0 bg-[#020617] z-50">
      {/* Framed Logo Section as per Screenshot */}
      <div className="flex items-center gap-3 p-3 border border-indigo-400/30 rounded-sm mb-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="p-1 bg-[#050b18] rounded-md border border-white/5 relative z-10 shadow-inner">
          <BuddyFace size="sm" state="idle" />
        </div>
        <div className="flex flex-col relative z-10">
          <span className="text-xs font-black text-white tracking-[0.2em] uppercase">Buddy</span>
          <div className="h-[1px] w-full bg-white/40 mt-0.5"></div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-indigo-600/90 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-xl filter drop-shadow-sm">{link.icon}</span>
            <span className="font-bold text-[14px] tracking-tight">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Styled Status Box as per Screenshot */}
      <div className="mt-auto p-5 bg-[#0d1425] rounded-2xl border border-white/5 shadow-2xl">
        <p className="text-[9px] text-indigo-300 font-black uppercase mb-2 tracking-[0.2em] opacity-80">Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
          <span className="text-xs font-bold text-slate-200 tracking-tight">Buddy Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
