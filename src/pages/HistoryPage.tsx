import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import {
  History,
  Eye,
  Download,
  Trash2,
  Search,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface HistoryPageProps {
  analyses: AnalysisResult[];
  onNavigate: (page: string, param?: string) => void;
  onDownloadPdf: (analysisId: string) => void;
  onRefresh: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  analyses,
  onNavigate,
  onDownloadPdf,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = analyses.filter(a => {
    const term = searchTerm.toLowerCase();
    return (
      a.resumeName.toLowerCase().includes(term) ||
      a.jobTitle.toLowerCase().includes(term) ||
      a.company.toLowerCase().includes(term) ||
      a.profileSnapshot.name.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm("Delete this analysis record?")) {
      await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
      onRefresh();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Analysis History ({analyses.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit history of past candidate screening evaluations, ATS scores, and downloadable PDF reports.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by candidate, role, or company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Candidate &amp; Resume</th>
                <th className="py-3.5 px-4">Target Job</th>
                <th className="py-3.5 px-4 text-center">ATS Score</th>
                <th className="py-3.5 px-4 text-center">Keyword Match</th>
                <th className="py-3.5 px-4 text-center">Skill Gap</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filtered.length > 0 ? (
                filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{a.profileSnapshot.name}</div>
                      <div className="text-[10px] text-slate-400">{a.resumeName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{a.jobTitle}</div>
                      <div className="text-[10px] text-slate-400">{a.company}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                        a.atsScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        a.atsScore >= 68 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {a.atsScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                      {a.keywordScore}%
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-amber-600 dark:text-amber-400">
                      {a.skillGap.gapPercentage}%
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onNavigate('analysis-detail', a.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onDownloadPdf(a.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No matching analysis records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
