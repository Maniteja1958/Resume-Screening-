import React, { useState } from 'react';
import { CandidateProfile } from '../types';
import { X, Save, Plus, Trash2, User, BookOpen, Briefcase, Code, Award } from 'lucide-react';

interface EditableProfileModalProps {
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: CandidateProfile) => void;
}

export const EditableProfileModal: React.FC<EditableProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CandidateProfile>(JSON.parse(JSON.stringify(profile)));
  const [activeTab, setActiveTab] = useState<'personal' | 'skills' | 'experience' | 'education' | 'projects'>('personal');

  if (!isOpen) return null;

  const handleSkillsChange = (category: keyof CandidateProfile['skills'], rawString: string) => {
    const list = rawString.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: list,
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Parsed Candidate Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verify and adjust extracted resume details before or after ATS screening.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'personal'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Personal &amp; Summary
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" /> Skills &amp; Stack
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'experience'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Work Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'education'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Education
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" /> Projects
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedin || ''}
                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={formData.github || formData.portfolio || ''}
                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Professional Summary / Objective</label>
                <textarea
                  rows={4}
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Programming Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.languages.join(', ')}
                  onChange={e => handleSkillsChange('languages', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frameworks &amp; Libraries (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.frameworks.join(', ')}
                  onChange={e => handleSkillsChange('frameworks', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tools, Cloud &amp; Databases (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.tools.join(', ')}
                  onChange={e => handleSkillsChange('tools', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Technical Competencies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.technical.join(', ')}
                  onChange={e => handleSkillsChange('technical', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Soft Skills &amp; Leadership (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.soft.join(', ')}
                  onChange={e => handleSkillsChange('soft', e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Role #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = formData.experience.filter((_, i) => i !== idx);
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Role Title"
                      value={exp.role}
                      onChange={e => {
                        const updated = [...formData.experience];
                        updated[idx].role = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={e => {
                        const updated = [...formData.experience];
                        updated[idx].company = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2022 - Present)"
                      value={exp.duration}
                      onChange={e => {
                        const updated = [...formData.experience];
                        updated[idx].duration = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Key responsibilities and achievements (one per line)"
                    value={exp.responsibilities.join('\n')}
                    onChange={e => {
                      const updated = [...formData.experience];
                      updated[idx].responsibilities = e.target.value.split('\n').filter(Boolean);
                      setFormData({ ...formData, experience: updated });
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    experience: [
                      ...formData.experience,
                      { company: "Company Name", role: "Software Engineer", duration: "2023 – Present", responsibilities: ["Led development of key features."] }
                    ]
                  });
                }}
                className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Experience Entry
              </button>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={e => {
                      const updated = [...formData.education];
                      updated[idx].institution = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Degree (e.g. Bachelor of Science)"
                    value={edu.degree}
                    onChange={e => {
                      const updated = [...formData.education];
                      updated[idx].degree = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Major"
                    value={edu.major}
                    onChange={e => {
                      const updated = [...formData.education];
                      updated[idx].major = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year (e.g. 2022)"
                    value={edu.year}
                    onChange={e => {
                      const updated = [...formData.education];
                      updated[idx].year = e.target.value;
                      setFormData({ ...formData, education: updated });
                    }}
                    className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (comma-separated)"
                      value={proj.technologies.join(', ')}
                      onChange={e => {
                        const updated = [...formData.projects];
                        updated[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Project description & quantifiable business impact"
                    value={proj.description}
                    onChange={e => {
                      const updated = [...formData.projects];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" /> Save Candidate Profile
          </button>
        </div>

      </div>
    </div>
  );
};
