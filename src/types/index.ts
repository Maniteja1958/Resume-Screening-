export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
    frameworks: string[];
    languages: string[];
  };
  education: {
    institution: string;
    degree: string;
    major: string;
    year: string;
    gpa?: string;
  }[];
  experience: {
    company: string;
    role: string;
    location?: string;
    duration: string;
    startDate?: string;
    endDate?: string;
    responsibilities: string[];
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    link?: string;
    impact?: string;
  }[];
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export interface JobDescription {
  id: string;
  userId?: string; // Optional: system presets have 'system' or undefined, user custom jobs have user's id
  title: string;
  company: string;
  location?: string;
  category: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceRequired: number; // in years
  educationRequired: string;
  createdAt: string;
}

export interface ATSWeights {
  keyword: number;     // e.g. 0.30
  semantic: number;    // e.g. 0.30
  experience: number;  // e.g. 0.25
  formatting: number;  // e.g. 0.15
}

export interface FormattingCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: 'pass' | 'warning' | 'info';
  message: string;
}

export interface KeywordMatchItem {
  name: string;
  category: string;
  foundInResume: boolean;
  frequency: number;
}

export interface PredictedRole {
  role: string;
  score: number; // 0 - 100
  category: string;
  matchingPoints: string[];
  missingPoints: string[];
  reason: string;
}

export interface RecommendationSet {
  resumeImprovements: string[];
  missingKeywordsSuggestions: {
    keyword: string;
    suggestion: string;
    reason: string;
    category: string;
  }[];
  projectImprovements: {
    projectTitle: string;
    suggestedTitle?: string;
    techToMention: string[];
    impactAdvice: string;
    rewrittenBullet: string;
  }[];
  experienceImprovements: {
    role: string;
    actionVerbs: string[];
    metricSuggestions: string[];
    rewrittenBullet: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  executiveSummary: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  resumeId: string;
  resumeName: string;
  jobDescriptionId: string;
  jobTitle: string;
  company: string;
  atsScore: number;
  keywordScore: number;
  semanticScore: number;
  experienceScore: number;
  formattingScore: number;
  weights: ATSWeights;
  keywordDetails: {
    matched: KeywordMatchItem[];
    missing: KeywordMatchItem[];
    totalRequired: number;
    matchRate: number;
    reason: string;
  };
  semanticDetails: {
    similarityScore: number;
    keyThemesDetected: string[];
    reason: string;
  };
  experienceDetails: {
    qualificationFit: number;
    experienceFit: number;
    requiredYears: number;
    detectedYears: number;
    educationSatisfied: boolean;
    satisfiedRequirements: string[];
    missingRequirements: string[];
    reason: string;
  };
  formattingDetails: {
    score: number;
    checks: FormattingCheck[];
    summary: string;
  };
  skillGap: {
    matchingSkills: string[];
    missingSkills: string[];
    additionalSkills: string[];
    gapPercentage: number;
  };
  predictedRoles: PredictedRole[];
  recommendations: RecommendationSet;
  profileSnapshot: CandidateProfile;
  createdAt: string;
}

export interface ResumeRecord {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: 'pdf' | 'docx' | 'txt';
  version: number;
  rawText: string;
  profile: CandidateProfile;
  uploadedAt: string;
  lastAnalysisScore?: number;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  defaultWeights: ATSWeights;
  defaultCategory?: string;
  notificationsEnabled?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  passwordHash?: string;
  settings?: UserSettings;
}
