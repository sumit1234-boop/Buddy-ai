import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileNav: React.FC = () => {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/chat', label: 'Chat', icon: '💬' },
    { to: '/skills', label: 'Skills', icon: '⚡' },
    { to: '/memory', label: 'Memory', icon: '🧠' },
    { to: '/personalize', label: 'Setup', icon: '⚙️' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-1 pb-[env(safe-area-inset-bottom,12px)] pt-3 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`relative flex flex-col items-center gap-1.5 flex-1 py-1 transition-all duration-300 ${
              isActive ? 'text-indigo-400 scale-110' : 'text-slate-500'
            } active:scale-90`}
          >
            <span className="text-xl leading-none">{link.icon}</span>
            <span className={`text-[9px] font-black uppercase tracking-tight transition-all ${
              isActive ? 'opacity-100' : 'opacity-70'
            }`}>
              {link.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;