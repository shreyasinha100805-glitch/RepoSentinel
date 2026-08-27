import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Github, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await loginUser({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 items-stretch">
        <div className="rounded-lg border border-white/10 bg-[#0b0f15]/92 overflow-hidden min-h-[520px]">
          <div className="scan-rail h-2" />
          <div className="p-6 sm:p-8 h-full flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-lg scan-rail border border-white/15 flex items-center justify-center text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="mt-10 text-4xl font-extrabold tracking-tight text-white">Welcome back</h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Sign in to return to your repository audit workspace, scan history, and remediation handoffs.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg border border-teal-300/20 bg-teal-400/10 p-3 text-teal-200">Threat Intel</div>
              <div className="rounded-lg border border-amber-300/20 bg-amber-400/10 p-3 text-amber-200">Scan Ledger</div>
              <div className="rounded-lg border border-rose-300/20 bg-rose-400/10 p-3 text-rose-200">PR Fixes</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sentinel-panel rounded-lg p-5 sm:p-8 self-center">
          <div className="mb-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Secure access</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Login to RepoSentinel</h2>
          </div>

          {message && (
            <div className="mb-4 rounded-lg border border-teal-300/20 bg-teal-400/10 px-3 py-2 text-xs text-teal-200">
              {message}
            </div>
          )}

          <label className="block text-xs font-semibold text-slate-300" htmlFor="email">Email</label>
          <div className="relative mt-2">
            <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70"
              placeholder="security@example.com"
            />
          </div>

          <label className="mt-4 block text-xs font-semibold text-slate-300" htmlFor="password">Password</label>
          <div className="relative mt-2">
            <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70"
              placeholder="Enter password"
            />
          </div>

          <button type="submit" disabled={loading} className="mt-6 h-11 w-full rounded-lg sentinel-button text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Login'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <button type="button" disabled className="mt-3 h-11 w-full rounded-lg border border-white/10 bg-white/10 text-sm font-semibold text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
            <Github className="h-4 w-4" />
            GitHub login unavailable
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            New to RepoSentinel? <Link to="/create-account" className="font-semibold text-teal-300">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
