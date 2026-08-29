import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function FindingsTable({ findings = [], onSelectFinding, selectedFindingId, onToggleStatus, onFixAll }) {
  const getSeverityBadge = (sev) => {
    const s = (sev || 'LOW').toUpperCase();
    if (s === 'CRITICAL') return 'bg-rose-950/40 text-rose-400 border-rose-800/40';
    if (s === 'HIGH') return 'bg-amber-950/40 text-amber-400 border-amber-800/40';
    if (s === 'MEDIUM') return 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40';
    return 'bg-sky-950/40 text-sky-400 border-sky-800/40';
  };

  return (
    <div className="bg-[#101622] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-bold text-slate-200 text-sm tracking-wide">SECURITY FINDINGS TABLE</h3>
        <div className="flex items-center gap-3">
          {onFixAll && findings.length > 0 && (
            <button
              onClick={onFixAll}
              className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Remediate All Threats
            </button>
          )}
          <span className="text-xs text-slate-400 font-mono">{findings.length} threat(s) detected</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0c111a] text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">File</th>
              <th className="px-6 py-3">Line</th>
              <th className="px-6 py-3">Confidence</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {findings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-slate-500 italic">
                  No security issues found. Repository is clean!
                </td>
              </tr>
            ) : (
              findings.map((f) => {
                const isSelected = f.id === selectedFindingId;
                const isFixed = ['Fixed', 'Remediated', 'Resolved', 'Approved', 'PR Created'].includes(f.status);
                return (
                  <tr
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    className={`cursor-pointer transition-colors hover:bg-slate-850/50 ${
                      isSelected ? 'bg-slate-800/60 border-l-2 border-sky-400' : ''
                    }`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border ${getSeverityBadge(f.severity)}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-100">{f.type}</td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{f.file}</td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{f.line}</td>
                    <td className="px-6 py-3.5 font-medium text-emerald-400">{f.confidence}</td>
                    <td className="px-6 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleStatus) onToggleStatus(f);
                        }}
                        title="Click to toggle status"
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                          isFixed
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                            : 'bg-rose-950/40 text-rose-400 border-rose-800/40 hover:bg-rose-900/60'
                        }`}
                      >
                        {isFixed ? (f.status === 'Open' ? 'Remediated ✓' : (f.status || 'Fixed ✓')) : 'Open (Fix)'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
