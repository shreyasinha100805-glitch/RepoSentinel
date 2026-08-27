import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, History, Radar, Sparkles, Command, Moon, Sun, LogIn, LogOut, UserCircle, UserPlus } from 'lucide-react';
import CommandPalette from './CommandPalette';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ selectedModel = 'gemini-3.5-flash', onModelSelect, theme = 'dark', onThemeToggle }) {
  const location = useLocation();
  const [showPalette, setShowPalette] = useState(false);
  const { isAuthenticated, user, logoutUser } = useAuth();

  const models = [
    { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', badge: 'High Speed' },
    { id: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro', badge: 'Deep Reasoning' },
    { id: 'gemma-2-9b-it', label: 'Gemma 2 9B', badge: 'Open Weight' }
  ];

  return (
    <>
      <header className="border-b border-white/10 bg-[#07090d]/88 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg scan-rail border border-white/15 flex items-center justify-center text-white group-hover:border-teal-300/60 transition-all">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 tracking-tight text-base">RepoSentinel</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-teal-400/10 text-teal-300 border border-teal-300/20">
                  Live Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Repository threat command center</p>
            </div>
          </Link>

          {/* Model Engine Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/25 border border-white/10 p-1 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 ml-1" />
            {models.map((m) => {
              const isSelected = selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onModelSelect && onModelSelect(m.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>{m.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-400'}`}>
                    {m.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <nav className="flex items-center gap-4">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/25 border border-white/10 text-slate-300 hover:border-teal-300/40 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setShowPalette(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 bg-black/25 border border-white/10 hover:border-teal-300/40 rounded-md transition-colors"
            >
              <Command className="h-3 w-3" />
              <span>Search (Ctrl+K)</span>
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    location.pathname === '/' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Radar className="h-4 w-4" />
                  Scanner
                </Link>
                <Link
                  to="/history"
                  className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    location.pathname === '/history' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <History className="h-4 w-4" />
                  History
                </Link>
                <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <UserCircle className="h-4 w-4" />
                  <span className="max-w-28 truncate">{user?.name || user?.email}</span>
                </div>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    location.pathname === '/login' ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  to="/create-account"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg sentinel-button hover:brightness-110 transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Create
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <CommandPalette
        isOpen={showPalette}
        onClose={() => setShowPalette(false)}
        onSelectModel={onModelSelect}
      />
    </>
  );
}
