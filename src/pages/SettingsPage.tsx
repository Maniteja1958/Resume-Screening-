import React, { useState, useEffect } from 'react';
import { ATSWeights, User } from '../types';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  User as UserIcon,
  Sliders,
  Cpu,
  ShieldCheck,
  Check,
  Moon,
  Sun,
  Laptop,
  LogOut,
  Save,
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: User | null;
  onLogout?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onLogout }) => {
  const { theme, setTheme } = useTheme();

  const [weights, setWeights] = useState<ATSWeights>({
    keyword: 0.30,
    semantic: 0.30,
    experience: 0.25,
    formatting: 0.15,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser?.settings?.defaultWeights) {
      setWeights(currentUser.settings.defaultWeights);
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await fetch('/api/auth/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          userId: currentUser.id,
          settings: {
            theme,
            defaultWeights: weights,
          },
        }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const keywordPct = Math.round(weights.keyword * 100);
  const semanticPct = Math.round(weights.semantic * 100);
  const expPct = Math.round(weights.experience * 100);
  const formatPct = Math.round(weights.formatting * 100);

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          System Preferences &amp; Weights
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure active account information, appearance themes, and default 4-pillar ATS formula weights.
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-blue-600" />
          <span>Active Authenticated Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">User Full Name</label>
            <input
              type="text"
              readOnly
              value={currentUser?.name || "Visitor"}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>
          <div>
            <label className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Email Address</label>
            <input
              type="text"
              readOnly
              value={currentUser?.email || "Not signed in"}
              className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        {onLogout && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Appearance & Dark Mode */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Theme &amp; Appearance</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between Light, Dark, or System mode. Your selection persists across browser refreshes and sessions.
        </p>

        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-500" />
            <span>Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              theme === 'system'
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-600 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Laptop className="w-5 h-5 text-sky-500" />
            <span>System Default</span>
          </button>
        </div>
      </div>

      {/* Default ATS Formula Weights */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Default ATS Compatibility Weights</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Normalized across the 4 pillars (Keywords + Semantic + Experience + Formatting = 100%).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>Keyword Match (K)</span>
              <span className="text-blue-600">{keywordPct}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={keywordPct}
              onChange={e => setWeights({ ...weights, keyword: Number(e.target.value) / 100 })}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>Semantic Similarity (S)</span>
              <span className="text-indigo-600">{semanticPct}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={semanticPct}
              onChange={e => setWeights({ ...weights, semantic: Number(e.target.value) / 100 })}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>Experience Fit (E)</span>
              <span className="text-emerald-600">{expPct}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={expPct}
              onChange={e => setWeights({ ...weights, experience: Number(e.target.value) / 100 })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between font-bold">
              <span>Formatting Compliance (F)</span>
              <span className="text-purple-600">{formatPct}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              value={formatPct}
              onChange={e => setWeights({ ...weights, formatting: Number(e.target.value) / 100 })}
              className="w-full accent-purple-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Preferences Saved' : 'Save Default Weights'}</span>
          </button>
        </div>
      </form>

      {/* Responsible AI Compliance Notice */}
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Ethical AI &amp; Fair Candidate Screening Principles</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          ScreenAI is designed as an affirmative candidate-empowerment tool. It analyzes technical qualifications, skills ontology relations, and syntactic structure without factoring in age, gender, race, religion, geographic origin, or other protected demographic characteristics.
        </p>
      </div>

    </div>
  );
};
