import React, { useState } from 'react';
import { JobDescription, User } from '../types';
import { PREDEFINED_JOB_TEMPLATES } from '../ai/knowledge/predefinedJobs';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Clock,
  BookOpen,
  X,
  Save,
  Search,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface JobsPageProps {
  jobs: JobDescription[];
  currentUser: User | null;
  onRefresh: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  jobs,
  currentUser,
  onRefresh,
  onNavigate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuickPreset, setSelectedQuickPreset] = useState<string>('');

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Remote',
    category: 'Software Engineering',
    experienceRequired: 2,
    educationRequired: "Bachelor's Degree",
    requiredSkills: '',
    preferredSkills: '',
    description: '',
  });

  // Handle preset dropdown selection
  const handleSelectPredefinedTitle = (title: string) => {
    setSelectedQuickPreset(title);
    if (!title) return;

    const tmpl = PREDEFINED_JOB_TEMPLATES.find(p => p.title.toLowerCase() === title.toLowerCase());
    if (tmpl) {
      setJobForm({
        title: tmpl.title,
        company: tmpl.company,
        location: tmpl.location,
        category: tmpl.category,
        experienceRequired: tmpl.experienceRequired,
        educationRequired: tmpl.educationRequired,
        requiredSkills: tmpl.requiredSkills.join(', '),
        preferredSkills: tmpl.preferredSkills.join(', '),
        description: tmpl.description,
      });
      setEditingJobId(null);
      setIsModalOpen(true);
    }
  };

  const handleOpenAddModal = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      company: '',
      location: 'Remote',
      category: 'Software Engineering',
      experienceRequired: 2,
      educationRequired: "Bachelor's Degree",
      requiredSkills: '',
      preferredSkills: '',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: JobDescription) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location || 'Remote',
      category: job.category,
      experienceRequired: job.experienceRequired,
      educationRequired: job.educationRequired,
      requiredSkills: job.requiredSkills.join(', '),
      preferredSkills: job.preferredSkills ? job.preferredSkills.join(', ') : '',
      description: job.description,
    });
    setIsModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) return;

    try {
      const url = editingJobId ? `/api/jobs/${editingJobId}` : '/api/jobs';
      const method = editingJobId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser ? `Bearer ${currentUser.id}` : '',
        },
        body: JSON.stringify({
          ...jobForm,
          userId: currentUser?.id,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!currentUser) return;
    if (confirm(`Are you sure you want to delete the job description "${title}"?`)) {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${currentUser.id}`,
          },
        });
        if (res.ok) {
          onRefresh();
        }
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    const term = searchTerm.toLowerCase();
    const skills = [...j.requiredSkills, ...(j.preferredSkills || [])].join(' ').toLowerCase();
    return (
      j.title.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      j.category.toLowerCase().includes(term) ||
      skills.includes(term)
    );
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Target Job Descriptions ({jobs.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Predefined industry benchmark roles and custom job descriptions used for ATS scoring and skill gap evaluation.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Job</span>
        </button>
      </div>

      {/* Preset Title Dropdown & Search Bar Box */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Quick Predefined Job Title Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Load &amp; Customize a Predefined Job Role:
            </label>
            <div className="relative">
              <select
                value={selectedQuickPreset}
                onChange={e => handleSelectPredefinedTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Choose from 12 Predefined Job Titles --</option>
                {PREDEFINED_JOB_TEMPLATES.map(p => (
                  <option key={p.id} value={p.title}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[10px] text-slate-400">
              Selecting a role auto-loads requirements, education, and required skills for editing.
            </span>
          </div>

          {/* Search Bar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Search Target Positions:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by title, company, or required skill..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs shadow-2xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map(j => {
          const isSystem = !j.userId || j.userId === 'system';
          const isOwner = currentUser && j.userId === currentUser.id;

          return (
            <div
              key={j.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate" title={j.title}>
                        {j.title}
                      </h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {j.company} • {j.location || 'United States'}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    isSystem 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' 
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {isSystem ? 'System Preset' : 'Custom Job'}
                  </span>
                </div>

                {/* Details */}
                <div className="py-3 space-y-3 text-xs">
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-3 leading-relaxed">
                    {j.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{j.experienceRequired}+ years exp</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{j.educationRequired}</span>
                    </div>
                  </div>

                  {/* Required Skills Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Required Skills ({j.requiredSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {j.requiredSkills.slice(0, 6).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/60"
                        >
                          {s}
                        </span>
                      ))}
                      {j.requiredSkills.length > 6 && (
                        <span className="text-[10px] text-slate-400 font-bold self-center">
                          +{j.requiredSkills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(j)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    title={isSystem ? "Customize this preset job" : "Edit your job posting"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {!isSystem && isOwner && (
                    <button
                      onClick={() => handleDelete(j.id, j.title)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete job description"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('analyze')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Against Job</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {editingJobId ? 'Edit Target Job Description' : 'Add New Target Job'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom positions are saved directly to your account for ATS compatibility scoring.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Machine Learning Engineer"
                    value={jobForm.title}
                    onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech Labs"
                    value={jobForm.company}
                    onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA (or Remote)"
                    value={jobForm.location}
                    onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. AI & Machine Learning"
                    value={jobForm.category}
                    onChange={e => setJobForm({ ...jobForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Required (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    value={jobForm.experienceRequired}
                    onChange={e => setJobForm({ ...jobForm, experienceRequired: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Education Required</label>
                  <input
                    type="text"
                    placeholder="e.g. Bachelor's in Computer Science"
                    value={jobForm.educationRequired}
                    onChange={e => setJobForm({ ...jobForm, educationRequired: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Required Skills (Comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Python, PyTorch, Docker, SQL, Machine Learning"
                  value={jobForm.requiredSkills}
                  onChange={e => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred / Bonus Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Kubernetes, AWS, Transformers, MLflow"
                  value={jobForm.preferredSkills}
                  onChange={e => setJobForm({ ...jobForm, preferredSkills: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Job Description &amp; Responsibilities *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Paste or write the complete job description..."
                  value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Job Description
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
