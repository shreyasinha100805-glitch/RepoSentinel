import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function SeverityCards({ counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } }) {
  const cards = [
    {
      title: 'CRITICAL',
      count: counts.CRITICAL || 0,
      color: 'bg-rose-950/20 text-rose-400 border-rose-900/30',
      icon: AlertOctagon
    },
    {
      title: 'HIGH',
      count: counts.HIGH || 0,
      color: 'bg-amber-950/20 text-amber-400 border-amber-900/30',
      icon: AlertTriangle
    },
    {
      title: 'MEDIUM',
      count: counts.MEDIUM || 0,
      color: 'bg-yellow-950/20 text-yellow-400 border-yellow-900/30',
      icon: ShieldAlert
    },
    {
      title: 'LOW',
      count: counts.LOW || 0,
      color: 'bg-sky-950/20 text-sky-400 border-sky-900/30',
      icon: Info
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className={`p-4 rounded-xl border ${c.color} flex items-center justify-between shadow-sm`}>
            <div>
              <div className="text-[11px] font-bold tracking-wider uppercase opacity-80">{c.title}</div>
              <div className="text-2xl font-bold mt-1 text-slate-100">{c.count}</div>
            </div>
            <div className={`p-2.5 rounded-lg ${c.color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
