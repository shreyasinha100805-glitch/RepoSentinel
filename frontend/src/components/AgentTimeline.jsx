import React from 'react';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

export default function AgentTimeline({ activities = [] }) {
  const defaultSteps = [
    { agent: 'SupervisorAgent', step: 'Repository received' },
    { agent: 'SecretDetectionAgent', step: 'Scanning source files' },
    { agent: 'CodeSecurityAgent', step: 'Analyzing source code' },
    { agent: 'DependencyAgent', step: 'Checking package dependencies' },
    { agent: 'RiskAnalysisAgent', step: 'Calculating repository risk' },
    { agent: 'RemediationAgent', step: 'Generating security patch' },
    { agent: 'VerificationAgent', step: 'Verifying remediation' }
  ];

  return (
    <div className="bg-[#101622] border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
        <Cpu className="h-4 w-4 text-sky-400" />
        <h3 className="font-bold text-slate-200 text-sm tracking-wide">AGENT ACTIVITY PANEL</h3>
      </div>

      <div className="space-y-3.5">
        {defaultSteps.map((item, idx) => {
          const act = activities.find(a => a.agent === item.agent || a.step === item.step);
          const isDone = Boolean(act && (act.status === 'completed' || act.status === 'done'));
          const isRunning = Boolean(act && act.status === 'running');

          return (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isRunning ? (
                  <Loader2 className="h-4 w-4 text-sky-400 animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-500 font-bold">
                    {idx + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${isDone ? 'text-emerald-300' : isRunning ? 'text-sky-300' : 'text-slate-400'}`}>
                    ✓ {item.agent}
                  </span>
                  {act && act.timestamp && (
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(act.timestamp).toLocaleTimeString()}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.step}</p>
                {act && act.detail && (
                  <p className="text-[11px] text-slate-400 font-mono mt-1 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
                    {act.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
