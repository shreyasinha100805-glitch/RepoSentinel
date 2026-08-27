import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Shield, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { getScanHistory } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getScanHistory();
        if (data && data.history) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error('Error fetching scan history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="rounded-lg border border-white/10 bg-[#0b0f15]/92 overflow-hidden">
        <div className="scan-rail h-2" />
        <div className="flex items-center gap-3 p-5 sm:p-6">
        <div className="p-2.5 rounded-lg bg-teal-400/10 border border-teal-300/20 text-teal-300">
          <History className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">SCAN LEDGER</h1>
          <p className="text-xs text-slate-400">Repository audit records, scores, and remediation handoffs</p>
        </div>
        </div>
      </div>

      <div className="bg-[#10151d]/95 border border-white/10 rounded-lg overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-black/25 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Repository</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Security Score</th>
                <th className="px-6 py-4">Findings</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">
                    No scan history recorded yet. Start your first scan from the scanner.
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.scanId} className="hover:bg-white/[0.04] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-white">
                      {item.repository}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                        item.securityScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        item.securityScore >= 50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {item.securityScore} / 100
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {item.findings?.length || 0} issues
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded">
                        {item.status || 'completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/scan/${item.scanId}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white/10 text-slate-100 border border-white/10 hover:border-teal-300/40 rounded-lg transition-colors"
                      >
                        Open Dashboard
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
