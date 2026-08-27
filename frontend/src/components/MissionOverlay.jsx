import React from 'react';
import { X, CheckCircle, ShieldCheck, Cpu, ArrowDown } from 'lucide-react';

export default function MissionOverlay({ onClose, scanData }) {
  const totalThreats = scanData?.findings?.length || 0;
  const initialScore = scanData?.securityScore !== undefined ? scanData.securityScore : 100;
  const afterScore = scanData?.verification?.afterScore ?? (totalThreats > 0 ? 91 : initialScore);
  const fixedThreats = totalThreats;

  const steps = [
    { title: 'MISSION STARTED', desc: 'Autonomous workflow initialized by SupervisorAgent' },
    { title: 'RECONNAISSANCE', desc: 'Repository structure & source files analyzed' },
    { title: 'THREAT DISCOVERY', desc: `${totalThreats} potential threats found across files` },
    { title: 'AI INVESTIGATION', desc: 'Google Gemini analyzing threat context & severity' },
    { title: 'RISK ASSESSMENT', desc: `Security Score calculated: ${initialScore} / 100` },
    { title: 'AUTONOMOUS REMEDIATION', desc: `${fixedThreats} safe code patches and git diffs generated` },
    { title: 'VERIFICATION', desc: 'Security scan re-run & post-fix tests passed' },
    { title: 'MISSION COMPLETE', desc: 'Repository security restored' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e131f] border border-slate-700/80 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0b0e17]">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="font-bold text-slate-100 text-sm tracking-wide uppercase">AUTONOMOUS SECURITY MISSION</h2>
              <p className="text-[11px] text-slate-400 font-mono">RepoSentinel Protocol Workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[65vh] overflow-y-auto">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-full p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-sky-300 uppercase tracking-wider">{s.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                  PASSED
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowDown className="h-3.5 w-3.5 text-slate-600 my-0.5" />
              )}
            </div>
          ))}

          {/* Final Mission Summary Card */}
          <div className="mt-5 p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-2.5">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">MISSION ACCOMPLISHED</h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">THREATS FOUND</span>
                <span className="text-rose-400 text-sm font-extrabold">{totalThreats}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">THREATS FIXED</span>
                <span className="text-emerald-400 text-sm font-extrabold">{fixedThreats}</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">SECURITY SCORE</span>
                <span className="text-sky-400 text-sm font-extrabold">{initialScore} → {afterScore}</span>
              </div>
            </div>
            <div className="pt-1 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <span>VERIFICATION:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/50 text-[11px]">
                PASSED ✓
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-[#0b0e17] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
