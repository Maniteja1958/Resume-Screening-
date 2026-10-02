import React from 'react';
import { AnalysisResult } from '../types';
import {
  FileCheck2,
  Download,
  Eye,
  FileText,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ReportsPageProps {
  analyses: AnalysisResult[];
  onNavigate: (page: string, param?: string) => void;
  onDownloadPdf: (analysisId: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  analyses,
  onNavigate,
  onDownloadPdf,
}) => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          PDF Audit Reports Repository ({analyses.length})
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enterprise multi-page PDF reports synthesized by Agent 7 with complete ATS transparency audits.
        </p>
      </div>

      {analyses.length > 0 ? (
        /* Reports Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map(a => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 dark:hover:border-blue-700 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {a.atsScore}/100 ATS
                  </span>
                </div>

                <div className="pt-3 space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {a.jobTitle}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {a.company} • Candidate: {a.profileSnapshot.name}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mt-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {a.recommendations.executiveSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('analysis-detail', a.id)}
                    className="px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 font-semibold"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDownloadPdf(a.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              No PDF Reports Generated Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you evaluate a resume against a target job description, Agent 7 automatically compiles an enterprise multi-page PDF audit report with executive summaries and recommendations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Screen a Resume Now</span>
          </button>
        </div>
      )}

    </div>
  );
};
