import React from 'react';
import {
  Sparkles,
  PlayCircle,
  FileCheck2,
  Cpu,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  BrainCircuit,
  Search,
} from 'lucide-react';
import { ResponsibleAiBanner } from '../components/ResponsibleAiBanner';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onTryDemo: () => void;
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onTryDemo,
  onNavigate,
}) => {
  return (
    <div className="space-y-12 pb-16">
      <ResponsibleAiBanner />

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white p-8 sm:p-14 border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
            <span>Agentic AI Resume Screening &amp; Intelligent Role Prediction</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Elevate your resume beyond simple keyword filters.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            A research-based candidate intelligence platform combining 7 cooperating AI agents, semantic embeddings, hierarchical skill ontology, and machine learning role prediction.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onStartAnalysis}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-all"
            >
              <PlayCircle className="w-4 h-4 text-indigo-400" />
              <span>Explore Pre-Loaded Demo</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-black text-white">4 Pillars</div>
              <div className="text-xs text-slate-400">Formula ATS Score</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">24+ Roles</div>
              <div className="text-xs text-slate-400">Career Prediction</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">7 Agents</div>
              <div className="text-xs text-slate-400">Cooperating Pipeline</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">100% PDF</div>
              <div className="text-xs text-slate-400">Downloadable Audit</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Cooperating AI Agents Architecture */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Seven Cooperating Agents Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Moving beyond rudimentary regex keyword counters to true candidate-oriented contextual screening.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Resume Parser Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Handles multi-column layout extraction from PDF, DOCX, and TXT files, preserving section order and text fidelity.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Information Extraction Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Identifies personal details, skills, education, employment timelines, and projects in an editable JSON format.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">ATS Compatibility Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Computes weighted formula: ATS = w1K + w2S + w3E + w4F with transparent explanations for each pillar.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Skill Gap Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Classifies skills into Matching, Missing, and Additional, calculating exact Skill Gap % with ontology synonym matching.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Job Prediction Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Ranks profile against 24+ career roles with fit percentages and explainable evidence-grounded rationale.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
              6
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recommendation Agent</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dual-engine synthesis offering actionable project improvements, bullet rewrites, and ethical missing keyword advice.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs col-span-1 sm:col-span-2">
            <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              7
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Report Agent (PDF Engine)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Generates downloadable multi-page PDF audit reports with complete scoring breakdowns, skill gap tables, and executive summaries.
            </p>
          </div>

        </div>
      </section>

      {/* Workflow Steps Preview */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">How the Screening Pipeline Works</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete end-to-end execution in seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-blue-500/20">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Upload Resume</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, or TXT format parsed seamlessly</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-indigo-500/20">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Review Profile</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verify and edit extracted skills &amp; experience</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-purple-500/20">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Match Target Job</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter job description and customize ATS weights</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black mx-auto shadow-md shadow-emerald-500/20">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Audit &amp; PDF Report</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Get ATS score, predicted roles, and downloadable PDF</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onStartAnalysis}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Resume Analysis</span>
          </button>
        </div>
      </section>

    </div>
  );
};
