import React from 'react';
import { AnalysisResult, ResumeRecord } from '../types';
import { AtsGauge } from '../components/AtsGauge';
import { RadarChart } from '../components/RadarChart';
import {
  Sparkles,
  FileText,
  Briefcase,
  TrendingUp,
  Download,
  Eye,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Upload,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DashboardPageProps {
  analyses: AnalysisResult[];
  resumes: ResumeRecord[];
  onNavigate: (page: string, param?: string) => void;
  onDownloadPdf: (analysisId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analyses,
  resumes,
  onNavigate,
  onDownloadPdf,
}) => {
  const latestAnalysis = analyses && analyses.length > 0 ? analyses[0] : null;
  const hasData = Boolean(latestAnalysis);

  // Radar chart data from latest analysis
  const radarData = latestAnalysis ? [
    { label: "Keywords", value: latestAnalysis.keywordScore },
    { label: "Semantic", value: latestAnalysis.semanticScore },
    { label: "Experience", value: latestAnalysis.experienceScore },
    { label: "Formatting", value: latestAnalysis.formattingScore },
  ] : [];

  const averageAts = analyses.length > 0
    ? Math.round(analyses.reduce((acc, a) => acc + a.atsScore, 0) / analyses.length)
    : 0;

  const topPredictedRole = latestAnalysis?.predictedRoles && latestAnalysis.predictedRoles.length > 0
    ? latestAnalysis.predictedRoles[0].role
    : null;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Candidate Intelligence Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ATS Screening &amp; Role Prediction Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Track resume compatibility, monitor skill gaps, and explore AI role matching across your career applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>New Resume Analysis</span>
          </button>
          <button
            onClick={() => onNavigate('compare')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-700/60 hover:bg-blue-700 border border-blue-400/40 text-white transition-all active:scale-95"
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Versions</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Latest ATS Score */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Latest ATS Score</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {latestAnalysis ? `${latestAnalysis.atsScore}/100` : '—'}
          </div>
          <span className={`text-[11px] font-semibold flex items-center gap-1 ${
            latestAnalysis ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
          }`}>
            {latestAnalysis ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Formula-weighted verified
              </>
            ) : (
              'No analyses run yet'
            )}
          </span>
        </div>

        {/* Skill Gap Rate */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Skill Gap Rate</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {latestAnalysis ? `${latestAnalysis.skillGap.gapPercentage}%` : '—'}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {latestAnalysis ? `${latestAnalysis.skillGap.missingSkills.length} missing required skills` : 'Requires resume upload'}
          </span>
        </div>

        {/* Top Role Match */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Top Role Match</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate" title={topPredictedRole || "Not yet calculated"}>
            {topPredictedRole || '—'}
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            {latestAnalysis?.predictedRoles[0]?.score ? `${latestAnalysis.predictedRoles[0].score}% relevance` : 'Awaiting first analysis'}
          </span>
        </div>

        {/* Resumes & Reports */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase">Resumes / Reports</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {resumes.length} / {analyses.length}
          </div>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            {resumes.length === 1 ? '1 active resume' : `${resumes.length} active resumes`}
          </span>
        </div>

      </div>

      {/* Main Content Area: Charts or Empty State */}
      {hasData && latestAnalysis ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ATS Gauge Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-between">
              <div className="w-full text-left">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Latest ATS Compatibility Score
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {latestAnalysis.jobTitle} • {latestAnalysis.company}
                </p>
              </div>

              <div className="my-4">
                <AtsGauge score={latestAnalysis.atsScore} size={190} />
              </div>

              <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>Weighted ATS Formula</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">w1K + w2S + w3E + w4F</span>
              </div>
            </div>

            {/* Radar Chart Card (4 Pillars) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  ATS Evaluation Pillars
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Breakdown across the 4 core compatibility dimensions
                </p>
              </div>

              <div className="my-2 flex justify-center">
                <RadarChart data={radarData} size={210} color="#2563eb" />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('analysis-detail', latestAnalysis.id)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Detailed Dimension Audit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Top Predicted Roles Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Predicted Job Roles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Model classification across 24+ industry roles
                </p>
              </div>

              <div className="space-y-3 my-4">
                {latestAnalysis.predictedRoles.slice(0, 4).map((r, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{r.role}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{r.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('ml-benchmarks')}
                className="w-full py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-center"
              >
                Explore ML Classifier Benchmarks
              </button>
            </div>

          </div>

          {/* Recent Analyses History Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recent Resume Analyses
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stored audit records and downloadable candidate reports
                </p>
              </div>

              <button
                onClick={() => onNavigate('analysis')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All ({analyses.length})
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Candidate Resume</th>
                    <th className="py-3 px-4">Target Job</th>
                    <th className="py-3 px-4 text-center">ATS Score</th>
                    <th className="py-3 px-4 text-center">Skill Gap</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {analyses.slice(0, 5).map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                        {a.resumeName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{a.jobTitle}</span>
                        <span className="text-slate-400 block text-[10px]">{a.company}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                          a.atsScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          a.atsScore >= 68 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {a.atsScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                        {a.skillGap.gapPercentage}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onNavigate('analysis-detail', a.id)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="View Detailed Results"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDownloadPdf(a.id)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Download PDF Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Clean Professional Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              No Resume Analyses Found Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload your resume in PDF, DOCX, or TXT format and select any target job description. Our 7-agent AI pipeline will extract your profile, benchmark ATS compatibility, highlight skill gaps, and predict your best job matches.
            </p>
          </div>

          {/* Quick Resumes available if user already uploaded without analyzing */}
          {resumes.length > 0 ? (
            <div className="max-w-lg mx-auto pt-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-3">
                You have {resumes.length} uploaded resume(s) ready to screen:
              </span>
              <div className="space-y-2 text-left">
                {resumes.slice(0, 3).map(r => (
                  <div key={r.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
                    <div className="truncate pr-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{r.fileName}</div>
                      <div className="text-[10px] text-slate-400">{r.profile.name} • {r.fileType.toUpperCase()}</div>
                    </div>
                    <button
                      onClick={() => onNavigate('analyze')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1.5"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('analyze')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
              >
                <Upload className="w-4 h-4" />
                <span>Upload &amp; Analyze Your First Resume</span>
              </button>
              <button
                onClick={() => onNavigate('jobs')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Browse Target Job Descriptions</span>
              </button>
            </div>
          )}

          {/* 3 Step Walkthrough */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">1</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Upload Resume</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">PDF, DOCX, or TXT file with automatic candidate profile extraction.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">2</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Choose Target Role</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Select from 12+ preconfigured positions or paste any custom job description.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">3</span>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">7-Agent Audit</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Comprehensive ATS score, ontology skill gap matrix, &amp; PDF download.</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
