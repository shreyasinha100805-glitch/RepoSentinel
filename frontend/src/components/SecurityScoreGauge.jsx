import React from 'react';

export default function SecurityScoreGauge({ score, label = "SECURITY SCORE", upgradedScore }) {
  const currentScore = upgradedScore !== undefined ? upgradedScore : score;

  const getStrokeColor = (val) => {
    if (val >= 80) return 'stroke-emerald-500';
    if (val >= 50) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  return (
    <div className="bg-[#101622] border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative shadow-sm">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">{label}</div>
      
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`transition-all duration-700 ease-out ${getStrokeColor(currentScore)}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-100 tracking-tight">{currentScore}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>

      {upgradedScore !== undefined && upgradedScore > score && (
        <div className="mt-4 px-3 py-1 bg-emerald-950/40 border border-emerald-800/50 rounded-md text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <span>Score Remediated:</span>
          <span className="font-bold">{score} → {upgradedScore}</span>
        </div>
      )}
    </div>
  );
}
