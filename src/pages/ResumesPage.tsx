import React, { useState, useRef } from 'react';
import { AnalysisResult, CandidateProfile, ResumeRecord, User } from '../types';
import { EditableProfileModal } from '../components/EditableProfileModal';
import {
  FileText,
  Upload,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  CheckCircle2,
  Plus,
  RefreshCw,
  Eye,
  Download,
  Sparkles,
  Search,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Mail,
  User as UserIcon,
} from 'lucide-react';

interface ResumesPageProps {
  resumes: ResumeRecord[];
  analyses: AnalysisResult[];
  currentUser: User | null;
  onRefresh: () => void;
  onNavigate: (page: string, param?: string) => void;
  onSelectForAnalysis: (resumeId: string) => void;
}

export const ResumesPage: React.FC<ResumesPageProps> = ({
  resumes,
  analyses,
  currentUser,
  onRefresh,
  onNavigate,
  onSelectForAnalysis,
}) => {
  const [selectedResume, setSelectedResume] = useState<ResumeRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<CandidateProfile | null>(null);
  const [viewProfileModal, setViewProfileModal] = useState<ResumeRecord | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload
  const handleFileUpload = async (file: File) => {
    if (!currentUser) {
      setUploadError('You must be signed in to upload resumes.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', currentUser.id);

    try {
      const res = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload resume file');
      }

      onRefresh();
    } catch (e: any) {
      setUploadError(e.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete resume
  const handleDelete = async (id: string, fileName: string) => {
    if (!currentUser) return;
    if (confirm(`Are you sure you want to delete "${fileName}"? This will also remove any related analysis reports.`)) {
      try {
        const res = await fetch(`/api/resumes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.id}`,
          },
        });
        if (res.ok) {
          onRefresh();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Save updated profile
  const handleSaveProfile = async (updated: CandidateProfile) => {
    if (!selectedResume || !currentUser) return;
    try {
      await fetch(`/api/resumes/${selectedResume.id}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({ profile: updated, userId: currentUser.id }),
      });
      onRefresh();
      setIsEditModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Download parsed resume as clean text/markdown file
  const handleDownloadResumeText = (resume: ResumeRecord) => {
    const content = resume.rawText || JSON.stringify(resume.profile, null, 2);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.fileName.replace(/\.[^/.]+$/, "")}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter resumes by search term
  const filtered = resumes.filter(r => {
    const term = searchTerm.toLowerCase();
    const allSkills = [
      ...r.profile.skills.technical,
      ...r.profile.skills.languages,
      ...r.profile.skills.frameworks,
      ...r.profile.skills.tools,
    ].join(' ').toLowerCase();

    return (
      r.fileName.toLowerCase().includes(term) ||
      (r.profile.name && r.profile.name.toLowerCase().includes(term)) ||
      (r.profile.email && r.profile.email.toLowerCase().includes(term)) ||
      allSkills.includes(term)
    );
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            My Resumes ({resumes.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Permanent repository of candidate resumes uploaded to your account with parsed skills and ATS histories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
          >
            {isUploading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isUploading ? 'Uploading & Parsing...' : 'Upload New Resume'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Error alert */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      {resumes.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by candidate name, skill, or file name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs shadow-2xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Resumes Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(r => {
            const resumeAnalyses = analyses.filter(a => a.resumeId === r.id);
            const totalSkills = [
              ...r.profile.skills.technical,
              ...r.profile.skills.languages,
              ...r.profile.skills.frameworks,
              ...r.profile.skills.tools,
            ];

            return (
              <div
                key={r.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3.5">
                  {/* Card Header: File info & Badge */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate" title={r.fileName}>
                          {r.fileName}
                        </h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {r.fileType.toUpperCase()} • {Math.round(r.fileSize / 1024)} KB • Uploaded {new Date(r.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {r.lastAnalysisScore !== undefined ? (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                        r.lastAnalysisScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        r.lastAnalysisScore >= 68 ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        Score: {r.lastAnalysisScore}/100
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        Not evaluated
                      </span>
                    )}
                  </div>

                  {/* Candidate Overview Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <UserIcon className="w-3 h-3" /> Candidate
                      </span>
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {r.profile.name || 'Unspecified'}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                      <div className="text-slate-600 dark:text-slate-400 truncate">
                        {r.profile.email || 'None extracted'}
                      </div>
                    </div>
                  </div>

                  {/* Education snippet */}
                  {r.profile.education && r.profile.education.length > 0 && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5 pt-1">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">
                        {r.profile.education[0].degree} in {r.profile.education[0].major} ({r.profile.education[0].institution})
                      </span>
                    </div>
                  )}

                  {/* Extracted Skills Preview */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-[11px] font-semibold text-slate-500">
                      <span>Extracted Skills ({totalSkills.length})</span>
                      <span>{resumeAnalyses.length} analysis audit(s)</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {totalSkills.slice(0, 6).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {s}
                        </span>
                      ))}
                      {totalSkills.length > 6 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                          +{totalSkills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewProfileModal(r)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="View Full Extracted Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedResume(r);
                        setEditingProfile(r.profile);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Edit Extracted Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDownloadResumeText(r)}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="Download Extracted Text"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(r.id, r.fileName)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onSelectForAnalysis(r.id);
                      onNavigate('analyze');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Screen / Analyze</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-sm mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {searchTerm ? 'No resumes match your search' : 'No resumes in your account yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {searchTerm 
                ? 'Try a different candidate name, technology, or clear your search query.'
                : 'Upload candidate resumes in PDF, DOCX, or TXT format to start screening and benchmarking against target job descriptions.'}
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Candidate Resume</span>
          </button>
        </div>
      )}

      {/* Edit Extracted Profile Modal */}
      {isEditModalOpen && selectedResume && editingProfile && (
        <EditableProfileModal
          profile={editingProfile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* View Full Profile Modal */}
      {viewProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {viewProfileModal.profile.name || viewProfileModal.fileName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {viewProfileModal.profile.email} • {viewProfileModal.profile.location || 'Location not specified'}
                </p>
              </div>
              <button
                onClick={() => setViewProfileModal(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            {viewProfileModal.profile.summary && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Professional Summary</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {viewProfileModal.profile.summary}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Parsed Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  ...viewProfileModal.profile.skills.technical,
                  ...viewProfileModal.profile.skills.languages,
                  ...viewProfileModal.profile.skills.frameworks,
                  ...viewProfileModal.profile.skills.tools,
                ].map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {viewProfileModal.profile.experience.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Experience</span>
                <div className="space-y-3">
                  {viewProfileModal.profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{exp.role}</span>
                        <span className="text-slate-400 text-[11px]">{exp.duration}</span>
                      </div>
                      <div className="text-slate-500 font-semibold">{exp.company}</div>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                          {exp.responsibilities.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onSelectForAnalysis(viewProfileModal.id);
                  setViewProfileModal(null);
                  onNavigate('analyze');
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Analyze This Resume
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
