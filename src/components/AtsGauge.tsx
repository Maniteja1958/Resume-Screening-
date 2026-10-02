import React from 'react';

interface AtsGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showSubtext?: boolean;
}

export const AtsGauge: React.FC<AtsGaugeProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = "ATS COMPATIBILITY",
  showSubtext = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine color based on score
  let strokeColor = "#3b82f6"; // Blue
  let bgGradient = "from-blue-500/10 to-transparent";
  let statusText = "Moderate Match";
  let statusBadge = "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";

  if (score >= 80) {
    strokeColor = "#10b981"; // Emerald
    bgGradient = "from-emerald-500/10 to-transparent";
    statusText = "Excellent Match";
    statusBadge = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300";
  } else if (score >= 68) {
    strokeColor = "#3b82f6"; // Blue
    bgGradient = "from-blue-500/10 to-transparent";
    statusText = "Strong Competitor";
    statusBadge = "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  } else if (score >= 50) {
    strokeColor = "#f59e0b"; // Amber
    bgGradient = "from-amber-500/10 to-transparent";
    statusText = "Moderate Gaps";
    statusBadge = "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300";
  } else {
    strokeColor = "#ef4444"; // Red
    bgGradient = "from-red-500/10 to-transparent";
    statusText = "Requires Revision";
    statusBadge = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {score}
          </span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            out of 100
          </span>
        </div>
      </div>

      {showSubtext && (
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge}`}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
