export interface JobRoleDefinition {
  id: string;
  title: string;
  category: 'engineering' | 'ai_data' | 'cloud_infrastructure' | 'security' | 'design_product';
  requiredSkills: string[];
  preferredSkills: string[];
  typicalEducation: string[];
  minYearsExp: number;
  relatedSkills: string[];
  relatedRoles: string[];
  description: string;
  skillWeights: Record<string, number>;
}

export const JOB_ROLES_DATABASE: JobRoleDefinition[] = [
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    category: "ai_data",
    requiredSkills: ["Python", "Machine Learning", "Scikit-Learn", "PyTorch", "Deep Learning", "SQL"],
    preferredSkills: ["TensorFlow", "Docker", "Kubernetes", "MLflow", "Pandas", "NumPy", "Git", "CI/CD"],
    typicalEducation: ["Bachelor's in Computer Science", "Master's in Data Science", "Master's in AI/ML"],
    minYearsExp: 2,
    relatedSkills: ["Computer Vision", "Natural Language Processing", "Large Language Models", "CUDA"],
    relatedRoles: ["Data Scientist", "AI Engineer", "Deep Learning Specialist", "Data Engineer"],
    description: "Designs, builds, and deploys scalable machine learning models and inference pipelines to production environments.",
    skillWeights: { "python": 1.5, "machine learning": 1.5, "pytorch": 1.4, "tensorflow": 1.3, "deep learning": 1.3, "scikit-learn": 1.2, "sql": 1.0 }
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "ai_data",
    requiredSkills: ["Python", "SQL", "Data Analysis", "Machine Learning", "Statistics", "Pandas"],
    preferredSkills: ["NumPy", "Tableau", "Power BI", "Scikit-Learn", "R", "A/B Testing", "Data Visualization"],
    typicalEducation: ["Bachelor's in Mathematics/Statistics", "Master's in Data Science", "Computer Science"],
    minYearsExp: 2,
    relatedSkills: ["Predictive Modeling", "Big Data", "Apache Spark", "Storytelling with Data"],
    relatedRoles: ["Machine Learning Engineer", "Data Analyst", "Business Intelligence Engineer"],
    description: "Extracts actionable insights from complex multi-dimensional datasets through hypothesis testing, statistical analysis, and predictive modeling.",
    skillWeights: { "python": 1.4, "sql": 1.4, "statistics": 1.4, "machine learning": 1.3, "pandas": 1.2, "data analysis": 1.3 }
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    category: "ai_data",
    requiredSkills: ["Python", "Large Language Models", "PyTorch", "REST APIs", "Prompt Engineering", "RAG"],
    preferredSkills: ["Vector Databases", "LangChain", "Docker", "FastAPI", "TensorFlow", "Cloud Computing"],
    typicalEducation: ["Bachelor's or Master's in Computer Science / Artificial Intelligence"],
    minYearsExp: 2,
    relatedSkills: ["Agentic AI", "Fine-Tuning", "Natural Language Processing", "OpenAI API"],
    relatedRoles: ["Machine Learning Engineer", "NLP Specialist", "Full Stack Developer"],
    description: "Integrates cutting-edge Generative AI models, agentic workflows, and semantic retrieval systems into enterprise software products.",
    skillWeights: { "python": 1.4, "large language models": 1.6, "rag": 1.5, "pytorch": 1.2, "rest api": 1.1 }
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "ai_data",
    requiredSkills: ["SQL", "Data Analysis", "Excel", "Tableau", "Power BI", "Communication"],
    preferredSkills: ["Python", "Pandas", "Statistics", "Data Cleaning", "Business Intelligence"],
    typicalEducation: ["Bachelor's in Business Analytics, Economics, Statistics, or Computer Science"],
    minYearsExp: 1,
    relatedSkills: ["Dashboard Creation", "ETL", "Reporting", "KPI Tracking"],
    relatedRoles: ["Data Scientist", "Business Analyst", "Marketing Analytics Specialist"],
    description: "Interprets business metrics, builds automated dashboards, cleans datasets, and presents executive summaries for strategic decision-making.",
    skillWeights: { "sql": 1.5, "data analysis": 1.5, "tableau": 1.3, "power bi": 1.3, "excel": 1.2, "python": 1.0 }
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "engineering",
    requiredSkills: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Tailwind CSS"],
    preferredSkills: ["Next.js", "Redux", "REST APIs", "Git", "Responsive Design", "Jest"],
    typicalEducation: ["Bachelor's in Computer Science or Software Engineering"],
    minYearsExp: 2,
    relatedSkills: ["Vue.js", "Web Performance", "Accessibility (a11y)", "UI/UX Prototyping"],
    relatedRoles: ["Full Stack Developer", "UI/UX Engineer", "Web Developer"],
    description: "Constructs responsive, high-performance web user interfaces, reusable design systems, and client-side web application architectures.",
    skillWeights: { "react": 1.6, "typescript": 1.5, "javascript": 1.4, "tailwind css": 1.2, "html": 1.1, "css": 1.1 }
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "engineering",
    requiredSkills: ["Node.js", "Python", "SQL", "PostgreSQL", "REST APIs", "Git"],
    preferredSkills: ["Docker", "Redis", "TypeScript", "Microservices", "CI/CD", "AWS"],
    typicalEducation: ["Bachelor's in Computer Science or Information Systems"],
    minYearsExp: 2,
    relatedSkills: ["Express.js", "Django", "FastAPI", "Go", "GraphQL", "Authentication"],
    relatedRoles: ["Full Stack Developer", "Software Engineer", "DevOps Engineer"],
    description: "Architects scalable server-side systems, high-throughput microservices, robust relational databases, and enterprise REST/GraphQL APIs.",
    skillWeights: { "node.js": 1.4, "python": 1.3, "sql": 1.4, "postgresql": 1.3, "rest api": 1.4, "docker": 1.2 }
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    category: "engineering",
    requiredSkills: ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "REST APIs"],
    preferredSkills: ["Next.js", "PostgreSQL", "Docker", "Tailwind CSS", "Git", "AWS"],
    typicalEducation: ["Bachelor's in Computer Science, Software Engineering, or equivalent"],
    minYearsExp: 2,
    relatedSkills: ["Express.js", "MongoDB", "Redis", "CI/CD", "Full Stack Architecture"],
    relatedRoles: ["Frontend Developer", "Backend Developer", "Software Engineer"],
    description: "Bridges client-side interfaces and server-side infrastructure, owning end-to-end feature delivery from database models to reactive web pages.",
    skillWeights: { "react": 1.4, "node.js": 1.4, "typescript": 1.4, "sql": 1.3, "rest api": 1.2, "docker": 1.1 }
  },
  {
    id: "python-developer",
    title: "Python Developer",
    category: "engineering",
    requiredSkills: ["Python", "SQL", "Django", "FastAPI", "Git", "REST APIs"],
    preferredSkills: ["PostgreSQL", "Docker", "Linux", "Celery", "Redis", "Pytest"],
    typicalEducation: ["Bachelor's in Computer Science or relevant technical discipline"],
    minYearsExp: 2,
    relatedSkills: ["Flask", "Asyncio", "Data Structures", "Microservices", "OOP"],
    relatedRoles: ["Backend Developer", "Machine Learning Engineer", "Data Engineer"],
    description: "Develops clean, asynchronous Python backends, automation scripts, data extraction engines, and resilient web services.",
    skillWeights: { "python": 1.8, "fastapi": 1.4, "django": 1.4, "sql": 1.3, "rest api": 1.2 }
  },
  {
    id: "java-developer",
    title: "Java Developer",
    category: "engineering",
    requiredSkills: ["Java", "Spring Boot", "SQL", "REST APIs", "Git", "Microservices"],
    preferredSkills: ["Hibernate", "PostgreSQL", "Docker", "Kubernetes", "Kafka", "Maven"],
    typicalEducation: ["Bachelor's in Computer Science or Information Technology"],
    minYearsExp: 2,
    relatedSkills: ["Spring Cloud", "JUnit", "CI/CD", "Enterprise Architecture"],
    relatedRoles: ["Backend Developer", "Software Architect", "Systems Engineer"],
    description: "Builds enterprise-grade, mission-critical distributed services, transactional backends, and Spring Boot microservices.",
    skillWeights: { "java": 1.8, "spring boot": 1.6, "sql": 1.3, "microservices": 1.3, "docker": 1.1 }
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "cloud_infrastructure",
    requiredSkills: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS", "Git"],
    preferredSkills: ["Terraform", "Ansible", "Python", "Bash", "Prometheus", "Grafana"],
    typicalEducation: ["Bachelor's in Computer Science, Systems Engineering, or equivalent"],
    minYearsExp: 3,
    relatedSkills: ["Infrastructure as Code", "GCP", "Azure", "Helm", "Security Compliance"],
    relatedRoles: ["Cloud Engineer", "Site Reliability Engineer (SRE)", "Platform Engineer"],
    description: "Automates software delivery pipelines, manages containerized orchestration clusters, and guarantees system resilience and continuous deployments.",
    skillWeights: { "docker": 1.6, "kubernetes": 1.6, "ci/cd": 1.5, "aws": 1.4, "linux": 1.3, "terraform": 1.3 }
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    category: "cloud_infrastructure",
    requiredSkills: ["AWS", "Terraform", "Docker", "Linux", "Networking", "Security"],
    preferredSkills: ["Kubernetes", "Azure", "GCP", "Python", "CI/CD", "Cloud Architecture"],
    typicalEducation: ["Bachelor's in Computer Science or Cloud Computing"],
    minYearsExp: 3,
    relatedSkills: ["Serverless", "IAM", "VPC", "Cost Optimization", "High Availability"],
    relatedRoles: ["DevOps Engineer", "Cloud Architect", "Systems Administrator"],
    description: "Provisions, architectures, and monitors multi-cloud and hybrid environments focusing on scalability, security compliance, and disaster recovery.",
    skillWeights: { "aws": 1.6, "terraform": 1.5, "docker": 1.3, "linux": 1.2, "azure": 1.2, "gcp": 1.2 }
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "security",
    requiredSkills: ["Linux", "Networking", "Vulnerability Assessment", "Firewalls", "SIEM", "Incident Response"],
    preferredSkills: ["Python", "Penetration Testing", "Wireshark", "SOC", "Cloud Security", "CompTIA Security+"],
    typicalEducation: ["Bachelor's in Cybersecurity, Information Assurance, or Computer Science"],
    minYearsExp: 2,
    relatedSkills: ["Zero Trust", "Threat Modeling", "Cryptography", "Compliance (SOC2/ISO)"],
    relatedRoles: ["Security Engineer", "SOC Analyst", "Information Security Officer"],
    description: "Monitors security telemetry, evaluates vulnerability vectors, executes threat hunts, and defends network boundaries against intrusions.",
    skillWeights: { "linux": 1.3, "networking": 1.5, "security": 1.6, "vulnerability assessment": 1.5, "incident response": 1.4 }
  },
  {
    id: "database-administrator",
    title: "Database Administrator (DBA)",
    category: "engineering",
    requiredSkills: ["SQL", "PostgreSQL", "MySQL", "Database Tuning", "Backups & Recovery", "Linux"],
    preferredSkills: ["Oracle", "Redis", "MongoDB", "High Availability", "Replication", "Python"],
    typicalEducation: ["Bachelor's in Information Technology or Computer Science"],
    minYearsExp: 3,
    relatedSkills: ["Query Optimization", "Index Strategy", "ETL", "Database Sharding"],
    relatedRoles: ["Data Engineer", "Backend Developer", "Systems Administrator"],
    description: "Guarantees database performance, schema integrity, zero-data-loss recovery systems, query indexing, and access permissions.",
    skillWeights: { "sql": 1.7, "postgresql": 1.6, "mysql": 1.4, "database": 1.5, "linux": 1.2 }
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    category: "ai_data",
    requiredSkills: ["Python", "SQL", "Apache Spark", "ETL", "Data Pipelines", "PostgreSQL"],
    preferredSkills: ["Airflow", "Kafka", "AWS", "BigQuery", "Snowflake", "Docker"],
    typicalEducation: ["Bachelor's or Master's in Computer Science or Software Engineering"],
    minYearsExp: 2,
    relatedSkills: ["Data Warehousing", "Distributed Systems", "Hadoop", "Data Modeling"],
    relatedRoles: ["Data Scientist", "Backend Developer", "Big Data Architect"],
    description: "Constructs distributed data streaming and batch pipelines that transform raw data streams into optimized analytical data lakes.",
    skillWeights: { "sql": 1.5, "python": 1.5, "apache spark": 1.6, "etl": 1.4, "data pipeline": 1.4 }
  },
  {
    id: "sre-engineer",
    title: "Site Reliability Engineer (SRE)",
    category: "cloud_infrastructure",
    requiredSkills: ["Linux", "Kubernetes", "Docker", "Monitoring", "Go", "Python"],
    preferredSkills: ["Prometheus", "Grafana", "SLO/SLA Management", "Incident Response", "Terraform"],
    typicalEducation: ["Bachelor's in Computer Science or Computer Engineering"],
    minYearsExp: 3,
    relatedSkills: ["Chaos Engineering", "Distributed Tracing", "Post-Mortems", "High Availability"],
    relatedRoles: ["DevOps Engineer", "Cloud Engineer", "Infrastructure Engineer"],
    description: "Applies software engineering principles to infrastructure and operations to ensure uptime, observability, and rapid incident resolution.",
    skillWeights: { "kubernetes": 1.5, "linux": 1.5, "docker": 1.3, "python": 1.2, "go": 1.2 }
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    category: "engineering",
    requiredSkills: ["Selenium", "Cypress", "Python", "JavaScript", "Test Automation", "Git"],
    preferredSkills: ["Jest", "Playwright", "CI/CD", "API Testing", "Postman", "Bug Tracking"],
    typicalEducation: ["Bachelor's in Computer Science or Software Engineering"],
    minYearsExp: 2,
    relatedSkills: ["Regression Testing", "Test Driven Development (TDD)", "Performance Testing"],
    relatedRoles: ["Software Developer in Test (SDET)", "Software Engineer", "Manual Tester"],
    description: "Designs automated end-to-end, regression, and API testing suites to guarantee flawless software functionality across release cycles.",
    skillWeights: { "test automation": 1.6, "python": 1.2, "javascript": 1.2, "selenium": 1.4, "git": 1.1 }
  },
  {
    id: "mobile-developer",
    title: "Mobile App Developer",
    category: "engineering",
    requiredSkills: ["React Native", "JavaScript", "TypeScript", "Mobile UI", "REST APIs", "Git"],
    preferredSkills: ["iOS", "Android", "Swift", "Kotlin", "Flutter", "App Store Deployment"],
    typicalEducation: ["Bachelor's in Computer Science or equivalent"],
    minYearsExp: 2,
    relatedSkills: ["Push Notifications", "Offline Storage", "State Management", "Mobile Performance"],
    relatedRoles: ["Frontend Developer", "iOS Engineer", "Android Engineer"],
    description: "Develops cross-platform or native smartphone applications with seamless gesture interactions, offline caching, and responsive layouts.",
    skillWeights: { "react native": 1.6, "javascript": 1.3, "typescript": 1.3, "mobile": 1.5, "rest api": 1.2 }
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    category: "design_product",
    requiredSkills: ["Figma", "UI Design", "User Research", "Wireframing", "Prototyping", "Design Systems"],
    preferredSkills: ["HTML", "CSS", "Usability Testing", "Information Architecture", "Adobe XD"],
    typicalEducation: ["Bachelor's in Design, HCI (Human-Computer Interaction), or Digital Media"],
    minYearsExp: 2,
    relatedSkills: ["Design Thinking", "Interaction Design", "Accessibility", "Visual Hierarchy"],
    relatedRoles: ["Product Designer", "Frontend Developer", "UX Researcher"],
    description: "Creates intuitive user journeys, wireframes, and scalable design component libraries validated through usability testing.",
    skillWeights: { "figma": 1.8, "ui design": 1.6, "wireframing": 1.4, "prototyping": 1.4, "user research": 1.3 }
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    category: "design_product",
    requiredSkills: ["Requirements Gathering", "Agile", "SQL", "Data Analysis", "Communication", "Process Mapping"],
    preferredSkills: ["Excel", "Jira", "UML", "Tableau", "Stakeholder Management"],
    typicalEducation: ["Bachelor's in Business Administration, Information Systems, or Engineering"],
    minYearsExp: 2,
    relatedSkills: ["Product Backlog", "User Stories", "Gap Analysis", "Financial Modeling"],
    relatedRoles: ["Product Manager", "Data Analyst", "Project Manager"],
    description: "Synthesizes stakeholder requirements into structured user stories, functional specifications, and strategic process improvements.",
    skillWeights: { "requirements gathering": 1.6, "agile": 1.4, "sql": 1.2, "data analysis": 1.3, "communication": 1.4 }
  },
  {
    id: "embedded-systems-engineer",
    title: "Embedded Systems Engineer",
    category: "engineering",
    requiredSkills: ["C", "C++", "Microcontrollers", "RTOS", "Linux", "Hardware Debugging"],
    preferredSkills: ["ARM", "I2C/SPI/UART", "PCB Design", "Python", "Git", "Oscilloscopes"],
    typicalEducation: ["Bachelor's or Master's in Electrical Engineering, Computer Engineering"],
    minYearsExp: 2,
    relatedSkills: ["IoT", "Firmware Development", "Low-Level Programming", "Device Drivers"],
    relatedRoles: ["Firmware Engineer", "Hardware Engineer", "IoT Solutions Architect"],
    description: "Writes low-level firmware for microcontrollers, sensors, and real-time operating systems in resource-constrained IoT devices.",
    skillWeights: { "c": 1.8, "c++": 1.6, "embedded systems": 1.6, "linux": 1.2 }
  }
];
