import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AnalysisResult, CandidateProfile, JobDescription, ResumeRecord, User, UserSettings } from '../src/types';
import { PREDEFINED_JOB_TEMPLATES, convertTemplateToJobDescription } from '../src/ai/knowledge/predefinedJobs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  users: User[];
  resumes: ResumeRecord[];
  jobs: JobDescription[];
  analyses: AnalysisResult[];
  settings?: Record<string, UserSettings>;
}

// Password hashing utility
function hashPassword(password: string, salt: string = "screenai_salt_"): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Seed Demo User with pre-hashed password for demo123
const DEMO_USER: User = {
  id: "usr_demo_001",
  name: "Dr. Alex Rivera",
  email: "demo@resumescreen.ai",
  role: "user",
  passwordHash: hashPassword("demo123"),
  createdAt: "2026-09-15T10:00:00.000Z",
  settings: {
    userId: "usr_demo_001",
    theme: "system",
    defaultWeights: { keyword: 0.30, semantic: 0.30, experience: 0.25, formatting: 0.15 },
    notificationsEnabled: true
  }
};

// Seed 4 Realistic Resumes
const SEED_RESUMES: ResumeRecord[] = [
  {
    id: "res_alex_ml",
    userId: "usr_demo_001",
    fileName: "Alex_Rivera_Senior_ML_Engineer.pdf",
    fileSize: 142850,
    fileType: "pdf",
    version: 1,
    uploadedAt: "2026-09-20T14:30:00.000Z",
    lastAnalysisScore: 84,
    rawText: `Dr. Alex Rivera
Email: alex.rivera@example.com | Phone: (415) 555-0192 | San Francisco, CA
LinkedIn: linkedin.com/in/alex-rivera-ai | GitHub: github.com/arivera-ml

PROFESSIONAL SUMMARY
Senior Machine Learning Engineer with 5+ years of experience architecting end-to-end deep learning systems, distributed training pipelines, and real-time inference microservices. Proven expertise in PyTorch, TensorFlow, Scikit-learn, Python, and Large Language Models.

TECHNICAL SKILLS
• Programming Languages: Python, SQL, C++, Bash
• ML & Deep Learning: PyTorch, TensorFlow, Scikit-Learn, Keras, Hugging Face, Transformers, Computer Vision, NLP
• Data & MLOps: Pandas, NumPy, MLflow, Docker, Kubernetes, Apache Spark, Airflow
• Cloud & Tools: AWS (SageMaker, S3, EC2), Git, Linux, PostgreSQL, REST APIs

PROFESSIONAL EXPERIENCE
Senior Machine Learning Engineer | Nexus Neural Labs | 2023 – Present
• Architected scalable distributed LLM fine-tuning pipelines using PyTorch and DeepSpeed, reducing model training costs by 38%.
• Engineered low-latency REST inference APIs deployed on Kubernetes clusters, maintaining 99.98% uptime at 4,500 req/sec.
• Optimized feature extraction pipelines using Python, Pandas, and Apache Spark for 25TB multi-modal datasets.

Machine Learning Engineer | Apex Data Systems | 2021 – 2023
• Deployed production predictive modeling classifiers using Scikit-Learn and XGBoost, improving churn detection accuracy by 24%.
• Built automated CI/CD model validation pipelines using Docker, MLflow, and GitHub Actions.
• Collaborated with product engineers to integrate model endpoints into customer-facing analytics dashboards.

EDUCATION
• Master of Science in Computer Science (Machine Learning Concentration) | Stanford University | 2021
• Bachelor of Science in Electrical Engineering & CS | UC Berkeley | 2019

PROJECTS
• Agentic RAG Document Assistant: Built enterprise question-answering system using LangChain, FAISS, PyTorch, and FastAPI.
• VisionNet Real-Time Object Classifier: Developed lightweight CNN edge model achieving 89% mAP at 60 FPS on Jetson Xavier.

CERTIFICATIONS
• AWS Certified Machine Learning — Specialty
• Deep Learning Specialization (Coursera / deeplearning.ai)
`,
    profile: {
      name: "Dr. Alex Rivera",
      email: "alex.rivera@example.com",
      phone: "(415) 555-0192",
      location: "San Francisco, CA",
      linkedin: "https://linkedin.com/in/alex-rivera-ai",
      github: "https://github.com/arivera-ml",
      summary: "Senior Machine Learning Engineer with 5+ years of experience architecting end-to-end deep learning systems, distributed training pipelines, and real-time inference microservices.",
      skills: {
        technical: ["Machine Learning", "Deep Learning", "Predictive Modeling", "Computer Vision", "NLP"],
        languages: ["Python", "SQL", "C++"],
        frameworks: ["PyTorch", "TensorFlow", "Scikit-Learn", "Keras", "Transformers"],
        tools: ["Docker", "Kubernetes", "AWS", "Git", "Linux", "PostgreSQL", "MLflow"],
        soft: ["Problem Solving", "Leadership", "Communication", "Agile Methodologies"]
      },
      education: [
        { institution: "Stanford University", degree: "Master of Science", major: "Computer Science", year: "2021", gpa: "3.9 / 4.0" },
        { institution: "UC Berkeley", degree: "Bachelor of Science", major: "Electrical Engineering & CS", year: "2019", gpa: "3.8 / 4.0" }
      ],
      experience: [
        {
          company: "Nexus Neural Labs",
          role: "Senior Machine Learning Engineer",
          duration: "2023 – Present",
          responsibilities: [
            "Architected scalable distributed LLM fine-tuning pipelines using PyTorch and DeepSpeed, reducing model training costs by 38%.",
            "Engineered low-latency REST inference APIs deployed on Kubernetes clusters, maintaining 99.98% uptime at 4,500 req/sec.",
            "Optimized feature extraction pipelines using Python, Pandas, and Apache Spark for 25TB multi-modal datasets."
          ]
        },
        {
          company: "Apex Data Systems",
          role: "Machine Learning Engineer",
          duration: "2021 – 2023",
          responsibilities: [
            "Deployed production predictive modeling classifiers using Scikit-Learn and XGBoost, improving churn detection accuracy by 24%.",
            "Built automated CI/CD model validation pipelines using Docker, MLflow, and GitHub Actions.",
            "Collaborated with product engineers to integrate model endpoints into customer-facing analytics dashboards."
          ]
        }
      ],
      projects: [
        {
          title: "Agentic RAG Document Assistant",
          description: "Built enterprise question-answering system using LangChain, FAISS, PyTorch, and FastAPI with citation grounding.",
          technologies: ["Python", "PyTorch", "FastAPI", "Docker", "RAG"]
        },
        {
          title: "VisionNet Real-Time Object Classifier",
          description: "Developed lightweight CNN edge model achieving 89% mAP at 60 FPS on Jetson Xavier.",
          technologies: ["TensorFlow", "OpenCV", "Python", "CUDA"]
        }
      ],
      certifications: ["AWS Certified Machine Learning — Specialty", "Deep Learning Specialization"],
      achievements: ["Published paper on Efficient Transformer Quantization", "NeurIPS Workshop Presenter"],
      languages: ["English (Native)", "Spanish (Fluent)"]
    }
  },
  {
    id: "res_sophia_fullstack",
    userId: "usr_demo_001",
    fileName: "Sophia_Chen_FullStack_Engineer.pdf",
    fileSize: 118400,
    fileType: "pdf",
    version: 1,
    uploadedAt: "2026-09-22T09:15:00.000Z",
    lastAnalysisScore: 78,
    rawText: `Sophia Chen
Email: sophia.chen@example.com | Phone: (206) 555-8391 | Seattle, WA
LinkedIn: linkedin.com/in/sophiachen-dev | GitHub: github.com/schen-fullstack

SUMMARY
Innovative Full Stack Developer with 4 years of experience building modern React, TypeScript, and Node.js applications. Strong foundation in distributed microservices, REST APIs, Tailwind CSS, PostgreSQL, and AWS cloud deployment.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, SQL, HTML5, CSS3, Python
Frontend: React, Next.js, Redux, Tailwind CSS, Vite, Jest
Backend & DB: Node.js, Express, PostgreSQL, Redis, REST APIs, GraphQL
DevOps & Tools: Docker, Git, CI/CD, AWS (S3, CloudFront), Linux

EXPERIENCE
Full Stack Developer | CloudScale Solutions | 2022 – Present
• Engineered high-performance dashboard interfaces using React, Next.js, and TypeScript, serving 80,000+ daily active users.
• Built resilient Node.js microservices with PostgreSQL and Redis caching, cutting average API response times by 45%.
• Implemented automated GitHub Actions CI/CD workflows for seamless Docker container deployments on AWS.

Frontend Engineer | BlueSky Media | 2020 – 2022
• Developed modular UI component library in Tailwind CSS and React, improving frontend sprint velocity across 4 cross-functional squads.
• Integrated GraphQL and REST endpoints, ensuring zero-downtime client-side state synchronization.

EDUCATION
Bachelor of Science in Computer Science | University of Washington | 2020

PROJECTS
• Real-Time Collaborative Whiteboard: Full stack canvas app using React, WebSocket, and Express.
• E-Commerce Microservices Engine: Next.js frontend with Stripe integration and PostgreSQL backend.
`,
    profile: {
      name: "Sophia Chen",
      email: "sophia.chen@example.com",
      phone: "(206) 555-8391",
      location: "Seattle, WA",
      linkedin: "https://linkedin.com/in/sophiachen-dev",
      github: "https://github.com/schen-fullstack",
      summary: "Innovative Full Stack Developer with 4 years of experience building modern React, TypeScript, and Node.js applications.",
      skills: {
        technical: ["REST APIs", "GraphQL", "Microservices", "Responsive Design"],
        languages: ["TypeScript", "JavaScript", "SQL", "Python"],
        frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS"],
        tools: ["Docker", "Git", "PostgreSQL", "Redis", "AWS", "Linux"],
        soft: ["Team Collaboration", "Agile", "Communication"]
      },
      education: [
        { institution: "University of Washington", degree: "Bachelor of Science", major: "Computer Science", year: "2020", gpa: "3.8 / 4.0" }
      ],
      experience: [
        {
          company: "CloudScale Solutions",
          role: "Full Stack Developer",
          duration: "2022 – Present",
          responsibilities: [
            "Engineered high-performance dashboard interfaces using React, Next.js, and TypeScript, serving 80,000+ daily active users.",
            "Built resilient Node.js microservices with PostgreSQL and Redis caching, cutting average API response times by 45%."
          ]
        }
      ],
      projects: [
        {
          title: "Real-Time Collaborative Whiteboard",
          description: "Full stack canvas app using React, WebSocket, and Express with state sync.",
          technologies: ["React", "TypeScript", "Node.js", "WebSocket"]
        }
      ],
      certifications: ["AWS Certified Developer Associate"],
      achievements: ["Hackathon Winner 2023"],
      languages: ["English (Native)", "Mandarin (Conversational)"]
    }
  }
];

// Seed 6 Rich Job Descriptions
const SEED_JOBS: JobDescription[] = [
  {
    id: "job_ml_eng",
    title: "Senior Machine Learning Engineer",
    company: "Synthetix AI Labs",
    location: "San Francisco, CA (Hybrid)",
    category: "AI & Machine Learning",
    description: `Synthetix AI is hiring a Senior Machine Learning Engineer to design and deploy scalable foundation model architectures and production inference pipelines. 
You will build large-scale model training workflows using PyTorch, manage MLOps with Docker and Kubernetes, and optimize models for low-latency production serving.
Requirements:
- 3+ years experience developing ML / Deep Learning models in production.
- Expert proficiency in Python, PyTorch, Scikit-Learn, and SQL.
- Strong knowledge of Transformers, Large Language Models, and vector embeddings.
- Practical experience with Docker, Kubernetes, and AWS cloud infrastructure.
- Bachelor's or Master's degree in Computer Science, Data Science, or related quantitative field.`,
    requiredSkills: ["Python", "Machine Learning", "PyTorch", "Deep Learning", "Scikit-Learn", "SQL", "Docker"],
    preferredSkills: ["Kubernetes", "AWS", "Large Language Models", "Transformers", "Git", "MLflow"],
    experienceRequired: 3,
    educationRequired: "Bachelor's or Master's in Computer Science",
    createdAt: "2026-09-18T10:00:00.000Z"
  },
  {
    id: "job_fullstack",
    title: "Lead Full Stack Software Engineer",
    company: "Vanguard Platform Technologies",
    location: "New York, NY (Remote)",
    category: "Software Engineering",
    description: `We are looking for a Lead Full Stack Software Engineer to build resilient customer web applications and high-throughput backend APIs.
You will write clean, well-tested code in React, TypeScript, and Node.js, and design scalable PostgreSQL databases.
Responsibilities:
- Build reactive, accessible user interfaces using React, Next.js, and Tailwind CSS.
- Design scalable backend microservices and RESTful APIs using Node.js and TypeScript.
- Architect relational database models and queries with PostgreSQL and Redis.
- Drive automated CI/CD deployments and containerization with Docker.`,
    requiredSkills: ["React", "TypeScript", "Node.js", "JavaScript", "SQL", "REST APIs", "Tailwind CSS"],
    preferredSkills: ["Next.js", "PostgreSQL", "Docker", "AWS", "Redis", "Git"],
    experienceRequired: 3,
    educationRequired: "Bachelor's in Computer Science or Software Engineering",
    createdAt: "2026-09-19T11:00:00.000Z"
  },
  {
    id: "job_devops",
    title: "Cloud DevOps & Platform Engineer",
    company: "Aether Cloud Infrastructure",
    location: "Austin, TX (Remote)",
    category: "Cloud Infrastructure",
    description: `Aether Cloud is seeking a Cloud DevOps Engineer to scale our global multi-region cloud infrastructure and container orchestration platforms.
Requirements:
- 3+ years experience managing Kubernetes clusters and Docker containers in AWS or GCP.
- Deep expertise in Infrastructure as Code using Terraform and automated CI/CD pipelines (GitHub Actions/GitLab CI).
- Strong Linux systems administration, networking, and scripting skills in Python and Bash.`,
    requiredSkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Git"],
    preferredSkills: ["Python", "GCP", "Bash", "Prometheus", "Grafana", "Networking"],
    experienceRequired: 3,
    educationRequired: "Bachelor's degree in Computer Science, Systems, or related field",
    createdAt: "2026-09-20T12:00:00.000Z"
  },
  {
    id: "job_data_scientist",
    title: "Senior Data Scientist",
    company: "OmniMetrics Capital",
    location: "Boston, MA (Hybrid)",
    category: "Data Science & Analytics",
    description: `OmniMetrics Capital is looking for a Senior Data Scientist to spearhead quantitative predictive modeling, customer behavior forecasting, and econometric analysis.
Requirements:
- Proven track record applying Machine Learning and statistical inference in Python and SQL.
- Deep knowledge of Pandas, NumPy, Scikit-learn, and A/B experimental testing.
- Strong ability to translate complex data discoveries into executive presentations and interactive dashboards using Tableau or Power BI.`,
    requiredSkills: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics", "Pandas", "Scikit-Learn"],
    preferredSkills: ["Tableau", "Power BI", "NumPy", "Apache Spark", "Git"],
    experienceRequired: 3,
    educationRequired: "Master's or Bachelor's in Data Science, Statistics, or Mathematics",
    createdAt: "2026-09-21T14:00:00.000Z"
  },
  {
    id: "job_frontend",
    title: "Senior Frontend Engineer",
    company: "Prism Interactive Design",
    location: "San Francisco, CA (Remote)",
    category: "Software Engineering",
    description: `Prism is looking for a craft-oriented Senior Frontend Engineer passionate about typography, fluid micro-interactions, and component-driven architecture.
Requirements:
- Expert understanding of modern React, TypeScript, HTML5, and CSS/Tailwind.
- Proven experience optimizing Web Core Vitals, client-side caching, and state management.
- Experience delivering production design systems and accessible user interfaces.`,
    requiredSkills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
    preferredSkills: ["Next.js", "Figma", "Redux", "Vite", "Git", "REST APIs"],
    experienceRequired: 2,
    educationRequired: "Bachelor's in Computer Science or equivalent experience",
    createdAt: "2026-09-22T08:00:00.000Z"
  },
  {
    id: "job_cybersecurity",
    title: "Cybersecurity Analyst & Threat Hunter",
    company: "Sentinel Defense Systems",
    location: "Washington, DC (On-site)",
    category: "Security",
    description: `Sentinel Defense is hiring a Cybersecurity Analyst to monitor threat intelligence feeds, conduct vulnerability assessments, and protect cloud infrastructure.
Requirements:
- Hands-on experience with SIEM platforms, Linux internals, network firewalls, and incident triage.
- Proficiency with vulnerability scanners and threat mitigation frameworks.
- Familiarity with Python or Bash automation for security log analysis.`,
    requiredSkills: ["Linux", "Networking", "Security", "Vulnerability Assessment", "Incident Response"],
    preferredSkills: ["Python", "SIEM", "Firewalls", "Wireshark", "Cloud Security"],
    experienceRequired: 2,
    educationRequired: "Bachelor's in Cybersecurity, Information Systems, or Computer Science",
    createdAt: "2026-09-23T09:30:00.000Z"
  }
];

// Seed 1 Realistic Analysis
const SEED_ANALYSES: AnalysisResult[] = [
  {
    id: "ana_alex_synthetix_01",
    userId: "usr_demo_001",
    resumeId: "res_alex_ml",
    resumeName: "Alex_Rivera_Senior_ML_Engineer.pdf",
    jobDescriptionId: "job_ml_eng",
    jobTitle: "Senior Machine Learning Engineer",
    company: "Synthetix AI Labs",
    atsScore: 84,
    keywordScore: 86,
    semanticScore: 88,
    experienceScore: 92,
    formattingScore: 88,
    weights: { keyword: 0.30, semantic: 0.30, experience: 0.25, formatting: 0.15 },
    keywordDetails: {
      matched: [
        { name: "Python", category: "programming_language", foundInResume: true, frequency: 6 },
        { name: "Machine Learning", category: "ai_ml", foundInResume: true, frequency: 5 },
        { name: "PyTorch", category: "framework", foundInResume: true, frequency: 4 },
        { name: "Deep Learning", category: "ai_ml", foundInResume: true, frequency: 3 },
        { name: "Scikit-Learn", category: "framework", foundInResume: true, frequency: 2 },
        { name: "SQL", category: "programming_language", foundInResume: true, frequency: 2 },
        { name: "Docker", category: "cloud_devops", foundInResume: true, frequency: 2 }
      ],
      missing: [
        { name: "Transformers", category: "ai_ml", foundInResume: false, frequency: 0 }
      ],
      totalRequired: 7,
      matchRate: 86,
      reason: "Matched 6 of 7 primary job requirements with strong multi-term density across work experience and projects."
    },
    semanticDetails: {
      similarityScore: 88,
      keyThemesDetected: ["Foundation Model Deployment", "High-Throughput ML Microservices", "Distributed Model Training"],
      reason: "Your resume exhibits an 88% contextual match with the target job's deep learning and MLOps ecosystem."
    },
    experienceDetails: {
      qualificationFit: 95,
      experienceFit: 90,
      requiredYears: 3,
      detectedYears: 5,
      educationSatisfied: true,
      satisfiedRequirements: [
        "5+ years professional experience (Job requires 3+ years)",
        "Candidate holds Master of Science in Computer Science, fulfilling requirement"
      ],
      missingRequirements: [],
      reason: "Estimated 5 years of relevant work experience detected against 3 years required. Qualification fit is 95%."
    },
    formattingDetails: {
      score: 88,
      checks: [
        { id: "file_type", label: "Standard File Format (.pdf)", passed: true, severity: "pass", message: "Standard PDF format." },
        { id: "extractability", label: "Direct Text Extractability", passed: true, severity: "pass", message: "Clean text stream extracted without OCR artifacts." },
        { id: "contact_info", label: "Contact Information Header", passed: true, severity: "pass", message: "Email, phone number, and LinkedIn profile detected." },
        { id: "education_section", label: "Education Credentials", passed: true, severity: "pass", message: "Degrees from Stanford and UC Berkeley recognized." },
        { id: "bullet_points", label: "Consistent Action Bullets", passed: true, severity: "pass", message: "Consistent bullet hierarchy detected." },
        { id: "layout_simplicity", label: "Single-Column Flow", passed: true, severity: "pass", message: "Sequential single-column ATS reading flow." }
      ],
      summary: "Resume structure conforms to top-tier ATS parsing guidelines."
    },
    skillGap: {
      matchingSkills: ["Python", "Machine Learning", "PyTorch", "Deep Learning", "Scikit-Learn", "SQL", "Docker"],
      missingSkills: ["Transformers"],
      additionalSkills: ["C++", "Apache Spark", "Airflow", "MLflow", "Kubernetes", "AWS"],
      gapPercentage: 14
    },
    predictedRoles: [
      {
        role: "Machine Learning Engineer",
        score: 94,
        category: "ai_data",
        matchingPoints: ["Python", "Machine Learning", "PyTorch", "Deep Learning", "Scikit-Learn", "SQL"],
        missingPoints: [],
        reason: "Exceptional alignment: 5+ years experience building PyTorch and Scikit-Learn models with MLOps infrastructure."
      },
      {
        role: "Data Scientist",
        score: 89,
        category: "ai_data",
        matchingPoints: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics"],
        missingPoints: [],
        reason: "Strong foundation in predictive statistical modeling, data manipulation with Pandas, and quantitative analysis."
      },
      {
        role: "AI Engineer",
        score: 87,
        category: "ai_data",
        matchingPoints: ["Python", "Large Language Models", "PyTorch", "REST APIs"],
        missingPoints: [],
        reason: "Demonstrated production LLM fine-tuning and API integration experience."
      },
      {
        role: "Data Engineer",
        score: 79,
        category: "ai_data",
        matchingPoints: ["Python", "SQL", "Apache Spark", "Airflow", "Data Pipelines"],
        missingPoints: [],
        reason: "Hands-on experience processing 25TB datasets and orchestrating pipelines with Spark."
      }
    ],
    recommendations: {
      resumeImprovements: [
        "Include Hugging Face / Transformers explicitly in the skills section to address the preferred qualification.",
        "Highlight latency benchmarks (e.g. p99 response times) in the REST API bullet points.",
        "Add measurable business impact regarding model accuracy improvements."
      ],
      missingKeywordsSuggestions: [
        {
          keyword: "Transformers",
          category: "Framework",
          suggestion: "Consider mentioning 'Transformers' or Hugging Face if you have worked with transformer attention architectures.",
          reason: "Target job lists Transformers in preferred qualifications."
        }
      ],
      projectImprovements: [
        {
          projectTitle: "Agentic RAG Document Assistant",
          suggestedTitle: "Agentic RAG Retrieval Engine — Distributed Architecture",
          techToMention: ["PyTorch", "FastAPI", "Docker", "FAISS"],
          impactAdvice: "Detail retrieval precision and sub-second latency under concurrency.",
          rewrittenBullet: "Architected an Agentic RAG document assistant with PyTorch, FAISS, and FastAPI, achieving sub-250ms retrieval latency across 100k indexed technical documents."
        }
      ],
      experienceImprovements: [
        {
          role: "Senior Machine Learning Engineer at Nexus Neural Labs",
          actionVerbs: ["Spearheaded", "Architected", "Engineered", "Optimized"],
          metricSuggestions: ["Throughput scale (4,500 req/sec)", "Training cost reduction (-38%)", "Cluster uptime (99.98%)"],
          rewrittenBullet: "Spearheaded distributed LLM fine-tuning pipelines using PyTorch and DeepSpeed, reducing compute costs by 38% while sustaining 99.98% production uptime at 4,500 req/sec."
        }
      ],
      strengths: [
        "Exceptional PyTorch and distributed machine learning pipeline expertise.",
        "Strong MLOps background with Docker, Kubernetes, and AWS SageMaker.",
        "Top-tier educational credentials (Stanford M.S. CS, UC Berkeley B.S.)."
      ],
      weaknesses: [
        "Minor opportunity to explicitly highlight Transformers and vector database indexing."
      ],
      executiveSummary: "Dr. Alex Rivera exhibits an outstanding 84/100 ATS compatibility for the Senior Machine Learning Engineer position at Synthetix AI Labs. The candidate exceeds required tenure, holds an advanced degree, and displays high-density PyTorch, Python, and MLOps expertise."
    },
    profileSnapshot: SEED_RESUMES[0].profile,
    createdAt: "2026-09-24T16:00:00.000Z"
  }
];

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.ensureDir();
    this.db = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    const predefinedJobObjects = PREDEFINED_JOB_TEMPLATES.map(convertTemplateToJobDescription);

    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        const existingJobs: JobDescription[] = parsed.jobs || [];

        // Ensure all 12 predefined jobs exist in jobs array
        for (const pJob of predefinedJobObjects) {
          const matchIdx = existingJobs.findIndex(j => 
            j.id === pJob.id || j.title.toLowerCase() === pJob.title.toLowerCase()
          );
          if (matchIdx === -1) {
            existingJobs.push(pJob);
          }
        }

        return {
          users: parsed.users || [DEMO_USER],
          resumes: parsed.resumes || SEED_RESUMES,
          jobs: existingJobs.length > 0 ? existingJobs : predefinedJobObjects,
          analyses: parsed.analyses || SEED_ANALYSES,
        };
      }
    } catch (e) {
      console.warn("Could not read database file, initializing with seed data:", e);
    }

    const initial: DatabaseSchema = {
      users: [DEMO_USER],
      resumes: SEED_RESUMES,
      jobs: predefinedJobObjects,
      analyses: SEED_ANALYSES,
    };
    this.save(initial);
    return initial;
  }

  private save(data?: DatabaseSchema) {
    try {
      this.ensureDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data || this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to write to database file:", e);
    }
  }

  // Users & Authentication
  getUserByEmail(email: string): User | undefined {
    return this.db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  createUser(name: string, email: string, password?: string): User {
    const existing = this.getUserByEmail(email);
    if (existing) return existing;

    const user: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      role: 'user',
      passwordHash: password ? hashPassword(password) : undefined,
      createdAt: new Date().toISOString(),
      settings: {
        userId: '',
        theme: 'system',
        defaultWeights: { keyword: 0.30, semantic: 0.30, experience: 0.25, formatting: 0.15 },
        notificationsEnabled: true
      }
    };
    user.settings!.userId = user.id;

    this.db.users.push(user);
    this.save();
    return user;
  }

  authenticate(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    // Special allowance for demo account
    if (user.id === 'usr_demo_001' && (password === 'demo123' || !password)) {
      return user;
    }

    if (!user.passwordHash) {
      // If user had no password set, set it on first login
      user.passwordHash = hashPassword(password);
      this.save();
      return user;
    }

    if (user.passwordHash === hashPassword(password)) {
      return user;
    }

    return null;
  }

  // User Settings
  getUserSettings(userId: string): UserSettings {
    const user = this.getUserById(userId);
    if (user?.settings) {
      return user.settings;
    }

    if (this.db.settings && this.db.settings[userId]) {
      return this.db.settings[userId];
    }

    return {
      userId,
      theme: 'system',
      defaultWeights: { keyword: 0.30, semantic: 0.30, experience: 0.25, formatting: 0.15 },
      notificationsEnabled: true
    };
  }

  saveUserSettings(userId: string, newSettings: Partial<UserSettings>): UserSettings {
    const current = this.getUserSettings(userId);
    const updated: UserSettings = {
      ...current,
      ...newSettings,
      userId,
    };

    if (!this.db.settings) this.db.settings = {};
    this.db.settings[userId] = updated;

    const user = this.getUserById(userId);
    if (user) {
      user.settings = updated;
    }

    this.save();
    return updated;
  }

  // Resumes (Strictly User-Scoped)
  getResumes(userId?: string): ResumeRecord[] {
    if (!userId) {
      return [];
    }
    return this.db.resumes.filter(r => r.userId === userId);
  }

  getResumeById(id: string, userId?: string): ResumeRecord | undefined {
    const resume = this.db.resumes.find(r => r.id === id);
    if (!resume) return undefined;
    if (userId && resume.userId !== userId) return undefined;
    return resume;
  }

  saveResume(resume: ResumeRecord): ResumeRecord {
    const idx = this.db.resumes.findIndex(r => r.id === resume.id);
    if (idx >= 0) {
      this.db.resumes[idx] = resume;
    } else {
      this.db.resumes.unshift(resume);
    }
    this.save();
    return resume;
  }

  deleteResume(id: string, userId?: string): boolean {
    const resume = this.db.resumes.find(r => r.id === id);
    if (!resume) return false;
    if (userId && resume.userId !== userId) return false;

    // Delete resume
    this.db.resumes = this.db.resumes.filter(r => r.id !== id);
    // Cascade delete any analyses associated with this resume
    this.db.analyses = this.db.analyses.filter(a => a.resumeId !== id);

    this.save();
    return true;
  }

  // Jobs (System Presets + User Custom Jobs)
  getJobs(userId?: string): JobDescription[] {
    // Return system predefined jobs + current user's custom jobs
    return this.db.jobs.filter(j => !j.userId || j.userId === 'system' || (userId && j.userId === userId));
  }

  getJobById(id: string, userId?: string): JobDescription | undefined {
    const job = this.db.jobs.find(j => j.id === id);
    if (!job) return undefined;
    if (job.userId && job.userId !== 'system' && userId && job.userId !== userId) {
      return undefined;
    }
    return job;
  }

  saveJob(job: JobDescription, userId?: string): JobDescription {
    if (userId && !job.userId) {
      job.userId = userId;
    }
    const idx = this.db.jobs.findIndex(j => j.id === job.id);
    if (idx >= 0) {
      this.db.jobs[idx] = job;
    } else {
      this.db.jobs.unshift(job);
    }
    this.save();
    return job;
  }

  deleteJob(id: string, userId?: string): boolean {
    const job = this.db.jobs.find(j => j.id === id);
    if (!job) return false;
    // Cannot delete system predefined jobs
    if (!job.userId || job.userId === 'system') return false;
    if (userId && job.userId !== userId) return false;

    this.db.jobs = this.db.jobs.filter(j => j.id !== id);
    this.save();
    return true;
  }

  // Analyses (Strictly User-Scoped)
  getAnalyses(userId?: string): AnalysisResult[] {
    if (!userId) {
      return [];
    }
    return this.db.analyses.filter(a => a.userId === userId);
  }

  getAnalysisById(id: string, userId?: string): AnalysisResult | undefined {
    const analysis = this.db.analyses.find(a => a.id === id);
    if (!analysis) return undefined;
    if (userId && analysis.userId !== userId) return undefined;
    return analysis;
  }

  saveAnalysis(analysis: AnalysisResult): AnalysisResult {
    const idx = this.db.analyses.findIndex(a => a.id === analysis.id);
    if (idx >= 0) {
      this.db.analyses[idx] = analysis;
    } else {
      this.db.analyses.unshift(analysis);
    }
    this.save();
    return analysis;
  }

  deleteAnalysis(id: string, userId?: string): boolean {
    const analysis = this.db.analyses.find(a => a.id === id);
    if (!analysis) return false;
    if (userId && analysis.userId !== userId) return false;

    this.db.analyses = this.db.analyses.filter(a => a.id !== id);
    this.save();
    return true;
  }
}

export const db = new DatabaseManager();
