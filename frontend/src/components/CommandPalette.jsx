import React, { useState, useEffect } from 'react';
import { Search, Cpu, History, Sparkles, Shield, X, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette({ isOpen, onClose, onSelectModel }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Launch Demo Security Scan', cat: 'Navigation', action: () => { navigate('/'); onClose(); } },
    { title: 'View Scan History & Audit Logs', cat: 'Navigation', action: () => { navigate('/history'); onClose(); } },
    { title: 'Switch AI Engine to Gemini 3.5 Flash', cat: 'AI Model', action: () => { onSelectModel('gemini-3.5-flash'); onClose(); } },
    { title: 'Switch AI Engine to Gemini 3.5 Pro', cat: 'AI Model', action: () => { onSelectModel('gemini-3.5-pro'); onClose(); } },
    { title: 'Switch AI Engine to Gemma 2 9B', cat: 'AI Model', action: () => { onSelectModel('gemma-2-9b-it'); onClose(); } }
  ];

  const filtered = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-[#101622] border border-slate-700/80 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search... (Ctrl+K)"
            className="w-full bg-transparent text-slate-100 text-xs font-mono focus:outline-none placeholder-slate-500"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">ESC</kbd>
        </div>

        <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-xs text-slate-200 flex items-center justify-between transition-colors"
              >
                <span>{item.title}</span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{item.cat}</span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800 bg-[#0c101a] text-[10px] text-slate-500 flex justify-between">
          <span>Navigation Shortcuts</span>
          <span>RepoSentinel Command Palette</span>
        </div>
      </div>
    </div>
  );
}
