import React from 'react';
import { Trophy, LogOut, Info } from 'lucide-react';

export default function Header({ usuario, onLogout, onOpenRules }) {
  return (
    <header className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl font-black text-white tracking-tighter shadow-inner">
            VF
          </div>
          <div className="bg-orange-500 p-2 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Trophy size={24} className="text-black" />
          </div>
          <span className="font-black text-2xl tracking-tight text-white hidden sm:block">
            Virtual<span className="text-orange-500">.Prode</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onOpenRules} className="p-2 text-zinc-400 hover:text-orange-500 bg-zinc-900 rounded-lg border border-zinc-800 transition-colors">
            <Info size={20} />
          </button>
          {usuario && (
            <button onClick={onLogout} className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800">
              <span className="hidden sm:inline">Salir</span> <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}