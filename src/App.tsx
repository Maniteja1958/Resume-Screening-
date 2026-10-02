import React, { useEffect, useState, useCallback } from 'react';
import { AnalysisResult, JobDescription, ResumeRecord, User } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { VersionComparePage } from './pages/VersionComparePage';
import { ResumesPage } from './pages/ResumesPage';
import { JobsPage } from './pages/JobsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { MlBenchmarksPage } from './pages/MlBenchmarksPage';
import { SettingsPage } from './pages/SettingsPage';

const SESSION_STORAGE_KEY = 'screenai_user_session';

export function App() {
  // Current logged in user (null if not authenticated)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not parse user session:', e);
      }
    }
    return null;
  });

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(SESSION_STORAGE_KEY)) {
      return 'dashboard';
    }
    return 'landing';
  });

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [preselectedResumeId, setPreselectedResumeId] = useState<string>('');

  // User-scoped data state
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Fetch strictly user-scoped data
  const fetchData = useCallback(async (userToFetch?: User | null) => {
    const user = userToFetch !== undefined ? userToFetch : currentUser;
    if (!user) {
      setResumes([]);
      setAnalyses([]);
      // Predefined jobs can still be fetched
      try {
        const jobsRes = await fetch('/api/jobs');
        if (jobsRes.ok) {
          const data = await jobsRes.json();
          setJobs(data.jobs || []);
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    setLoadingInitial(true);
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${user.id}`,
      };

      const [resumesRes, jobsRes, analysesRes] = await Promise.all([
        fetch(`/api/resumes?userId=${user.id}`, { headers }),
        fetch(`/api/jobs?userId=${user.id}`, { headers }),
        fetch(`/api/analyses?userId=${user.id}`, { headers }),
      ]);

      if (resumesRes.ok) {
        const data = await resumesRes.json();
        setResumes(data.resumes || []);
      }
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data.jobs || []);
      }
      if (analysesRes.ok) {
        const data = await analysesRes.json();
        setAnalyses(data.analyses || []);
        if (data.analyses && data.analyses.length > 0 && !selectedAnalysisId) {
          setSelectedAnalysisId(data.analyses[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load user-scoped data:', e);
    } finally {
      setLoadingInitial(false);
    }
  }, [currentUser, selectedAnalysisId]);

  // Verify session on mount
  useEffect(() => {
    if (currentUser?.id) {
      fetch(`/api/auth/me?userId=${currentUser.id}`, {
        headers: { 'Authorization': `Bearer ${currentUser.id}` }
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Session invalid');
        })
        .then(data => {
          if (data.user) {
            setCurrentUser(data.user);
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
            fetchData(data.user);
          }
        })
        .catch(() => {
          // If session was invalid on server, clear and reset
          localStorage.removeItem(SESSION_STORAGE_KEY);
          setCurrentUser(null);
          setCurrentPage('landing');
        });
    } else {
      fetchData(null);
    }
  }, []);

  // Protected route navigation guard
  const handleNavigate = (page: string, param?: string) => {
    // Protected pages requiring authentication
    const protectedPages = ['dashboard', 'analyze', 'resumes', 'jobs', 'analysis', 'compare', 'reports', 'settings', 'analysis-detail'];

    if (!currentUser && protectedPages.includes(page)) {
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return;
    }

    if (page === 'analysis-detail' && param) {
      setSelectedAnalysisId(param);
      setCurrentPage('analysis-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth callbacks
  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    fetchData(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setCurrentUser(null);
    setResumes([]);
    setAnalyses([]);
    setSelectedAnalysisId('');
    setPreselectedResumeId('');
    setCurrentPage('landing');
  };

  const handleLoginDemo = async () => {
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        handleLoginSuccess(data.user, data.token || data.user.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadPdf = async (analysisId: string) => {
    try {
      const response = await fetch(`/api/reports/${analysisId}/pdf`, {
        headers: currentUser ? { 'Authorization': `Bearer ${currentUser.id}` } : {},
      });
      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_ATS_Screening_Report_${analysisId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download PDF report.');
    }
  };

  const handleAnalysisComplete = (newAnalysisId: string) => {
    fetchData(currentUser);
    setSelectedAnalysisId(newAnalysisId);
    setCurrentPage('analysis-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectResumeForAnalysis = (resumeId: string) => {
    setPreselectedResumeId(resumeId);
    setCurrentPage('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      
      {/* Header / Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={(tab) => {
          setAuthModalTab(tab);
          setAuthModalOpen(true);
        }}
        onLoginDemo={handleLoginDemo}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (visible on non-landing pages when authenticated) */}
        {currentPage !== 'landing' && currentUser && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        )}

        {/* Content Area */}
        <main className={`flex-1 p-4 sm:p-8 w-full ${currentPage === 'landing' ? 'max-w-6xl mx-auto' : 'max-w-7xl mx-auto'}`}>
          
          {currentPage === 'landing' && (
            <LandingPage
              onStartAnalysis={() => {
                if (currentUser) {
                  setCurrentPage('analyze');
                } else {
                  setAuthModalTab('register');
                  setAuthModalOpen(true);
                }
              }}
              onTryDemo={handleLoginDemo}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardPage
              analyses={analyses}
              resumes={resumes}
              onNavigate={handleNavigate}
              onDownloadPdf={handleDownloadPdf}
            />
          )}

          {currentPage === 'analyze' && (
            <AnalyzePage
              resumes={resumes}
              jobs={jobs}
              currentUser={currentUser}
              preselectedResumeId={preselectedResumeId}
              onAnalysisComplete={handleAnalysisComplete}
              onRefreshResumes={() => fetchData(currentUser)}
            />
          )}

          {currentPage === 'analysis-detail' && (
            <AnalysisResultPage
              analysisId={selectedAnalysisId || (analyses[0]?.id || '')}
              onNavigate={handleNavigate}
              onDownloadPdf={handleDownloadPdf}
            />
          )}

          {currentPage === 'compare' && (
            <VersionComparePage
              resumes={resumes}
              jobs={jobs}
              currentUser={currentUser}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'resumes' && (
            <ResumesPage
              resumes={resumes}
              analyses={analyses}
              currentUser={currentUser}
              onRefresh={() => fetchData(currentUser)}
              onNavigate={handleNavigate}
              onSelectForAnalysis={handleSelectResumeForAnalysis}
            />
          )}

          {currentPage === 'jobs' && (
            <JobsPage
              jobs={jobs}
              currentUser={currentUser}
              onRefresh={() => fetchData(currentUser)}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'analysis' && (
            <HistoryPage
              analyses={analyses}
              onNavigate={handleNavigate}
              onDownloadPdf={handleDownloadPdf}
              onRefresh={() => fetchData(currentUser)}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage
              analyses={analyses}
              onNavigate={handleNavigate}
              onDownloadPdf={handleDownloadPdf}
            />
          )}

          {currentPage === 'ml-benchmarks' && (
            <MlBenchmarksPage />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Global Minimal Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ScreenAI • Enterprise Agentic AI Resume Screening &amp; Intelligent Job Role Prediction</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {currentUser ? `Signed in as ${currentUser.name} (${currentUser.email})` : 'Multi-Tenant Data Isolated Platform'}
          </span>
        </div>
      </footer>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;
