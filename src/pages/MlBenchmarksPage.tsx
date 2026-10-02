import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Database,
  BarChart2,
  CheckCircle2,
  Table,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { BENCHMARK_DATASETS, EVALUATION_RESULTS, CONFUSION_MATRIX_SAMPLES } from '../ai/ml/benchmark';

export const MlBenchmarksPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-blue-600" />
          <span>Research Architecture &amp; Machine Learning Benchmarks</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Empirical evaluation of role-classification models, dataset taxonomies, and multi-agent hybrid screening performance.
        </p>
      </div>

      {/* Model Performance Comparison Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Role Classification Model Benchmark (TF-IDF vs Linear SVM vs Hybrid)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVALUATION_RESULTS.map((m, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border space-y-3 ${
                m.modelName.includes('Hybrid')
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-white shadow-md shadow-blue-500/10'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {m.modelName.includes('Hybrid') ? 'Candidate Platform' : `Classifier #${idx + 1}`}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {m.inferenceLatencyMs}ms lat
                </span>
              </div>

              <h3 className="font-bold text-xs leading-snug">
                {m.modelName}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Accuracy</span>
                  <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                    {(m.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">F1 Score</span>
                  <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {(m.f1Score * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Precision</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {(m.precision * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Recall</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {(m.recall * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Integration Specifications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Research Datasets &amp; Knowledge Base Integration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {BENCHMARK_DATASETS.map((d, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 dark:text-white">{d.name}</span>
                <span className="font-semibold text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {d.totalRecords.toLocaleString()} Records
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {d.description}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                Source: <span className="font-medium text-slate-600 dark:text-slate-300">{d.source}</span> • Classes: {d.classesCount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix Highlights */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Multi-Class Confusion Matrix Highlights
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Domain Category</th>
                <th className="py-2.5 px-4 text-center">Correct Predictions</th>
                <th className="py-2.5 px-4 text-left">Primary Ambiguity Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {CONFUSION_MATRIX_SAMPLES.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.category}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {row.predicted_correct} samples
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{row.misclassified_as}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
