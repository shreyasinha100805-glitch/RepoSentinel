import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, LockKeyhole, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const { isAuthenticated, registerUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await registerUser(form);
      navigate('/', { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create account.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6 items-stretch">
        <form onSubmit={handleSubmit} className="sentinel-panel rounded-lg p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">Workspace setup</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">Create account</h1>
            <p className="mt-2 text-sm text-slate-400">Set up a security workspace for repository scans and remediation review.</p>
          </div>

          {message && (
            <div className="mb-4 rounded-lg border border-teal-300/20 bg-teal-400/10 px-3 py-2 text-xs text-teal-200">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Full name</span>
              <span className="relative mt-2 block">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70" placeholder="Security lead" />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Organization</span>
              <span className="relative mt-2 block">
                <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input required value={form.organization} onChange={(e) => updateField('organization', e.target.value)} className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70" placeholder="Acme Security" />
              </span>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-slate-300">Email</span>
            <span className="relative mt-2 block">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input type="email" required value={form.email} onChange={(e) => updateField('email', e.target.value)} className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70" placeholder="security@example.com" />
            </span>
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-slate-300">Password</span>
            <span className="relative mt-2 block">
              <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input type="password" minLength="8" required value={form.password} onChange={(e) => updateField('password', e.target.value)} className="w-full h-11 rounded-lg border border-white/10 bg-black/30 pl-10 pr-4 text-sm text-slate-100 outline-none focus:border-teal-300/70" placeholder="Minimum 8 characters" />
            </span>
          </label>

          <button type="submit" disabled={loading} className="mt-6 h-11 w-full rounded-lg sentinel-button text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? 'Creating workspace...' : 'Create workspace'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-teal-300">Login</Link>
          </p>
        </form>

        <div className="rounded-lg border border-white/10 bg-[#0b0f15]/92 overflow-hidden">
          <div className="scan-rail h-2" />
          <div className="p-6 sm:p-8">
            <div className="h-12 w-12 rounded-lg bg-teal-400/10 border border-teal-300/20 flex items-center justify-center text-teal-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-10 text-3xl font-extrabold text-white tracking-tight">Built for audit teams</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Invite teammates later, track repository scans, review findings, and prepare pull request fixes from one workspace.
            </p>
            <div className="mt-8 space-y-3">
              {['Persistent scan history', 'Repository risk profiles', 'Remediation approval flow'].map(item => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
