import React, { useState } from 'react';
import { JobDescription, ResumeRecord, User } from '../types';
import { AtsGauge } from '../components/AtsGauge';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  PlusCircle,
  FileText,
  Briefcase,
  Sparkles,
} from 'lucide-react';

interface VersionComparePageProps {
  resumes: ResumeRecord[];
  jobs: JobDescription[];
  currentUser?: User | null;
  onNavigate?: (page: string) => void;
}

export const VersionComparePage: React.FC<VersionComparePageProps> = ({
  resumes,
  jobs,
  currentUser,
  onNavigate,
}) => {
  const [resumeId1, setResumeId1] = useState(resumes[0]?.id || '');
  const [resumeId2, setResumeId2] = useState(resumes[1]?.id || resumes[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [comparisonResult, setComparisonResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (resumes.length > 0) {
      if (!resumeId1 || !resumes.some(r => r.id === resumeId1)) {
        setResumeId1(resumes[0].id);
      }
      if (!resumeId2 || !resumes.some(r => r.id === resumeId2)) {
        setResumeId2(resumes[1]?.id || resumes[0].id);
      }
    }
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [resumes, jobs]);

  const handleCompare = async () => {
    if (!resumeId1 || !resumeId2) {
      setError('Please select two resumes to compare.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser ? `Bearer ${currentUser.id}` : '',
        },
        body: JSON.stringify({
          resumeId1,
          resumeId2,
          jobDescriptionId: selectedJobId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to compare resumes');
      }

      const data = await res.json();
      setComparisonResult(data);
    } catch (e: any) {
      console.error('Comparison error:', e);
      setError(e.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Resume Version Comparison
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Measure iterative revisions side-by-side and observe score gains across ATS formula pillars.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Resume Baseline (Version 1)
            </label>
            <select
              value={resumeId1}
              onChange={e => setResumeId1(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.fileName} ({r.profile.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Revised Resume (Version 2)
            </label>
            <select
              value={resumeId2}
              onChange={e => setResumeId2(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.fileName} ({r.profile.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Benchmark Target Job
            </label>
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <GitCompare className="w-4 h-4" />
            <span>{loading ? 'Evaluating...' : 'Run Side-by-Side Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonResult && (
        <div className="space-y-6">
          
          {/* Delta Banner */}
          <div className={`p-6 rounded-2xl border text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            comparisonResult.deltas.atsDiff >= 0
              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
              : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
          }`}>
            <div className="flex items-center gap-3">
              {comparisonResult.deltas.atsDiff >= 0 ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 flex items-center justify-center font-black">
                  +{comparisonResult.deltas.atsDiff}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 flex items-center justify-center font-black">
                  {comparisonResult.deltas.atsDiff}
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm">
                  {comparisonResult.deltas.atsDiff >= 0
                    ? `ATS Compatibility improved by +${comparisonResult.deltas.atsDiff} points in Version 2`
                    : `Version 2 scored ${comparisonResult.deltas.atsDiff} points compared to Version 1`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {comparisonResult.job.title} at {comparisonResult.job.company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div>V1: <span className="text-slate-600 dark:text-slate-400">{comparisonResult.version1.evaluation.atsScore}/100</span></div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <div>V2: <span className="text-blue-600 dark:text-blue-400">{comparisonResult.version2.evaluation.atsScore}/100</span></div>
            </div>
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Version 1 Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Baseline</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {comparisonResult.version1.resume.fileName}
                  </h3>
                </div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {comparisonResult.version1.evaluation.atsScore}/100
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Keyword Matching</span>
                  <span className="font-bold">{comparisonResult.version1.evaluation.keywordScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Semantic Similarity</span>
                  <span className="font-bold">{comparisonResult.version1.evaluation.semanticScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience Fit</span>
                  <span className="font-bold">{comparisonResult.version1.evaluation.experienceScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Formatting Compliance</span>
                  <span className="font-bold">{comparisonResult.version1.evaluation.formattingScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Matching Skills ({comparisonResult.version1.skillGap.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {comparisonResult.version1.skillGap.matchingSkills.map((s: string, idx: number) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Version 2 Card */}
            <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Revised Version</span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {comparisonResult.version2.resume.fileName}
                  </h3>
                </div>
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                  {comparisonResult.version2.evaluation.atsScore}/100
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Keyword Matching</span>
                  <span className="font-bold text-blue-600">
                    {comparisonResult.version2.evaluation.keywordScore}%
                    <span className="text-[10px] ml-1 text-emerald-600">
                      ({comparisonResult.deltas.keywordDiff >= 0 ? '+' : ''}{comparisonResult.deltas.keywordDiff}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Semantic Similarity</span>
                  <span className="font-bold text-indigo-600">
                    {comparisonResult.version2.evaluation.semanticScore}%
                    <span className="text-[10px] ml-1 text-emerald-600">
                      ({comparisonResult.deltas.semanticDiff >= 0 ? '+' : ''}{comparisonResult.deltas.semanticDiff}%)
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience Fit</span>
                  <span className="font-bold text-emerald-600">
                    {comparisonResult.version2.evaluation.experienceScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Formatting Compliance</span>
                  <span className="font-bold text-purple-600">
                    {comparisonResult.version2.evaluation.formattingScore}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Matching Skills ({comparisonResult.version2.skillGap.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {comparisonResult.version2.skillGap.matchingSkills.map((s: string, idx: number) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900/40">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Newly Added Competencies */}
          {comparisonResult.deltas.newlyAddedSkills.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>New Competencies Added in Version 2</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {comparisonResult.deltas.newlyAddedSkills.map((s: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                    + {s}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
