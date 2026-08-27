import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, Search, GitBranch, Activity, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';
import { startScan } from '../services/api';
import AiAssistant from '../components/AiAssistant';

export default function HomePage({ selectedModel = 'gemini-3.5-flash' }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (targetUrl) => {
    const finalUrl = (targetUrl || repoUrl || 'https://github.com/example/security-demo').trim();

    setLoading(true);
    setError('');
    try {
      const data = await startScan(finalUrl);
      if (data && data.scanId) {
        navigate(`/scan/${data.scanId}`);
      } else {
        setError('Failed to initiate scan workflow.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to RepoSentinel backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoScan = () => {
    const demoUrl = 'https://github.com/example/security-demo';
    setRepoUrl(demoUrl);
    handleScan(demoUrl);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
        <div className="min-h-[560px] rounded-lg border border-white/10 bg-[#0b0f15]/92 overflow-hidden">
          <div className="scan-rail h-2" />
          <div className="p-5 sm:p-8 lg:p-10 h-full flex flex-col">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <span className="rounded bg-teal-400/10 border border-teal-300/20 px-2 py-1 text-teal-300">Agent mesh online</span>
              <span className="rounded bg-amber-400/10 border border-amber-300/20 px-2 py-1 text-amber-300">Secrets watch</span>
              <span className="rounded bg-rose-400/10 border border-rose-300/20 px-2 py-1 text-rose-300">Risk scoring</span>
            </div>

            <div className="mt-12 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.02]">
                RepoSentinel
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-slate-300 leading-relaxed">
                A repository audit console that scans GitHub code, follows the evidence, and turns findings into a remediation workflow.
              </p>
            </div>

            <div className="mt-8 sentinel-panel rounded-lg p-4 sm:p-5">
              {error && (
                <div className="mb-3 p-2.5 rounded bg-rose-950/30 border border-rose-400/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500" htmlFor="repo-url">
                GitHub repository target
              </label>
              <div className="mt-2 flex flex-col sm:flex-row items-stretch gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    id="repo-url"
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/example/security-demo"
                    className="w-full h-11 bg-black/30 border border-white/10 text-slate-100 placeholder-slate-500 rounded-lg pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-teal-300/70 transition-colors"
                  />
                </div>

                <button
                  onClick={() => handleScan()}
                  disabled={loading}
                  className="h-11 w-full sm:w-auto shrink-0 px-5 sentinel-button hover:brightness-110 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? 'Initiating...' : 'Start Scan'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                <span className="text-slate-400">Use the built-in vulnerable repo for a quick run.</span>
                <button
                  onClick={handleDemoScan}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-amber-200 font-semibold rounded transition-colors flex items-center gap-1.5"
                >
                  <Play className="h-3 w-3 fill-amber-200" />
                  Demo
                </button>
              </div>
            </div>

            <div className="mt-auto pt-8 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                ['Find', 'Secrets and flaws'],
                ['Trace', 'Agent timeline'],
                ['Patch', 'Diff proposals'],
                ['Verify', 'Score recovery']
              ].map(([label, copy]) => (
                <div key={label} className="border-l border-white/15 pl-3 py-1">
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-[11px] text-slate-500">{copy}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-6">
          <div className="rounded-lg border border-white/10 bg-[#111720]/92 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Mission profile</p>
                <h2 className="mt-1 text-lg font-bold text-white">Autonomous audit path</h2>
              </div>
              <Activity className="h-5 w-5 text-teal-300" />
            </div>
            <div className="mt-5 space-y-3">
              {[
                ['01', 'Repository ingest', 'Pulls relevant source, env, config, and manifest files.'],
                ['02', 'Threat detection', 'Runs secret, dependency, and static code scanners.'],
                ['03', 'Remediation loop', 'Generates patches, report exports, and PR handoff.']
              ].map(([step, title, copy]) => (
                <div key={step} className="grid grid-cols-[42px_1fr] gap-3 rounded-lg bg-black/20 border border-white/10 p-3">
                  <div className="font-mono text-xs text-teal-300">{step}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{copy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0d131b]/92 p-5 overflow-hidden">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-teal-400/10 border border-teal-300/20 p-4 min-h-28">
                <LockKeyhole className="h-5 w-5 text-teal-300" />
                <div className="mt-5 text-2xl font-extrabold text-white">9</div>
                <p className="text-xs text-teal-100/70">secret signatures</p>
              </div>
              <div className="rounded-lg bg-amber-400/10 border border-amber-300/20 p-4 min-h-28">
                <GitBranch className="h-5 w-5 text-amber-300" />
                <div className="mt-5 text-2xl font-extrabold text-white">500</div>
                <p className="text-xs text-amber-100/70">files per scan cap</p>
              </div>
              <div className="rounded-lg bg-rose-400/10 border border-rose-300/20 p-4 min-h-28">
                <TriangleAlert className="h-5 w-5 text-rose-300" />
                <div className="mt-5 text-2xl font-extrabold text-white">4</div>
                <p className="text-xs text-rose-100/70">severity lanes</p>
              </div>
              <div className="rounded-lg bg-violet-400/10 border border-violet-300/20 p-4 min-h-28">
                <ShieldCheck className="h-5 w-5 text-violet-300" />
                <div className="mt-5 text-2xl font-extrabold text-white">PR</div>
                <p className="text-xs text-violet-100/70">repair handoff</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AiAssistant selectedModel={selectedModel} />
    </div>
  );
}
