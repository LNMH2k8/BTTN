
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onHome }) => {
  return (
    <nav className="glass sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onHome}
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white group-hover:bg-indigo-500 transition-colors">
          Q
        </div>
        <span className="text-xl font-bold tracking-tight text-white">QUIZ<span className="text-indigo-400">MODERN</span></span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium text-slate-200">{user.username}</span>
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">{user.role}</span>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
