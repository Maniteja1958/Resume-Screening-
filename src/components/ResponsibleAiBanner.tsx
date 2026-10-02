import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export const ResponsibleAiBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 flex items-start justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Responsible AI &amp; Ethical Screening Notice
          </p>
          <p>
            AI-assisted analysis only. This system provides resume and job-matching insights and should not be treated as an automated hiring decision. Results are grounded strictly in text parsing and skills ontology; demographic factors (race, religion, gender, age) are never evaluated.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
