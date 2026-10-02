import { JobDescription } from '../../types';

export interface PredefinedJobTemplate {
  id: string;
  title: string;
  category: string;
  company: string;
  location: string;
  experienceRequired: number;
  educationRequired: string;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
}

export const PREDEFINED_JOB_TEMPLATES: PredefinedJobTemplate[] = [
  {
    id: "preset_sw_dev",
    title: "Software Developer",
    category: "Software Engineering",
    company: "Acme Tech Innovations",
    location: "San Francisco, CA (Hybrid / Remote)",
    experienceRequired: 2,
    educationRequired: "Bachelor's in Computer Science or equivalent",
    requiredSkills: ["JavaScript", "Python", "Data Structures", "Algorithms", "Git", "SQL", "REST APIs"],
    preferredSkills: ["TypeScript", "Docker", "CI/CD", "Unit Testing", "Agile Methodologies"],
    description: `We are looking for a Software Developer to build high-quality applications and maintain core system features.

Key Responsibilities:
• Write clean, testable, and efficient code in Python/JavaScript.
• Design, implement, and maintain scalable RESTful microservices and backend logic.
• Collaborate with cross-functional product and design teams in an Agile development environment.
• Participate in code reviews, bug fixes, and continuous integration workflows.

Requirements:
• 2+ years of professional software engineering experience.
• Strong foundation in Data Structures, Algorithms, and Object-Oriented Programming.
• Proficiency in SQL database design and query optimization.
• Solid understanding of version control with Git.`,
  },
  {
    id: "preset_frontend",
    title: "Frontend Developer",
    category: "Frontend Engineering",
    company: "PixelCraft Digital",
    location: "New York, NY (Remote)",
    experienceRequired: 2,
    educationRequired: "Bachelor's Degree in CS, Design, or equivalent experience",
    requiredSkills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"],
    preferredSkills: ["Next.js", "State Management (Redux/Zustand)", "Web Performance Optimization", "Figma", "Jest"],
    description: `PixelCraft Digital is hiring a Frontend Developer to craft visually stunning, responsive, and accessible user interfaces.

Key Responsibilities:
• Build modern single-page applications using React, TypeScript, and Tailwind CSS.
• Translate UX wireframes and Figma prototypes into modular, reusable UI components.
• Optimize client-side rendering performance, Core Web Vitals, and responsive cross-browser layouts.
• Integrate backend REST and GraphQL endpoints with robust error handling.

Requirements:
• 2+ years experience building modern web applications with React and TypeScript.
• Deep understanding of semantic HTML5, modern CSS3, and component styling.
• Passion for intuitive user interactions, micro-animations, and responsive design.`,
  },
  {
    id: "preset_backend",
    title: "Backend Developer",
    category: "Backend Engineering",
    company: "Apex Core Systems",
    location: "Austin, TX (Remote)",
    experienceRequired: 3,
    educationRequired: "Bachelor's Degree in Computer Science or related field",
    requiredSkills: ["Node.js", "Python", "SQL", "PostgreSQL", "REST APIs", "Microservices", "Docker"],
    preferredSkills: ["Redis", "Kafka", "AWS", "GraphQL", "Kubernetes", "System Design"],
    description: `Apex Core Systems seeks an experienced Backend Developer to architect high-throughput APIs, data pipelines, and distributed services.

Key Responsibilities:
• Design and scale backend microservices in Node.js / Python handling millions of API requests daily.
• Optimize PostgreSQL and Redis query performance, caching strategies, and indexing.
• Implement robust authentication, data encryption, and rate-limiting security measures.
• Deploy containerized services using Docker and automated CI/CD pipelines.

Requirements:
• 3+ years of professional backend engineering experience.
• Mastery of relational databases (PostgreSQL/MySQL) and schema migrations.
• Proven track record in designing resilient distributed systems and RESTful APIs.`,
  },
  {
    id: "preset_fullstack",
    title: "Full Stack Developer",
    category: "Full Stack Engineering",
    company: "Vanguard Platform Technologies",
    location: "Seattle, WA (Hybrid)",
    experienceRequired: 3,
    educationRequired: "Bachelor's Degree in Computer Science or Software Engineering",
    requiredSkills: ["React", "Node.js", "TypeScript", "SQL", "REST APIs", "Git", "Tailwind CSS"],
    preferredSkills: ["Next.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "CI/CD"],
    description: `Vanguard Platform Technologies is seeking a Full Stack Developer to drive end-to-end product features across our web platform.

Key Responsibilities:
• Deliver full-lifecycle web features from React frontend interfaces down to Node.js backend APIs.
• Maintain database schemas, ORM models, and asynchronous background job queues.
• Build real-time interactive dashboards and customer workflows.
• Ensure application security, high test coverage, and smooth production deployments.

Requirements:
• 3+ years of full stack development experience using modern JavaScript/TypeScript ecosystems.
• Strong competence across frontend (React/Next.js) and backend (Node.js/Express/SQL).
• Experience with cloud deployments and containerization.`,
  },
  {
    id: "preset_ml_eng",
    title: "Machine Learning Engineer",
    category: "AI & Machine Learning",
    company: "Synthetix AI Labs",
    location: "San Francisco, CA (Hybrid / Remote)",
    experienceRequired: 3,
    educationRequired: "Bachelor's or Master's in Computer Science, Data Science, or related field",
    requiredSkills: ["Python", "Machine Learning", "PyTorch", "Deep Learning", "Scikit-Learn", "SQL", "Docker"],
    preferredSkills: ["Kubernetes", "AWS", "Large Language Models", "Transformers", "Git", "MLflow"],
    description: `Synthetix AI is hiring a Machine Learning Engineer to design and deploy scalable foundation model architectures and production inference pipelines.

Key Responsibilities:
• Develop and fine-tune deep learning and transformer models using PyTorch and Hugging Face.
• Build end-to-end MLOps pipelines for model training, evaluation, registry, and serving.
• Containerize inference microservices with Docker and deploy to Kubernetes clusters.
• Collaborate with product teams to integrate AI models into real-time web applications.

Requirements:
• 3+ years experience developing ML/Deep Learning models in production.
• Expert proficiency in Python, PyTorch, Scikit-Learn, and SQL.
• Practical experience with Docker, Kubernetes, and cloud infrastructure.`,
  },
  {
    id: "preset_data_scientist",
    title: "Data Scientist",
    category: "Data Science & Analytics",
    company: "Quantiva Analytics",
    location: "Boston, MA (Hybrid)",
    experienceRequired: 3,
    educationRequired: "Master's or Bachelor's in Statistics, Data Science, Mathematics, or CS",
    requiredSkills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Statistical Modeling", "Data Analysis", "A/B Testing"],
    preferredSkills: ["Tableau", "Machine Learning", "BigQuery", "Data Visualization", "R"],
    description: `Quantiva Analytics is looking for a Data Scientist to transform complex multi-modal data into predictive models and actionable business insights.

Key Responsibilities:
• Formulate predictive statistical models and hypothesis tests to guide strategic business decisions.
• Perform exploratory data analysis, feature engineering, and data cleaning on large datasets.
• Design, execute, and analyze rigorous A/B experiments and multivariate tests.
• Communicate data narratives and model findings to executive stakeholders via clear visualizations.

Requirements:
• 3+ years experience as a Data Scientist or Quantitative Analyst.
• Strong mathematical background in probability, statistics, regression, and classification.
• Fluency in Python (Pandas, NumPy, Scikit-Learn) and SQL.`,
  },
  {
    id: "preset_data_analyst",
    title: "Data Analyst",
    category: "Data Science & Analytics",
    company: "InsightStream Media",
    location: "Chicago, IL (Remote)",
    experienceRequired: 2,
    educationRequired: "Bachelor's Degree in Business, Analytics, Mathematics, or CS",
    requiredSkills: ["SQL", "Data Analysis", "Tableau", "Excel", "Data Visualization", "Power BI", "Python"],
    preferredSkills: ["ETL Pipelines", "Google Analytics", "Statistical Analysis", "Business Intelligence"],
    description: `InsightStream Media seeks a Data Analyst to build executive reporting dashboards, analyze consumer engagement, and optimize KPI performance.

Key Responsibilities:
• Author complex SQL queries to extract, aggregate, and validate multi-source relational data.
• Build automated interactive BI dashboards and reporting scorecards in Tableau and Power BI.
• Monitor core business metrics, investigate anomalies, and deliver ad-hoc diagnostic analysis.
• Partner with product managers and marketing leaders to translate questions into data metrics.

Requirements:
• 2+ years experience in business intelligence or data analytics.
• Advanced SQL query writing and database familiarity.
• Proven proficiency with Tableau, Power BI, or similar data visualization tools.`,
  },
  {
    id: "preset_cloud_devops",
    title: "Cloud/DevOps Engineer",
    category: "Cloud & Infrastructure",
    company: "Skyline Cloud Infrastructure",
    location: "Denver, CO (Remote)",
    experienceRequired: 3,
    educationRequired: "Bachelor's Degree in Computer Science, IT, or equivalent experience",
    requiredSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Bash"],
    preferredSkills: ["Python", "Prometheus", "Grafana", "Ansible", "GCP", "Security Compliance"],
    description: `Skyline Cloud is hiring a Cloud/DevOps Engineer to build resilient infrastructure-as-code, CI/CD automation, and high-availability cloud platforms.

Key Responsibilities:
• Architect, provision, and maintain multi-region cloud infrastructure on AWS using Terraform.
• Manage production Kubernetes clusters (EKS/GKE) ensuring zero-downtime rolling upgrades.
• Build automated CI/CD deployment pipelines using GitHub Actions and GitLab CI.
• Implement centralized observability, logging, and automated alerting with Prometheus and Grafana.

Requirements:
• 3+ years experience in Cloud/DevOps or Site Reliability Engineering.
• Strong mastery of Linux administration, Bash, and Python scripting.
• Deep practical experience with Docker, Kubernetes, and Terraform.`,
  },
  {
    id: "preset_cybersecurity",
    title: "Cybersecurity Analyst",
    category: "Information Security",
    company: "Fortress Cyber Defense",
    location: "Washington, DC (Hybrid / Remote)",
    experienceRequired: 2,
    educationRequired: "Bachelor's Degree in Cybersecurity, Computer Science, or Information Systems",
    requiredSkills: ["Cybersecurity", "Network Security", "Vulnerability Assessment", "SIEM", "Incident Response", "Linux", "Python"],
    preferredSkills: ["Wireshark", "Firewalls", "CompTIA Security+", "CISSP", "Penetration Testing"],
    description: `Fortress Cyber Defense seeks a Cybersecurity Analyst to monitor enterprise threat vectors, investigate security incidents, and harden infrastructure.

Key Responsibilities:
• Monitor SIEM telemetry and intrusion detection systems to identify and mitigate cyber threats.
• Conduct periodic vulnerability assessments, penetration tests, and security audits.
• Formulate incident response playbooks and lead post-incident root cause forensics.
• Enforce identity and access management (IAM), encryption policies, and compliance standards.

Requirements:
• 2+ years experience in information security operations or threat analysis.
• Working knowledge of network protocols, firewalls, endpoint defense, and OWASP Top 10.
• Relevant certifications (CompTIA Security+, CEH, or CySA+) preferred.`,
  },
  {
    id: "preset_mobile_app",
    title: "Mobile App Developer",
    category: "Mobile Engineering",
    company: "AppSphere Interactive",
    location: "Los Angeles, CA (Remote)",
    experienceRequired: 2,
    educationRequired: "Bachelor's Degree in CS, Software Engineering, or equivalent experience",
    requiredSkills: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "TypeScript", "Mobile UI"],
    preferredSkills: ["Swift", "Kotlin", "App Store Deployment", "Mobile Performance", "GraphQL"],
    description: `AppSphere Interactive is hiring a Mobile App Developer to build intuitive, smooth mobile experiences across iOS and Android platforms.

Key Responsibilities:
• Develop cross-platform or native mobile features using React Native / Flutter or Swift / Kotlin.
• Optimize rendering frame rates, offline caching, and native hardware API integrations.
• Manage end-to-end mobile release pipelines to Google Play Console and Apple App Store.
• Ensure tight integration with backend REST/GraphQL services and push notification hubs.

Requirements:
• 2+ years experience developing and shipping production mobile applications.
• Strong proficiency in React Native, Flutter, Swift, or Kotlin.
• Portfolio of live apps published on App Store or Google Play.`,
  },
  {
    id: "preset_ui_ux",
    title: "UI/UX Designer",
    category: "Product Design",
    company: "Lumina Design Studio",
    location: "San Francisco, CA (Hybrid / Remote)",
    experienceRequired: 3,
    educationRequired: "Bachelor's Degree in HCI, Design, Digital Media, or equivalent experience",
    requiredSkills: ["Figma", "UI/UX Design", "Wireframing", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    preferredSkills: ["Interaction Design", "HTML/CSS Basics", "Design Sprints", "Accessibility (WCAG)", "Information Architecture"],
    description: `Lumina Design Studio seeks a UI/UX Designer to design elegant user journeys, coherent design systems, and delightful digital product interactions.

Key Responsibilities:
• Conduct user research, customer interviews, and usability tests to identify user friction points.
• Create detailed wireframes, high-fidelity mockups, and interactive prototypes in Figma.
• Maintain and evolve a comprehensive component design system across web and mobile.
• Partner closely with frontend engineers to ensure high design fidelity during implementation.

Requirements:
• 3+ years of professional product or UI/UX design experience.
• Portfolio demonstrating mastery of Figma, user research methodology, and typography/hierarchy.
• Empathy for user needs, accessibility principles, and clean visual aesthetics.`,
  },
  {
    id: "preset_product_mgr",
    title: "Product Manager",
    category: "Product Management",
    company: "Strata Ventures",
    location: "New York, NY (Hybrid)",
    experienceRequired: 3,
    educationRequired: "Bachelor's Degree in Business, Computer Science, or related field",
    requiredSkills: ["Product Management", "Roadmap Planning", "Agile", "User Stories", "Stakeholder Management", "Data Analysis", "Feature Prioritization"],
    preferredSkills: ["Jira", "A/B Testing", "Market Research", "Scrum Master", "Product Analytics"],
    description: `Strata Ventures is hiring a Product Manager to define product strategy, roadmap execution, and lead agile cross-functional delivery teams.

Key Responsibilities:
• Define product vision, feature requirements, and strategic roadmaps aligned with customer value.
• Author user stories, acceptance criteria, and manage agile sprint backlogs.
• Partner with engineering, UX design, sales, and marketing to bring features from concept to launch.
• Measure adoption metrics, retention funnels, and iterate based on quantitative customer feedback.

Requirements:
• 3+ years experience as a Product Manager in tech or SaaS software.
• Exceptional communication, prioritization, and stakeholder management skills.
• Data-driven mindset with comfort querying metrics and interpreting user telemetry.`,
  },
];

export function getPredefinedJobByTitle(title: string): PredefinedJobTemplate | undefined {
  return PREDEFINED_JOB_TEMPLATES.find(
    j => j.title.toLowerCase() === title.toLowerCase() ||
         j.title.toLowerCase().includes(title.toLowerCase())
  );
}

export function convertTemplateToJobDescription(template: PredefinedJobTemplate): JobDescription {
  return {
    id: template.id,
    userId: 'system',
    title: template.title,
    company: template.company,
    location: template.location,
    category: template.category,
    description: template.description,
    requiredSkills: template.requiredSkills,
    preferredSkills: template.preferredSkills,
    experienceRequired: template.experienceRequired,
    educationRequired: template.educationRequired,
    createdAt: new Date().toISOString(),
  };
}
