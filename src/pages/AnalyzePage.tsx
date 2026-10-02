import React, { useState, useRef, useEffect } from 'react';
import { CandidateProfile, JobDescription, ResumeRecord, User } from '../types';
import { EditableProfileModal } from '../components/EditableProfileModal';
import { PREDEFINED_JOB_TEMPLATES } from '../ai/knowledge/predefinedJobs';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Edit3,
  Sliders,
  AlertCircle,
  FileCheck,
  ChevronRight,
  RefreshCw,
  Search,
  PlusCircle,
  Check,
  Info,
  Calendar,
  Briefcase,
  User as UserIcon,
  Trash2,
} from 'lucide-react';

interface AnalyzePageProps {
  resumes: ResumeRecord[];
  jobs: JobDescription[];
  currentUser: User | null;
  onAnalysisComplete: (analysisId: string) => void;
  onRefreshResumes: () => void;
  preselectedResumeId?: string;
}

export const AnalyzePage: React.FC<AnalyzePageProps> = ({
  resumes,
  jobs,
  currentUser,
  onAnalysisComplete,
  onRefreshResumes,
  preselectedResumeId,
}) => {
  // Step tracker: 1. Resume, 2. Review Profile, 3. Job & Weights, 4. Running Pipeline
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selected Resume & Job
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    preselectedResumeId || (resumes[0]?.id || '')
  );

  // Search filter for left compartment
  const [resumeSearch, setResumeSearch] = useState('');

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Candidate Profile
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<CandidateProfile | null>(null);

  // Sync selected resume
  useEffect(() => {
    if (preselectedResumeId) {
      setSelectedResumeId(preselectedResumeId);
      const matched = resumes.find(r => r.id === preselectedResumeId);
      if (matched) setActiveProfile(matched.profile);
    } else if (resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0].id);
      setActiveProfile(resumes[0].profile);
    } else if (selectedResumeId) {
      const matched = resumes.find(r => r.id === selectedResumeId);
      if (matched) setActiveProfile(matched.profile);
    }
  }, [resumes, preselectedResumeId, selectedResumeId]);

  // Job Selection & Custom Job
  const [jobMode, setJobMode] = useState<'preset' | 'custom' | 'existing'>('preset');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>(PREDEFINED_JOB_TEMPLATES[0].title);
  const [selectedExistingJobId, setSelectedExistingJobId] = useState<string>(jobs[0]?.id || '');

  const [customJobTitle, setCustomJobTitle] = useState(PREDEFINED_JOB_TEMPLATES[0].title);
  const [customJobCompany, setCustomJobCompany] = useState(PREDEFINED_JOB_TEMPLATES[0].company);
  const [customJobText, setCustomJobText] = useState(PREDEFINED_JOB_TEMPLATES[0].description);
  const [customExperience, setCustomExperience] = useState(PREDEFINED_JOB_TEMPLATES[0].experienceRequired);
  const [customEducation, setCustomEducation] = useState(PREDEFINED_JOB_TEMPLATES[0].educationRequired);
  const [customRequiredSkills, setCustomRequiredSkills] = useState(PREDEFINED_JOB_TEMPLATES[0].requiredSkills.join(', '));

  // Configurable Weights (Must sum to 100)
  const [weights, setWeights] = useState({
    keyword: 30,
    semantic: 30,
    experience: 25,
    formatting: 15,
  });

  // Agent Pipeline Execution
  const [agentProgress, setAgentProgress] = useState<{ stage: number; agentName: string; description: string }>({
    stage: 0,
    agentName: '',
    description: '',
  });

  const selectedResume = resumes.find(r => r.id === selectedResumeId) || (resumes.length > 0 ? resumes[0] : null);

  // Handle Preset Title Selection
  const handleSelectPresetTitle = (title: string) => {
    setSelectedJobTitle(title);
    const template = PREDEFINED_JOB_TEMPLATES.find(p => p.title.toLowerCase() === title.toLowerCase());
    if (template) {
      setCustomJobTitle(template.title);
      setCustomJobCompany(template.company);
      setCustomJobText(template.description);
      setCustomExperience(template.experienceRequired);
      setCustomEducation(template.educationRequired);
      setCustomRequiredSkills(template.requiredSkills.join(', '));
    }
  };

  // Upload handler
  const handleFileUpload = async (file: File) => {
    if (!currentUser) {
      setUploadError('Please sign in or create an account to upload resumes.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    setUploadStatusText('Uploading resume document...');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', currentUser.id);

    try {
      setUploadStatusText('Invoking Agent 1 (Document Parser) & Agent 2 (NLP Extraction)...');

      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.id}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload and parse resume file');
      }

      const data = await response.json();
      setUploadSuccess(`Successfully uploaded and parsed: ${file.name}`);
      onRefreshResumes();
      setSelectedResumeId(data.resume.id);
      setActiveProfile(data.resume.profile);
      
      // Auto advance to Review Profile step
      setTimeout(() => {
        setCurrentStep(2);
      }, 500);

    } catch (err: any) {
      setUploadError(err.message || 'File upload failed');
    } finally {
      setIsUploading(false);
      setUploadStatusText('');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Profile save handler
  const handleSaveProfile = async (updated: CandidateProfile) => {
    if (!selectedResumeId) return;

    try {
      const res = await fetch(`/api/resumes/${selectedResumeId}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser ? `Bearer ${currentUser.id}` : '',
        },
        body: JSON.stringify({ profile: updated, userId: currentUser?.id }),
      });

      if (res.ok) {
        setActiveProfile(updated);
        setIsEditModalOpen(false);
        onRefreshResumes();
      }
    } catch (e) {
      console.error('Error saving updated profile:', e);
    }
  };

  // Run the 7-Agent Screening Pipeline
  const runAgenticAnalysis = async () => {
    if (!selectedResumeId) {
      setUploadError('Please select or upload a resume to evaluate.');
      setCurrentStep(1);
      return;
    }

    setCurrentStep(4);
    setUploadError(null);

    // Agent animation progression
    setAgentProgress({ stage: 1, agentName: 'Resume Parser Agent', description: 'Normalizing document structure and layout syntax...' });
    await new Promise(r => setTimeout(r, 400));

    setAgentProgress({ stage: 2, agentName: 'Information Extraction Agent', description: 'Validating candidate profile, degrees, and ontology skills...' });
    await new Promise(r => setTimeout(r, 450));

    setAgentProgress({ stage: 3, agentName: 'ATS Compatibility Agent', description: 'Computing weighted formula w1K + w2S + w3E + w4F...' });
    await new Promise(r => setTimeout(r, 500));

    setAgentProgress({ stage: 4, agentName: 'Skill Gap Agent', description: 'Analyzing matching, missing, and ontology synonyms...' });
    await new Promise(r => setTimeout(r, 450));

    setAgentProgress({ stage: 5, agentName: 'Job Prediction Agent', description: 'Benchmarking fit across 24+ industry roles...' });
    await new Promise(r => setTimeout(r, 400));

    setAgentProgress({ stage: 6, agentName: 'Recommendation Agent', description: 'Synthesizing evidence-based bullet rewrites and project impact...' });
    await new Promise(r => setTimeout(r, 450));

    try {
      const payload: any = {
        resumeId: selectedResumeId,
        userId: currentUser?.id,
        customWeights: {
          keyword: weights.keyword / 100,
          semantic: weights.semantic / 100,
          experience: weights.experience / 100,
          formatting: weights.formatting / 100,
        },
      };

      if (jobMode === 'existing') {
        payload.jobDescriptionId = selectedExistingJobId;
      } else {
        // Preset or Custom job description
        payload.customJobText = customJobText;
        payload.customJobTitle = customJobTitle || 'Target Position';
        payload.customJobCompany = customJobCompany || 'Target Employer';
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser ? `Bearer ${currentUser.id}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Analysis pipeline failed on server');
      }

      const data = await res.json();
      setAgentProgress({ stage: 7, agentName: 'Report Agent', description: 'Audit complete! Rendering interactive ATS results...' });
      await new Promise(r => setTimeout(r, 300));

      onAnalysisComplete(data.analysis.id);
    } catch (err: any) {
      setUploadError(err.message || 'Analysis error');
      setCurrentStep(3);
    }
  };

  // Filtered resumes for left compartment
  const filteredResumes = resumes.filter(r => {
    const term = resumeSearch.toLowerCase();
    return (
      r.fileName.toLowerCase().includes(term) ||
      (r.profile?.name && r.profile.name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Step Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Resume Screening &amp; ATS Compatibility Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Three-step pipeline: configure candidate resume, review extracted profile, and set target job &amp; weights.
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCurrentStep(1)}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              currentStep === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Resume</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          <button
            onClick={() => { if (selectedResume) setCurrentStep(2); }}
            disabled={!selectedResume}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              currentStep === 2
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>Review Profile</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

          <button
            onClick={() => { if (selectedResume) setCurrentStep(3); }}
            disabled={!selectedResume}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 disabled:opacity-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>Job &amp; Weights</span>
          </button>
        </div>
      </div>

      {/* Upload/Action Alerts */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}
      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Main Grid: Left-Side Compartment + Step Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT-SIDE RESUME / HISTORY COMPARTMENT (4 COLS ON LARGE) */}
        {/* ==================================================================== */}
        <aside className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>My Uploaded Resumes</span>
              </h2>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {resumes.length} resume{resumes.length === 1 ? '' : 's'} in your account
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
              title="Upload another resume"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar inside left compartment */}
          {resumes.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search your resumes..."
                value={resumeSearch}
                onChange={e => setResumeSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
            </div>
          )}

          {/* List of resumes */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredResumes.length > 0 ? (
              filteredResumes.map(r => {
                const isSelected = r.id === selectedResumeId;
                return (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedResumeId(r.id);
                      setActiveProfile(r.profile);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {r.fileType.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={r.fileName}>
                            {r.fileName}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                            {r.profile?.name || 'Parsed Candidate'}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                      <span>{new Date(r.uploadedAt).toLocaleDateString()}</span>
                      {r.lastAnalysisScore !== undefined && (
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          Score: {r.lastAnalysisScore}/100
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400 space-y-2">
                <Upload className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                <p>No resumes uploaded yet in this account.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Upload your first resume
                </button>
              </div>
            )}
          </div>

          {/* Quick upload button in compartment */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
            <span>{isUploading ? 'Parsing Resume...' : '+ Upload Another Resume'}</span>
          </button>
        </aside>

        {/* ==================================================================== */}
        {/* RIGHT WORKSPACE (8 COLS ON LARGE) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: RESUME UPLOAD & SELECTION */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Step 1: Choose or Upload Candidate Resume
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload a PDF, DOCX, or TXT file. Agent 1 will parse raw layout and Agent 2 will extract candidate profile components.
                </p>
              </div>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50/40 dark:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {isUploading ? (
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isUploading ? uploadStatusText || 'Parsing Resume & Extracting Profile...' : 'Drag and drop your resume file here'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  or <span className="text-blue-600 dark:text-blue-400 font-bold underline">browse local files</span> (PDF, DOCX, TXT up to 15MB)
                </p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                  Strict user data isolation active
                </span>
              </div>

              {/* Selected Resume Banner if one is picked */}
              {selectedResume && (
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {selectedResume.fileType.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Selected: {selectedResume.fileName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Candidate: {selectedResume.profile.name} • {selectedResume.profile.email || 'No email specified'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5"
                    >
                      <span>Proceed to Step 2</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: REVIEW EXTRACTED PROFILE */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Step 2: Review Extracted Candidate Profile
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Verify information parsed from <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedResume?.fileName}</span>. Edit any field to ensure maximum scoring fidelity.
                  </p>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile Details</span>
                </button>
              </div>

              {activeProfile ? (
                <div className="space-y-5 text-xs">
                  {/* Candidate Identity */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Candidate Name</span>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{activeProfile.name || 'Not detected'}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email</span>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{activeProfile.email || 'Not detected'}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Phone / Location</span>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        {activeProfile.phone || activeProfile.location || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {/* Skills Summary Tags */}
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
                      Extracted Technical &amp; Domain Skills ({[
                        ...activeProfile.skills.technical,
                        ...activeProfile.skills.languages,
                        ...activeProfile.skills.frameworks,
                        ...activeProfile.skills.tools,
                      ].length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...activeProfile.skills.technical,
                        ...activeProfile.skills.languages,
                        ...activeProfile.skills.frameworks,
                        ...activeProfile.skills.tools,
                      ].map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Education & Experience Previews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Education Records</span>
                      {activeProfile.education.length > 0 ? (
                        activeProfile.education.map((edu, idx) => (
                          <div key={idx} className="pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                            <div className="font-bold text-slate-900 dark:text-white">{edu.degree} in {edu.major}</div>
                            <div className="text-[11px] text-slate-500">{edu.institution} • {edu.year}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs">No formal degree section parsed.</p>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Work Experience</span>
                      {activeProfile.experience.length > 0 ? (
                        activeProfile.experience.map((exp, idx) => (
                          <div key={idx} className="pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                            <div className="font-bold text-slate-900 dark:text-white">{exp.role} @ {exp.company}</div>
                            <div className="text-[11px] text-slate-500">{exp.duration}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs">No experience items parsed.</p>
                      )}
                    </div>
                  </div>

                  {/* Buttons Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      ← Back to Resume Select
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
                    >
                      <span>Proceed to Job &amp; Weights</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>Please select a resume from the left compartment to review.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: TARGET JOB & ATS WEIGHTS */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Step 3: Target Job Description &amp; Formula Weights
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose from 12+ preconfigured job titles, paste any custom job description, and fine-tune ATS scoring weights.
                </p>
              </div>

              {/* Job Selector Mode */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <button
                    type="button"
                    onClick={() => setJobMode('preset')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobMode === 'preset'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    12 Preconfigured Job Titles
                  </button>
                  <button
                    type="button"
                    onClick={() => setJobMode('custom')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      jobMode === 'custom'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    Paste Any Custom Description
                  </button>
                  {jobs.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setJobMode('existing')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        jobMode === 'existing'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      Saved Job Repository ({jobs.length})
                    </button>
                  )}
                </div>

                {/* Preconfigured Job Title Dropdown */}
                {jobMode === 'preset' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Select Predefined Job Title:
                    </label>
                    <select
                      value={selectedJobTitle}
                      onChange={e => handleSelectPresetTitle(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {PREDEFINED_JOB_TEMPLATES.map(tmpl => (
                        <option key={tmpl.id} value={tmpl.title}>
                          {tmpl.title} ({tmpl.category})
                        </option>
                      ))}
                    </select>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                        <span>{customJobTitle}</span>
                        <span className="text-blue-600 dark:text-blue-400">{customJobCompany}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-3">
                        {customJobText}
                      </p>
                      <div className="text-[11px] text-slate-400 pt-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Required Skills: </span>
                        {customRequiredSkills}
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Job Paste Zone */}
                {jobMode === 'custom' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Job Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Machine Learning Engineer"
                          value={customJobTitle}
                          onChange={e => setCustomJobTitle(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme AI Corp"
                          value={customJobCompany}
                          onChange={e => setCustomJobCompany(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                        Paste Full Job Description / Responsibilities / Requirements
                      </label>
                      <textarea
                        rows={7}
                        value={customJobText}
                        onChange={e => setCustomJobText(e.target.value)}
                        placeholder="Paste any job posting text from LinkedIn, Indeed, or company careers page..."
                        className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Saved Existing Jobs */}
                {jobMode === 'existing' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Select From Saved Target Jobs:
                    </label>
                    <select
                      value={selectedExistingJobId}
                      onChange={e => setSelectedExistingJobId(e.target.value)}
                      className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {jobs.map(j => (
                        <option key={j.id} value={j.id}>
                          {j.title} • {j.company} ({j.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Configurable ATS Weights */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Configurable ATS Formula Weights</span>
                  </h3>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    Total: {weights.keyword + weights.semantic + weights.experience + weights.formatting}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Keywords</span>
                      <span className="text-blue-600">{weights.keyword}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={weights.keyword}
                      onChange={e => setWeights({ ...weights, keyword: Number(e.target.value) })}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Semantic</span>
                      <span className="text-indigo-600">{weights.semantic}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={weights.semantic}
                      onChange={e => setWeights({ ...weights, semantic: Number(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Experience</span>
                      <span className="text-emerald-600">{weights.experience}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      value={weights.experience}
                      onChange={e => setWeights({ ...weights, experience: Number(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>Formatting</span>
                      <span className="text-purple-600">{weights.formatting}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      value={weights.formatting}
                      onChange={e => setWeights({ ...weights, formatting: Number(e.target.value) })}
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  ← Back to Profile Review
                </button>

                <button
                  onClick={runAgenticAnalysis}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Execute 7-Agent Screening Pipeline</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: RUNNING 7-AGENT PIPELINE ANIMATION */}
          {currentStep === 4 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-md">
                <RefreshCw className="w-10 h-10 animate-spin" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Agent {agentProgress.stage} of 7 Active
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {agentProgress.agentName || 'Initializing Screening Pipeline...'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {agentProgress.description || 'Coordinating agentic AI analysis...'}
                </p>
              </div>

              {/* Progress visual steps */}
              <div className="max-w-md mx-auto grid grid-cols-7 gap-1.5 pt-2">
                {[1, 2, 3, 4, 5, 6, 7].map(stepNum => (
                  <div
                    key={stepNum}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stepNum <= agentProgress.stage ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Editable Profile Modal */}
      {isEditModalOpen && activeProfile && (
        <EditableProfileModal
          profile={activeProfile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

    </div>
  );
};
