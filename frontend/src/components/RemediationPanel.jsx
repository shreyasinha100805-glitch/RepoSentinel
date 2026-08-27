import React, { useState, useEffect } from 'react';
import { GitPullRequest, Check, Sparkles, FileCode, X, Edit3, ShieldCheck } from 'lucide-react';

export default function RemediationPanel({
  remediation,
  onGenerateFix,
  onApproveFix,
  onCreatePR,
  isGenerating,
  isCreatingPR,
  prResult
}) {
  const [approved, setApproved] = useState(false);
  const [showPRModal, setShowPRModal] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (remediation && remediation.proposedCode) {
      setEditableCode(remediation.proposedCode);
    }
  }, [remediation]);

  return (
    <div className="bg-[#101622] border border-slate-800 rounded-xl p-6 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-200 text-sm tracking-wide flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-400" />
            REMEDIATION PANEL & LIVE DIFF SANDBOX
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Review and edit proposed AI code patch before committing changes to repository.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateFix}
            disabled={isGenerating}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <FileCode className="h-3.5 w-3.5" />
            {isGenerating ? 'Generating...' : 'Generate Fix'}
          </button>

          <button
            onClick={() => {
              setApproved(true);
              if (onApproveFix) onApproveFix(editableCode);
            }}
            disabled={!remediation || approved}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              approved
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40'
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            {approved ? 'Approved ✓' : 'Approve Fix'}
          </button>

          <button
            onClick={() => onCreatePR(editableCode)}
            disabled={!approved || isCreatingPR || Boolean(prResult)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            {isCreatingPR ? 'Creating PR...' : prResult ? 'PR Created ✓' : 'Create Pull Request'}
          </button>
        </div>
      </div>

      {/* Code Diff Viewer & Live Editor */}
      {remediation ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>CURRENT CODE (VULNERABLE)</span>
                <span className="font-mono text-[10px] text-slate-500">{remediation.file}</span>
              </div>
              <pre className="bg-[#090d16] p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto h-48 leading-relaxed">
                <code>{remediation.originalCode || 'const API_KEY = "DEMO_SECRET";'}</code>
              </pre>
            </div>

            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  PROPOSED FIX (REMEDIATED)
                  {isEditing && <span className="text-[10px] text-sky-400 font-mono">(Live Editing)</span>}
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 underline"
                >
                  <Edit3 className="h-3 w-3" />
                  {isEditing ? 'Done Editing' : 'Edit Code'}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="w-full bg-[#090d16] p-3.5 rounded-lg border border-sky-500/80 text-xs font-mono text-emerald-300 h-48 focus:outline-none leading-relaxed resize-none"
                />
              ) : (
                <pre className="bg-[#090d16] p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto h-48 leading-relaxed">
                  <code>{editableCode}</code>
                </pre>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unified Patch Diff</span>
            <pre className="mt-1.5 bg-[#080b12] p-3.5 rounded-lg border border-slate-800 text-xs font-mono overflow-x-auto max-h-40 leading-relaxed">
              {remediation.diff ? (
                remediation.diff.split('\n').map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('+')
                        ? 'text-emerald-400 bg-emerald-950/30 px-1'
                        : line.startsWith('-')
                        ? 'text-rose-400 bg-rose-950/30 px-1'
                        : 'text-slate-400'
                    }
                  >
                    {line}
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">Click "Generate Fix" to view diff patch.</span>
              )}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed border-slate-800/80 rounded-lg text-center text-slate-400 text-xs">
          Select a finding or click <strong className="text-sky-400">Generate Fix</strong> to generate a safety patch.
        </div>
      )}

      {/* Pull Request Banner */}
      {prResult && (
        <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-400 text-xs">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>
              Pull Request <strong>#{prResult.prNumber}</strong> created successfully on branch{' '}
              <code className="bg-emerald-950 px-1.5 py-0.5 rounded font-mono">{prResult.branch}</code>
            </span>
          </div>

          <button
            onClick={() => {
              if (prResult.demoMode) {
                setShowPRModal(true);
              } else if (prResult.prUrl) {
                window.open(prResult.prUrl, '_blank');
              }
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-[11px] transition-colors shrink-0 flex items-center gap-1"
          >
            <GitPullRequest className="h-3.5 w-3.5" />
            {prResult.demoMode ? 'View PR Details (Demo)' : 'View on GitHub'}
          </button>
        </div>
      )}

      {/* Simulated PR Modal */}
      {showPRModal && prResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101622] border border-slate-700/80 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-[#0d121c]">
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-sm">Simulated GitHub Pull Request #{prResult.prNumber}</h3>
              </div>
              <button
                onClick={() => setShowPRModal(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 font-medium">
                🛡️ Security Fix: Automated Remediation Patch by RepoSentinel
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">BRANCH</span>
                  <span className="font-mono text-[11px] text-sky-400">{prResult.branch}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">AUTHOR</span>
                  <span className="font-mono text-[11px] text-emerald-400">RepoSentinel AI Bot [app]</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">PR Description</span>
                <p className="mt-1 p-3 rounded bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  This automated Pull Request refactors hardcoded API credentials and fixes dynamic execution risks identified by RepoSentinel's multi-agent workflow. Syntax validated and security scan verified.
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Mode: DEMO_MODE=true</span>
                <span>Connect GITHUB_TOKEN for live GitHub repository commits</span>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-[#0d121c] flex justify-end">
              <button
                onClick={() => setShowPRModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
