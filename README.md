# Agentic AI-Powered Resume Screening & Intelligent Job Role Prediction System

An enterprise-grade, candidate-oriented AI resume analysis, ATS scoring, skill-gap detection, and multi-career role prediction platform built on research-grounded NLP and cooperating agent architectures.

---

## 🌟 Key Features

1. **7 Cooperating AI Agents Architecture**:
   - **Agent 1 — Resume Parser Agent**: Multi-format stream parsing for PDF, DOCX, and TXT documents.
   - **Agent 2 — Information Extraction Agent**: Structured profile extraction (contact details, technical skills, soft skills, education, career timelines, projects, certifications).
   - **Agent 3 — ATS Compatibility Agent**: Weighted formula score $ATS = w_1 K + w_2 S + w_3 E + w_4 F$ with full transparency explanations.
   - **Agent 4 — Skill Gap Agent**: Tri-category classification (Matching Skills, Missing Required Skills, Additional Strengths) with exact Skill Gap % calculation.
   - **Agent 5 — Job Role Prediction Agent**: Evaluates profile across 24+ industry career roles with relevance % scores and evidence-grounded rationale.
   - **Agent 6 — Recommendation Agent**: Dual-engine generation (Gemini 3.8 Flash LLM augmented + deterministic knowledge-base fallback) for project impact rewrites, experience metrics, and ethical keyword guidance.
   - **Agent 7 — Report Agent (PDF Engine)**: Server & client downloadable multi-page PDF audit reports.

2. **Skills Ontology & Synonym Knowledge Base**:
   - Hierarchical relations (e.g. Scikit-learn satisfies Machine Learning; PyTorch maps to Deep Learning).
   - Normalization of common industry aliases (e.g. `k8s` -> `Kubernetes`, `py` -> `Python`, `ts` -> `TypeScript`).

3. **Resume Version Comparison**:
   - Side-by-side comparison of baseline vs revised resume versions against a target job.
   - Live delta tracking: ATS score points gained, keyword match improvements, and newly acquired skills.

4. **Interactive Dashboard & Visualizations**:
   - Circular SVG ATS progress gauge.
   - 4-Pillar Radar web chart.
   - Job role prediction horizontal bars.
   - Editable structured profile preview before or after analysis.

5. **Responsible & Fair AI**:
   - No evaluation of protected demographic attributes (age, race, religion, gender, location).
   - Clear ethical disclaimers that analysis is for candidate empowerment and guidance.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas-Confetti.
- **Backend**: Node.js, Express, Multer (memory file handling).
- **AI & NLP**: `@google/genai` (Gemini 3.8 Flash), TF-IDF Cosine Vectorizer, Skills Ontology Engine.
- **Document Processing**: `pdf-parse`, `mammoth` (DOCX), `jspdf` (multi-page PDF report generation).
- **Storage**: Persistent JSON database (`data/database.json`) with pre-seeded demo users, resumes, jobs, and audits.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18+ or 20+
- npm

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` (or configure secrets in AI Studio):
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is set if you want LLM-enhanced recommendations. If not set, the platform will automatically run its deterministic rule engine without errors.

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🧪 Running the Verification Test Suite

Run the full end-to-end verification test suite covering all 7 agents, ATS formulas, skill gap calculations, role predictions, and PDF reporting:
```bash
npm test
```

---

## 📂 Project Structure

```
├── data/                      # Persistent database & benchmark files
├── scripts/                   # Dataset import & taxonomy scripts
│   ├── import-job-skills.ts
│   ├── import-onet.ts
│   ├── import-resumes.ts
│   └── import-job-postings.ts
├── server/
│   ├── db.ts                  # Persistent file-backed database manager & seeds
│   └── gemini.ts              # Server-side Gemini client wrapper
├── src/
│   ├── ai/
│   │   ├── agents/            # 7 Cooperating AI Agents
│   │   │   ├── parserAgent.ts
│   │   │   ├── extractionAgent.ts
│   │   │   ├── atsAgent.ts
│   │   │   ├── skillGapAgent.ts
│   │   │   ├── predictionAgent.ts
│   │   │   ├── recommendationAgent.ts
│   │   │   └── reportAgent.ts
│   │   ├── knowledge/         # Skills Ontology & 24+ Role Taxonomy
│   │   │   ├── skillsOntology.ts
│   │   │   └── jobRolesDatabase.ts
│   │   └── ml/                # Benchmark models & metrics
│   │       └── benchmark.ts
│   ├── components/            # Reusable UI components
│   │   ├── AtsGauge.tsx
│   │   ├── RadarChart.tsx
│   │   ├── SkillGapCard.tsx
│   │   ├── EditableProfileModal.tsx
│   │   ├── ResponsibleAiBanner.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── pages/                 # Full feature views
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AnalyzePage.tsx
│   │   ├── AnalysisResultPage.tsx
│   │   ├── VersionComparePage.tsx
│   │   ├── ResumesPage.tsx
│   │   ├── JobsPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── MlBenchmarksPage.tsx
│   │   └── SettingsPage.tsx
│   ├── types/                 # Shared TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   └── agentic-system.test.ts # Comprehensive test suite
├── Dockerfile
├── docker-compose.yml
├── server.ts                  # Express full-stack API server & Vite middleware
└── package.json
```

---

## 🔑 Demo Mode & Credentials

- **Demo Account**: `demo@resumescreen.ai`
- **Instant Access**: Click **"Try Demo Account"** in the top navigation bar to populate the dashboard with realistic multi-modal resumes (Machine Learning Engineer, Full Stack Developer, Data Scientist) and target jobs.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate / retrieve user |
| `POST` | `/api/auth/demo` | Activate demo user credentials |
| `GET` | `/api/resumes` | List resumes for current user |
| `POST` | `/api/resumes/upload` | Multipart resume upload & parse |
| `POST` | `/api/resumes/:id/profile` | Update extracted profile details |
| `GET` | `/api/jobs` | Retrieve target job descriptions |
| `POST` | `/api/jobs` | Create custom job description |
| `POST` | `/api/analyze` | Run full 7-agent screening pipeline |
| `GET` | `/api/analyses` | List stored analysis records |
| `GET` | `/api/analyses/:id` | Retrieve specific analysis report |
| `POST` | `/api/compare` | Run side-by-side resume version comparison |
| `GET` | `/api/reports/:id/pdf` | Stream downloadable PDF audit report |
| `GET` | `/api/ml/benchmarks` | Get model evaluation benchmarks |
| `GET` | `/api/system/status` | Query engine status & LLM connectivity |
