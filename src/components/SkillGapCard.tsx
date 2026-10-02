import React from 'react';
import { CheckCircle2, XCircle, PlusCircle, Sparkles } from 'lucide-react';

interface SkillGapCardProps {
  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  gapPercentage: number;
}

export const SkillGapCard: React.FC<SkillGapCardProps> = ({
  matchingSkills,
  missingSkills,
  additionalSkills,
  gapPercentage,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Skill Gap Analysis</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({matchingSkills.length + missingSkills.length} target skills evaluated)
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Direct comparison of candidate capabilities against target job specifications
          </p>
        </div>

        {/* Gap Percentage Badge & Bar */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Skill Gap</span>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {gapPercentage}%
            </div>
          </div>
          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                gapPercentage > 40 ? 'bg-red-500' : gapPercentage > 20 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${gapPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
        {/* 1. Matching Skills */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matching Skills ({matchingSkills.length})</span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              Satisfied
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {matchingSkills.length > 0 ? (
              matchingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No direct matching skills detected.</span>
            )}
          </div>
        </div>

        {/* 2. Missing Required Skills */}
        <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Missing Required ({missingSkills.length})</span>
            </div>
            <span className="text-[10px] font-semibold bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  title={`Target job requires ${skill}. Consider adding if you possess practical experience.`}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100/80 dark:bg-red-900/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
                >
                  ✕ {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">All target job skills satisfied!</span>
            )}
          </div>
        </div>

        {/* 3. Additional Candidate Skills */}
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <PlusCircle className="w-4 h-4" />
              <span>Additional Strengths ({additionalSkills.length})</span>
            </div>
            <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              Bonus Assets
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
            {additionalSkills.length > 0 ? (
              additionalSkills.slice(0, 16).map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800"
                >
                  + {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No extra skills detected.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
