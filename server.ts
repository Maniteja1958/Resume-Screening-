import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { db } from './server/db';
import { isGeminiAvailable } from './server/gemini';
import { parseResumeFile } from './src/ai/agents/parserAgent';
import { extractCandidateProfile } from './src/ai/agents/extractionAgent';
import { evaluateAtsCompatibility } from './src/ai/agents/atsAgent';
import { analyzeSkillGap } from './src/ai/agents/skillGapAgent';
import { predictJobRoles } from './src/ai/agents/predictionAgent';
import { generateRecommendations } from './src/ai/agents/recommendationAgent';
import { generatePdfReport } from './src/ai/agents/reportAgent';
import { parseJobDescriptionText } from './src/ai/agents/jobParser';
import { BENCHMARK_DATASETS, EVALUATION_RESULTS, CONFUSION_MATRIX_SAMPLES } from './src/ai/ml/benchmark';
import { AnalysisResult, JobDescription, ResumeRecord } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsers
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer memory storage for resume uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.docx', '.txt'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT resume files are accepted.'));
    }
  },
});

// Helper: Extract userId from Bearer token, query param, or body
function getRequestUserId(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }
  if (req.query.userId && typeof req.query.userId === 'string' && req.query.userId.trim()) {
    return req.query.userId.trim();
  }
  if (req.body && req.body.userId && typeof req.body.userId === 'string' && req.body.userId.trim()) {
    return req.body.userId.trim();
  }
  return undefined;
}

// --------------------------------------------------------------------------
// API Routes
// --------------------------------------------------------------------------

// 1. Health & System Status
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    llmEngine: isGeminiAvailable() ? 'Gemini 3.8 Flash (Active)' : 'Deterministic Knowledge-Base Fallback (Active)',
    geminiConfigured: isGeminiAvailable(),
  });
});

// 2. Authentication & User Management
app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No active session' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or user not found' });
  }

  const settings = db.getUserSettings(userId);
  res.json({ user, settings });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  if (!password || !password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Demo user quick login
  if (cleanEmail === 'demo@resumescreen.ai') {
    const demoUser = db.getUserByEmail('demo@resumescreen.ai') || db.createUser('Dr. Alex Rivera', 'demo@resumescreen.ai', 'demo123');
    return res.json({
      user: demoUser,
      token: demoUser.id,
      message: 'Logged in successfully as Demo User (Dr. Alex Rivera)',
    });
  }

  const user = db.authenticate(cleanEmail, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password. Please verify your credentials or create an account.' });
  }

  res.json({
    user,
    token: user.id,
    message: 'Logged in successfully',
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const existing = db.getUserByEmail(cleanEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
  }

  const cleanName = (name && name.trim()) ? name.trim() : cleanEmail.split('@')[0];
  const user = db.createUser(cleanName, cleanEmail, password);
  res.json({
    user,
    token: user.id,
    message: 'Registration successful! Welcome to ScreenAI.',
  });
});

app.post('/api/auth/demo', (req: Request, res: Response) => {
  const demoUser = db.getUserByEmail('demo@resumescreen.ai') || db.createUser('Dr. Alex Rivera', 'demo@resumescreen.ai', 'demo123');
  res.json({
    user: demoUser,
    token: demoUser.id,
    message: 'Demo mode activated',
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/settings', (req: Request, res: Response) => {
  const userId = getRequestUserId(req) || req.body.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const newSettings = req.body.settings || req.body;
  const updated = db.saveUserSettings(userId, newSettings);
  res.json({ settings: updated, message: 'Settings saved successfully' });
});

// 3. Resumes (Strictly User-Scoped)
app.get('/api/resumes', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  if (!userId) {
    return res.json({ resumes: [] });
  }
  const resumes = db.getResumes(userId);
  res.json({ resumes });
});

app.get('/api/resumes/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const resume = db.getResumeById(req.params.id, userId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json({ resume });
});

// Multipart Upload -> Agent 1 (Parser) -> Agent 2 (Extraction)
app.post('/api/resumes/upload', upload.single('resume'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const userId = getRequestUserId(req) || (req.body.userId as string);
    if (!userId) {
      return res.status(401).json({ error: 'You must be logged in to upload resumes.' });
    }

    const { originalname, buffer, size, mimetype } = req.file;

    // Agent 1: Parse File to Text
    const parseResult = await parseResumeFile(buffer, originalname, mimetype);

    // Agent 2: Extract structured profile
    const profile = extractCandidateProfile(parseResult.rawText, originalname.replace(/\.[^/.]+$/, ""));

    const ext = path.extname(originalname).toLowerCase().replace('.', '') as 'pdf' | 'docx' | 'txt';

    const resumeRecord: ResumeRecord = {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      fileName: originalname,
      fileSize: size,
      fileType: ['pdf', 'docx', 'txt'].includes(ext) ? ext : 'pdf',
      version: 1,
      rawText: parseResult.rawText,
      profile,
      uploadedAt: new Date().toISOString(),
    };

    db.saveResume(resumeRecord);

    res.json({
      resume: resumeRecord,
      parseDetails: parseResult,
      message: 'Resume parsed and candidate profile extracted successfully',
    });
  } catch (error: any) {
    console.error('Upload & parsing error:', error);
    res.status(500).json({ error: error.message || 'Failed to parse resume file' });
  }
});

// Update Extracted Profile
app.post('/api/resumes/:id/profile', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const resume = db.getResumeById(req.params.id, userId);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const updatedProfile = req.body.profile;
  if (!updatedProfile) {
    return res.status(400).json({ error: 'Profile data required' });
  }

  resume.profile = updatedProfile;
  db.saveResume(resume);

  res.json({ resume, message: 'Profile updated successfully' });
});

app.delete('/api/resumes/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const success = db.deleteResume(req.params.id, userId);
  if (!success) {
    return res.status(404).json({ error: 'Resume not found or you do not have permission to delete it' });
  }
  res.json({ message: 'Resume and related analyses deleted successfully' });
});

// 4. Job Descriptions (System Presets + User Custom Jobs)
app.get('/api/jobs', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  res.json({ jobs: db.getJobs(userId) });
});

app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const job = db.getJobById(req.params.id, userId);
  if (!job) {
    return res.status(404).json({ error: 'Job description not found' });
  }
  res.json({ job });
});

app.post('/api/jobs', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const { title, company, category, description, requiredSkills, preferredSkills, experienceRequired, educationRequired, location } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Job title and description are required' });
  }

  const reqSkillsList = Array.isArray(requiredSkills) 
    ? requiredSkills 
    : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : []);

  const prefSkillsList = Array.isArray(preferredSkills) 
    ? preferredSkills 
    : (typeof preferredSkills === 'string' ? preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : []);

  const newJob: JobDescription = {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId: userId || 'system',
    title: title.trim(),
    company: company ? company.trim() : "Target Employer",
    location: location ? location.trim() : "United States",
    category: category ? category.trim() : "Technology",
    description: description.trim(),
    requiredSkills: reqSkillsList.length > 0 ? reqSkillsList : ["Problem Solving", "Communication", "Technical Knowledge"],
    preferredSkills: prefSkillsList,
    experienceRequired: Number(experienceRequired) || 2,
    educationRequired: educationRequired || "Bachelor's Degree",
    createdAt: new Date().toISOString(),
  };

  db.saveJob(newJob, userId);
  res.json({ job: newJob, message: 'Job description saved successfully' });
});

app.put('/api/jobs/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const existing = db.getJobById(req.params.id, userId);
  if (!existing) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const { title, company, category, description, requiredSkills, preferredSkills, experienceRequired, educationRequired, location } = req.body;

  const reqSkillsList = Array.isArray(requiredSkills) 
    ? requiredSkills 
    : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : existing.requiredSkills);

  const prefSkillsList = Array.isArray(preferredSkills) 
    ? preferredSkills 
    : (typeof preferredSkills === 'string' ? preferredSkills.split(',').map(s => s.trim()).filter(Boolean) : existing.preferredSkills);

  // If user is editing a system preset job, clone as a custom job for this user so preset stays pristine
  const isSystemJob = !existing.userId || existing.userId === 'system';
  const targetId = isSystemJob ? `job_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` : existing.id;

  const updatedJob: JobDescription = {
    ...existing,
    id: targetId,
    userId: userId || existing.userId || 'system',
    title: title !== undefined ? title : existing.title,
    company: company !== undefined ? company : existing.company,
    category: category !== undefined ? category : existing.category,
    description: description !== undefined ? description : existing.description,
    location: location !== undefined ? location : existing.location,
    requiredSkills: reqSkillsList,
    preferredSkills: prefSkillsList,
    experienceRequired: experienceRequired !== undefined ? Number(experienceRequired) : existing.experienceRequired,
    educationRequired: educationRequired !== undefined ? educationRequired : existing.educationRequired,
  };

  db.saveJob(updatedJob, userId);
  res.json({ job: updatedJob, message: 'Job description saved successfully' });
});

app.delete('/api/jobs/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const success = db.deleteJob(req.params.id, userId);
  if (!success) {
    return res.status(403).json({ error: 'Cannot delete system predefined jobs or unauthorized' });
  }
  res.json({ message: 'Job deleted successfully' });
});

// Dynamic Job Description Parsing endpoint
app.post('/api/jobs/parse', (req: Request, res: Response) => {
  const { text, title, company } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Job description text is required' });
  }

  const parsedJob = parseJobDescriptionText(text, title, company);
  res.json({
    job: parsedJob,
    message: 'Job description parsed successfully'
  });
});

// 5. Full Agentic Analysis Pipeline
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const userId = getRequestUserId(req);
    const { resumeId, jobDescriptionId, customWeights, customJobText, customJobTitle, customJobCompany } = req.body;

    let resume = db.getResumeById(resumeId, userId);
    if (!resume) {
      // If not found with user check, verify if any resume exists for this user
      const userResumes = db.getResumes(userId);
      if (userResumes.length > 0) {
        resume = userResumes[0];
      } else {
        return res.status(400).json({ error: 'Please upload a resume first to run the analysis.' });
      }
    }

    let job: JobDescription | undefined;
    if (customJobText && typeof customJobText === 'string' && customJobText.trim().length > 0) {
      // Parse ANY user-provided job description dynamically!
      const parsedJob = parseJobDescriptionText(customJobText, customJobTitle, customJobCompany);
      parsedJob.userId = userId || 'system';
      job = db.saveJob(parsedJob, userId);
    } else if (jobDescriptionId) {
      job = db.getJobById(jobDescriptionId, userId);
    }

    if (!job) {
      const allJobs = db.getJobs(userId);
      job = allJobs[0];
    }

    // Agent 3: ATS Compatibility Engine
    const atsEval = evaluateAtsCompatibility(
      resume.profile,
      resume.rawText,
      job,
      customWeights,
      resume.fileName
    );

    // Agent 4: Skill Gap Analysis
    const skillGap = analyzeSkillGap(resume.profile, job);

    // Agent 5: Intelligent Job Role Prediction
    const predictedRoles = predictJobRoles(resume.profile, resume.rawText, 5);

    // Agent 6: Personalized Recommendations (Gemini or Deterministic)
    const apiKey = process.env.GEMINI_API_KEY;
    const recommendations = await generateRecommendations(
      resume.profile,
      job,
      atsEval,
      skillGap,
      apiKey
    );

    // Update resume record last analysis score
    resume.lastAnalysisScore = atsEval.atsScore;
    db.saveResume(resume);

    // Create Analysis Record strictly scoped to current user
    const analysis: AnalysisResult = {
      id: `ana_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: userId || resume.userId,
      resumeId: resume.id,
      resumeName: resume.fileName,
      jobDescriptionId: job.id,
      jobTitle: job.title,
      company: job.company,
      atsScore: atsEval.atsScore,
      keywordScore: atsEval.keywordScore,
      semanticScore: atsEval.semanticScore,
      experienceScore: atsEval.experienceScore,
      formattingScore: atsEval.formattingScore,
      weights: atsEval.weights,
      keywordDetails: atsEval.keywordDetails,
      semanticDetails: atsEval.semanticDetails,
      experienceDetails: atsEval.experienceDetails,
      formattingDetails: atsEval.formattingDetails,
      skillGap: {
        matchingSkills: skillGap.matchingSkills,
        missingSkills: skillGap.missingSkills,
        additionalSkills: skillGap.additionalSkills,
        gapPercentage: skillGap.gapPercentage,
      },
      predictedRoles,
      recommendations,
      profileSnapshot: resume.profile,
      createdAt: new Date().toISOString(),
    };

    db.saveAnalysis(analysis);

    res.json({
      analysis,
      message: 'Analysis completed successfully',
    });
  } catch (error: any) {
    console.error('Analysis pipeline execution error:', error);
    res.status(500).json({ error: error.message || 'Analysis pipeline failed' });
  }
});

app.get('/api/analyses', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  if (!userId) {
    return res.json({ analyses: [] });
  }
  res.json({ analyses: db.getAnalyses(userId) });
});

app.get('/api/analyses/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const analysis = db.getAnalysisById(req.params.id, userId);
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis record not found' });
  }
  res.json({ analysis });
});

app.delete('/api/analyses/:id', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const success = db.deleteAnalysis(req.params.id, userId);
  if (!success) {
    return res.status(404).json({ error: 'Analysis record not found or unauthorized' });
  }
  res.json({ message: 'Analysis record deleted successfully' });
});

// 6. Resume Version Comparison Endpoint
app.post('/api/compare', (req: Request, res: Response) => {
  const userId = getRequestUserId(req);
  const { resumeId1, resumeId2, jobDescriptionId } = req.body;

  const resume1 = db.getResumeById(resumeId1, userId);
  const resume2 = db.getResumeById(resumeId2, userId);

  if (!resume1 || !resume2) {
    return res.status(400).json({ error: 'Two valid resumes belonging to your account are required for comparison' });
  }

  const job = db.getJobById(jobDescriptionId, userId) || db.getJobs(userId)[0];

  const eval1 = evaluateAtsCompatibility(resume1.profile, resume1.rawText, job);
  const eval2 = evaluateAtsCompatibility(resume2.profile, resume2.rawText, job);

  const gap1 = analyzeSkillGap(resume1.profile, job);
  const gap2 = analyzeSkillGap(resume2.profile, job);

  // Calculate delta
  const atsDiff = eval2.atsScore - eval1.atsScore;
  const keywordDiff = eval2.keywordScore - eval1.keywordScore;
  const semanticDiff = eval2.semanticScore - eval1.semanticScore;
  const experienceDiff = eval2.experienceScore - eval1.experienceScore;
  const formattingDiff = eval2.formattingScore - eval1.formattingScore;

  // New skills acquired in version 2
  const skillsV1 = new Set([...resume1.profile.skills.technical, ...resume1.profile.skills.languages, ...resume1.profile.skills.frameworks]);
  const newlyAddedSkills = [...resume2.profile.skills.technical, ...resume2.profile.skills.languages, ...resume2.profile.skills.frameworks]
    .filter(s => !skillsV1.has(s));

  res.json({
    job,
    version1: {
      resume: resume1,
      evaluation: eval1,
      skillGap: gap1,
    },
    version2: {
      resume: resume2,
      evaluation: eval2,
      skillGap: gap2,
    },
    deltas: {
      atsDiff,
      keywordDiff,
      semanticDiff,
      experienceDiff,
      formattingDiff,
      newlyAddedSkills,
      improved: atsDiff >= 0,
    }
  });
});

// 7. PDF Report Generation & Download (Agent 7)
app.get('/api/reports/:id/pdf', (req: Request, res: Response) => {
  try {
    const analysis = db.getAnalysisById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found' });
    }

    const doc = generatePdfReport(analysis);
    const pdfOutput = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);

    const safeFilename = `AI_ATS_Report_${analysis.profileSnapshot.name.replace(/[^a-zA-Z0-9]/g, '_')}_${analysis.id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err: any) {
    console.error('PDF report error:', err);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

// 8. ML Benchmarks
app.get('/api/ml/benchmarks', (req: Request, res: Response) => {
  res.json({
    datasets: BENCHMARK_DATASETS,
    models: EVALUATION_RESULTS,
    confusionMatrix: CONFUSION_MATRIX_SAMPLES,
  });
});

// --------------------------------------------------------------------------
// Start Server with Vite Middleware in Development
// --------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve('dist'))) {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    // In dev mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running and listening on http://0.0.0.0:${PORT}`);
    console.log(`LLM Engine: ${isGeminiAvailable() ? 'Gemini 3.8 Flash' : 'Deterministic Rule Engine'}`);
  });
}

startServer();
