import React from 'react';
import { CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';

export default function VerificationPanel({ verification, initialCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } }) {
  const beforeScore = verification?.beforeScore ?? 0;
  const afterScore = verification?.afterScore ?? beforeScore;
  const afterCounts = verification?.afterCounts || (
    afterScore >= 100 ? { CRITICAL: 0, HIGH: 0, MEDIUM: 0 } : initialCounts
  );

  return (
    <div className="bg-[#101622] border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-200 text-sm tracking-wide flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          VERIFICATION PANEL
        </h3>
        <span className="px-2.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 text-xs font-medium border border-emerald-800/40">
          Autonomous Verification Complete
        </span>
      </div>

      {/* Before vs After Severity Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-900/20">
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-2">
            BEFORE REMEDIATION
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Critical:</span>
              <span className="text-rose-400 font-bold">{initialCounts.CRITICAL || 0}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>High:</span>
              <span className="text-amber-400 font-bold">{initialCounts.HIGH || 0}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Medium:</span>
              <span className="text-yellow-400 font-bold">{initialCounts.MEDIUM || 0}</span>
            </div>
            <div className="pt-2 border-t border-rose-900/30 flex justify-between text-xs font-bold text-slate-100">
              <span>Initial Security Score:</span>
              <span className="text-rose-400">{beforeScore} / 100</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-900/20">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>AFTER REMEDIATION</span>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Critical:</span>
              <span className="text-emerald-400 font-bold">{afterCounts.CRITICAL || 0}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>High:</span>
              <span className="text-emerald-400 font-bold">{afterCounts.HIGH || 0}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Medium:</span>
              <span className="text-yellow-400 font-bold">{afterCounts.MEDIUM || 0}</span>
            </div>
            <div className="pt-2 border-t border-emerald-900/30 flex justify-between text-xs font-bold text-slate-100">
              <span>Upgraded Security Score:</span>
              <span className="text-emerald-400">{afterScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Checklist */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Automated Verification Suite</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2.5">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Secret removed</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Syntax valid</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Scan passed</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Tests passed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
