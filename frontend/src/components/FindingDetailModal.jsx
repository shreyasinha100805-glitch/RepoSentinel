import React from 'react';
import { X, ShieldAlert, FileCode, Lightbulb } from 'lucide-react';

export default function FindingDetailModal({ finding, onClose, onGenerateFix }) {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101622] border border-slate-700/80 rounded-xl w-full max-w-xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0d121c]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-rose-950/40 border border-rose-800/40 text-rose-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">{finding.type}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{finding.file} : Line {finding.line}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Severity & Confidence</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded bg-rose-950/40 text-rose-400 border border-rose-800/40">
                {finding.severity}
              </span>
              <span className="text-emerald-400 font-semibold">
                Confidence: {finding.confidence}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Explanation</span>
            <p className="mt-1 text-slate-300 bg-slate-900/80 p-3 rounded border border-slate-800 leading-relaxed">
              {finding.explanation}
            </p>
          </div>

          {finding.redactedValue && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Redacted Secret Value</span>
              <div className="mt-1 bg-slate-950 text-rose-400 font-mono text-[11px] p-2.5 rounded border border-rose-950 select-all">
                {finding.redactedValue}
              </div>
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">AI Recommendation</span>
            <div className="mt-1 flex items-start gap-2 text-sky-300 bg-sky-950/20 p-3 rounded border border-sky-900/30">
              <Lightbulb className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{finding.recommendation}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-[#0d121c] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onGenerateFix(finding);
            }}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors flex items-center gap-1.5"
          >
            <FileCode className="h-3.5 w-3.5" />
            Generate Patch
          </button>
        </div>
      </div>
    </div>
  );
}
