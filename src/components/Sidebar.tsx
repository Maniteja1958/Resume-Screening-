import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Briefcase,
  History,
  GitCompare,
  FileCheck2,
  Cpu,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Resume', icon: Sparkles, badge: 'Agentic' },
    { id: 'resumes', label: 'My Resumes', icon: FileText },
    { id: 'jobs', label: 'Job Descriptions', icon: Briefcase },
    { id: 'analysis', label: 'Analysis History', icon: History },
    { id: 'compare', label: 'Version Comparison', icon: GitCompare, badge: 'New' },
    { id: 'reports', label: 'PDF Reports', icon: FileCheck2 },
    { id: 'ml-benchmarks', label: 'Research & ML Lab', icon: Cpu },
    { id: 'settings', label: 'Settings & Weights', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 hidden md:flex flex-col justify-between py-4">
      <div className="space-y-1 px-3">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Platform Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom info card */}
      <div className="px-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/50 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>7 Cooperating Agents</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Parser, Extractor, ATS Engine, Skill Gap, Role Predictor, Recommendations, &amp; PDF Report.
          </p>
        </div>
      </div>
    </aside>
  );
};
