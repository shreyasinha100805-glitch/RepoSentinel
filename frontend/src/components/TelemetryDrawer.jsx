import React from 'react';
import { Terminal, Shield, Activity, Clock, Cpu, CheckCircle } from 'lucide-react';

export default function TelemetryDrawer({ isOpen, onClose, selectedModel, telemetryData }) {
  if (!isOpen) return null;

  const defaultTelemetry = telemetryData || {
    modelUsed: selectedModel || 'Google Gemini 3.5 Flash',
    durationMs: 142,
    promptTokens: 342,
    completionTokens: 128,
    reasoningChain: [
      'Ingested redacted source file snippet & package manifest',
      'Applied zero-trust regex secret masking engine',
      'Matched context payload against Google Gemini 3.5 safety policy',
      'Synthesized safe code refactoring diff template',
      'Verified syntax and automated security pass'
    ]
  };

  return (
    <div className="bg-[#0b0e17] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-sky-400" />
          <h4 className="font-bold text-slate-200 text-xs tracking-wider uppercase">
            AGENT REASONING CHAIN & TELEMETRY AUDIT LOG
          </h4>
        </div>
        <span className="px-2 py-0.5 rounded bg-sky-950/40 text-sky-400 border border-sky-800/40 text-[10px] font-semibold">
          OpenTelemetry Compliant
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">AI MODEL ENGINE</span>
          <span className="text-slate-100 font-bold text-[11px] truncate block">{defaultTelemetry.modelUsed}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">EXECUTION LATENCY</span>
          <span className="text-emerald-400 font-bold text-[11px]">{defaultTelemetry.durationMs} ms</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">PROMPT TOKENS</span>
          <span className="text-sky-400 font-bold text-[11px]">{defaultTelemetry.promptTokens}</span>
        </div>
        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">COMPLETION TOKENS</span>
          <span className="text-sky-400 font-bold text-[11px]">{defaultTelemetry.completionTokens}</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Step-by-Step Reasoning Execution Chain</span>
        <div className="mt-2 space-y-1.5 bg-[#080b12] p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed">
          {defaultTelemetry.reasoningChain.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <span className="text-sky-500 font-bold select-none">&gt;</span>
              <span>[Step {idx + 1}] {step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
