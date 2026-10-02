import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { AtsGauge } from '../components/AtsGauge';
import { RadarChart } from '../components/RadarChart';
import { SkillGapCard } from '../components/SkillGapCard';
import confetti from 'canvas-confetti';
import {
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Layers,
  Award,
  TrendingUp,
  FileCheck2,
  Lightbulb,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface AnalysisResultPageProps {
  analysisId: string;
  onNavigate: (page: string) => void;
  onDownloadPdf: (analysisId: string) => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysisId,
  onNavigate,
  onDownloadPdf,
}) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'roles' | 'recommendations' | 'formatting'>('overview');

  useEffect(() => {
    fetch(`/api/analyses/${analysisId}`)
      .then(res => {
        if (!res.ok) throw new Error('Analysis not found');
        return res.json();
      })
      .then(data => {
        setAnalysis(data.analysis);
        setLoading(false);
        // Trigger celebratory confetti if score >= 80
        if (data.analysis?.atsScore >= 80) {
          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
        }
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [analysisId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Loading analysis results...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Analysis record not found</h2>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const radarData = [
    { label: "Keyword Match", value: analysis.keywordScore },
    { label: "Semantic Sim", value: analysis.semanticScore },
    { label: "Experience Fit", value: analysis.experienceScore },
    { label: "Formatting", value: analysis.formattingScore },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDownloadPdf(analysis.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Target Job & Candidate Summary Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Audit Complete
            </span>
            <span className="text-xs text-slate-400">
              {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {analysis.jobTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300">
            Employer: <span className="font-semibold text-white">{analysis.company}</span> • Resume: <span className="font-semibold text-white">{analysis.resumeName}</span>
          </p>
        </div>

        {/* Big ATS circular badge */}
        <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black text-white">
              {analysis.atsScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              ATS Compatibility
            </span>
          </div>
          <div className="h-10 w-px bg-slate-700" />
          <div className="text-xs space-y-0.5">
            <div className="text-slate-300">Fit Level: <span className="font-bold text-white">{analysis.atsScore >= 80 ? 'High' : analysis.atsScore >= 68 ? 'Moderate' : 'Developing'}</span></div>
            <div className="text-slate-400 text-[11px]">Skill Gap: <span className="font-semibold text-amber-400">{analysis.skillGap.gapPercentage}%</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'overview', label: 'Score & 4 Pillars' },
          { id: 'skills', label: `Skill Gap (${analysis.skillGap.matchingSkills.length}/${analysis.skillGap.matchingSkills.length + analysis.skillGap.missingSkills.length})` },
          { id: 'roles', label: `Predicted Roles (${analysis.predictedRoles.length})` },
          { id: 'recommendations', label: 'AI Recommendations' },
          { id: 'formatting', label: 'Formatting Compliance' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & 4 PILLARS TRANSPARENCY */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Keyword Match */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Keyword Match (K)</span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: {Math.round(analysis.weights.keyword * 100)}%</span>
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {analysis.keywordScore}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {analysis.keywordDetails.matched.length} of {analysis.keywordDetails.totalRequired} target keywords and domain competencies detected.
              </p>
            </div>

            {/* 2. Semantic Similarity */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Semantic Similarity (S)</span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: {Math.round(analysis.weights.semantic * 100)}%</span>
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {analysis.semanticScore}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                High cosine embedding overlap in core duties and technical project narratives.
              </p>
            </div>

            {/* 3. Experience Fit */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Experience Fit (E)</span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: {Math.round(analysis.weights.experience * 100)}%</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {analysis.experienceScore}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                ~{analysis.experienceDetails.detectedYears} yrs detected against {analysis.experienceDetails.requiredYears} yrs specified. Qualification fit is {analysis.experienceDetails.qualificationFit}%.
              </p>
            </div>

            {/* 4. Formatting */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Formatting &amp; ATS (F)</span>
                <span className="text-[10px] font-semibold text-slate-400">Weight: {Math.round(analysis.weights.formatting * 100)}%</span>
              </div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {analysis.formattingScore}%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Single-column parsable text stream conforming to modern ATS layout standards.
              </p>
            </div>

          </div>

          {/* Visual Gauge + Radar Chart side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Overall ATS Formula Score
              </h3>
              <AtsGauge score={analysis.atsScore} size={200} />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Multi-Pillar Balance Radar
              </h3>
              <RadarChart data={radarData} size={260} />
            </div>
          </div>

          {/* ATS Transparency Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>ATS Score Transparency — Why this score was produced</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Keyword Matching Score ({analysis.keywordScore}/100):</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.keywordDetails.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Semantic Similarity Score ({analysis.semanticScore}/100):</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.semanticDetails.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Experience &amp; Qualification Fit ({analysis.experienceScore}/100):</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.experienceDetails.reason}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Formatting Compliance ({analysis.formattingScore}/100):</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.formattingDetails.summary}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SKILL GAP MATRIX */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <SkillGapCard
            matchingSkills={analysis.skillGap.matchingSkills}
            missingSkills={analysis.skillGap.missingSkills}
            additionalSkills={analysis.skillGap.additionalSkills}
            gapPercentage={analysis.skillGap.gapPercentage}
          />
        </div>
      )}

      {/* TAB 3: PREDICTED JOB ROLES */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                Intelligent Job Role Predictions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated by Agent 5 across 24+ career profiles using candidate skills, experience duration, and project history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.predictedRoles.map((role, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Rank #{idx + 1}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {role.role}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                        {role.score}%
                      </span>
                      <span className="text-[10px] text-slate-400 block leading-none">relevance</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${role.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {role.reason}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {role.matchingPoints.slice(0, 5).map((pt, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                      >
                        ✓ {pt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PERSONALIZED RECOMMENDATIONS */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          
          {/* Executive Summary */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Executive Synthesis</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {analysis.recommendations.executiveSummary}
            </p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/10 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Candidate Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.recommendations.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/10 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Target Opportunities for Improvement</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.recommendations.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Missing Keywords (Ethically Phrased) */}
          {analysis.recommendations.missingKeywordsSuggestions.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Target Keywords to Consider Highlighting</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {analysis.recommendations.missingKeywordsSuggestions.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                      {item.keyword}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Rewrites */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Experience Impact &amp; Action Verb Rewrites
            </h4>
            <div className="space-y-3">
              {analysis.recommendations.experienceImprovements.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                    <span>{exp.role}</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Recommended Verbs: {exp.actionVerbs.slice(0, 3).join(', ')}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">Impact-Optimized Bullet:</span>
                    "{exp.rewrittenBullet}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Rewrites */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-2xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Project Descriptions &amp; Quantified Impact
            </h4>
            <div className="space-y-3">
              {analysis.recommendations.projectImprovements.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                    <span>{proj.projectTitle}</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">{proj.suggestedTitle}</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold uppercase text-blue-600 block mb-1">Recommended Rewrite:</span>
                    "{proj.rewrittenBullet}"
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: FORMATTING COMPLIANCE */}
      {activeTab === 'formatting' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                ATS Layout &amp; Structural Compliance Audit ({analysis.formattingScore}/100)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                16+ factor structural checker verifying parsing safety, single-column reading order, and clear contact headers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.formattingDetails.checks.map((c) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    c.passed
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-800 dark:text-slate-200'
                      : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold">{c.label}</div>
                    <div className="text-slate-600 dark:text-slate-400">{c.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
