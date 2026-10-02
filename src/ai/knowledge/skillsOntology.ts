export interface SkillNode {
  name: string;
  category: 'programming_language' | 'framework' | 'database' | 'cloud_devops' | 'ai_ml' | 'data_engineering' | 'soft_skill' | 'security' | 'tool';
  synonyms: string[];
  parents?: string[];
  children?: string[];
  related?: string[];
}

export const SKILLS_ONTOLOGY: Record<string, SkillNode> = {
  // AI & Machine Learning
  "machine learning": {
    name: "Machine Learning",
    category: "ai_ml",
    synonyms: ["ml", "statistical learning", "predictive modeling"],
    children: ["scikit-learn", "deep learning", "supervised learning", "unsupervised learning", "xgboost", "random forest"],
    related: ["data science", "python", "statistics"]
  },
  "deep learning": {
    name: "Deep Learning",
    category: "ai_ml",
    synonyms: ["dl", "neural networks", "artificial neural networks"],
    parents: ["machine learning"],
    children: ["pytorch", "tensorflow", "keras", "transformers", "cnn", "rnn", "lstm"],
    related: ["computer vision", "natural language processing"]
  },
  "pytorch": {
    name: "PyTorch",
    category: "framework",
    synonyms: ["torch"],
    parents: ["deep learning"],
    related: ["python", "tensorflow", "cuda"]
  },
  "tensorflow": {
    name: "TensorFlow",
    category: "framework",
    synonyms: ["tf"],
    parents: ["deep learning"],
    children: ["keras", "tflite"],
    related: ["pytorch", "python"]
  },
  "scikit-learn": {
    name: "Scikit-Learn",
    category: "framework",
    synonyms: ["sklearn", "scikit learn"],
    parents: ["machine learning"],
    related: ["python", "pandas", "numpy"]
  },
  "natural language processing": {
    name: "Natural Language Processing",
    category: "ai_ml",
    synonyms: ["nlp", "text mining", "computational linguistics"],
    parents: ["machine learning"],
    children: ["spacy", "nltk", "hugging face", "bert", "gpt", "large language models"],
    related: ["deep learning", "python"]
  },
  "large language models": {
    name: "Large Language Models",
    category: "ai_ml",
    synonyms: ["llm", "llms", "generative ai", "genai", "prompt engineering", "rag"],
    parents: ["natural language processing"],
    related: ["langchain", "llamaindex", "openai", "gemini"]
  },
  "computer vision": {
    name: "Computer Vision",
    category: "ai_ml",
    synonyms: ["cv", "image processing", "object detection"],
    parents: ["deep learning"],
    children: ["opencv", "yolo", "segmentation"],
    related: ["pytorch", "tensorflow"]
  },

  // Programming Languages
  "python": {
    name: "Python",
    category: "programming_language",
    synonyms: ["py", "python3"],
    related: ["django", "fastapi", "flask", "pandas", "numpy", "machine learning"]
  },
  "javascript": {
    name: "JavaScript",
    category: "programming_language",
    synonyms: ["js", "es6", "ecmascript"],
    related: ["typescript", "react", "node.js", "frontend", "web development"]
  },
  "typescript": {
    name: "TypeScript",
    category: "programming_language",
    synonyms: ["ts"],
    parents: ["javascript"],
    related: ["react", "node.js", "next.js", "angular", "vue"]
  },
  "java": {
    name: "Java",
    category: "programming_language",
    synonyms: ["java8", "java11", "java17", "jdk"],
    related: ["spring boot", "spring", "jvm", "kotlin", "backend"]
  },
  "c++": {
    name: "C++",
    category: "programming_language",
    synonyms: ["cpp", "c plus plus"],
    related: ["c", "embedded systems", "cuda", "performance"]
  },
  "c#": {
    name: "C#",
    category: "programming_language",
    synonyms: ["csharp", "c sharp", ".net"],
    related: ["asp.net", "dotnet core", "azure"]
  },
  "go": {
    name: "Go",
    category: "programming_language",
    synonyms: ["golang"],
    related: ["kubernetes", "docker", "microservices", "backend"]
  },
  "rust": {
    name: "Rust",
    category: "programming_language",
    synonyms: ["rustlang"],
    related: ["systems programming", "webassembly", "concurrency"]
  },
  "sql": {
    name: "SQL",
    category: "programming_language",
    synonyms: ["structured query language", "rdbms"],
    children: ["postgresql", "mysql", "sqlite", "oracle", "sql server"],
    related: ["database", "data analysis", "data engineering"]
  },

  // Frontend & Web
  "react": {
    name: "React",
    category: "framework",
    synonyms: ["react.js", "reactjs"],
    parents: ["javascript"],
    children: ["next.js", "redux", "react query", "react native"],
    related: ["typescript", "tailwind css", "html", "css", "frontend"]
  },
  "next.js": {
    name: "Next.js",
    category: "framework",
    synonyms: ["nextjs", "next"],
    parents: ["react"],
    related: ["server-side rendering", "typescript", "tailwind css"]
  },
  "vue": {
    name: "Vue.js",
    category: "framework",
    synonyms: ["vue", "vuejs", "vue3"],
    parents: ["javascript"],
    children: ["nuxt.js", "pinia", "vuex"],
    related: ["typescript", "frontend"]
  },
  "angular": {
    name: "Angular",
    category: "framework",
    synonyms: ["angularjs", "angular 2+"],
    parents: ["typescript"],
    related: ["rxjs", "frontend", "spa"]
  },
  "html": {
    name: "HTML",
    category: "programming_language",
    synonyms: ["html5", "semantic html"],
    related: ["css", "javascript", "web development"]
  },
  "css": {
    name: "CSS",
    category: "programming_language",
    synonyms: ["css3", "styles", "sass", "scss"],
    children: ["tailwind css", "bootstrap"],
    related: ["html", "ui design", "responsive design"]
  },
  "tailwind css": {
    name: "Tailwind CSS",
    category: "framework",
    synonyms: ["tailwind", "tailwindcss"],
    parents: ["css"],
    related: ["react", "frontend", "responsive design"]
  },

  // Backend
  "node.js": {
    name: "Node.js",
    category: "framework",
    synonyms: ["nodejs", "node"],
    parents: ["javascript"],
    children: ["express", "nest.js", "koa", "fastify"],
    related: ["backend", "rest apis", "typescript"]
  },
  "express": {
    name: "Express.js",
    category: "framework",
    synonyms: ["express", "expressjs"],
    parents: ["node.js"],
    related: ["rest api", "backend"]
  },
  "django": {
    name: "Django",
    category: "framework",
    synonyms: ["django rest framework", "drf"],
    parents: ["python"],
    related: ["backend", "postgresql", "python"]
  },
  "fastapi": {
    name: "FastAPI",
    category: "framework",
    synonyms: ["fast api"],
    parents: ["python"],
    related: ["asyncio", "pydantic", "swagger", "backend"]
  },
  "spring boot": {
    name: "Spring Boot",
    category: "framework",
    synonyms: ["spring", "spring framework", "springboot"],
    parents: ["java"],
    related: ["microservices", "hibernate", "maven"]
  },
  "rest api": {
    name: "REST APIs",
    category: "framework",
    synonyms: ["restful api", "rest", "web services", "api development"],
    related: ["graphql", "grpc", "http", "json", "postman"]
  },
  "graphql": {
    name: "GraphQL",
    category: "framework",
    synonyms: ["apollo", "relay"],
    related: ["rest api", "apollo server"]
  },

  // Cloud & DevOps
  "docker": {
    name: "Docker",
    category: "cloud_devops",
    synonyms: ["containerization", "containers", "dockerfile", "docker compose"],
    children: ["kubernetes"],
    related: ["devops", "ci/cd", "microservices"]
  },
  "kubernetes": {
    name: "Kubernetes",
    category: "cloud_devops",
    synonyms: ["k8s", "k8", "kube"],
    parents: ["docker"],
    children: ["helm"],
    related: ["cloud", "devops", "aws", "gcp", "azure"]
  },
  "aws": {
    name: "AWS",
    category: "cloud_devops",
    synonyms: ["amazon web services", "amazon aws"],
    children: ["ec2", "s3", "lambda", "ecs", "eks", "rds", "dynamodb"],
    related: ["cloud computing", "gcp", "azure"]
  },
  "azure": {
    name: "Microsoft Azure",
    category: "cloud_devops",
    synonyms: ["azure", "ms azure"],
    children: ["azure devops", "azure functions", "aks"],
    related: ["cloud computing", "aws"]
  },
  "gcp": {
    name: "Google Cloud Platform",
    category: "cloud_devops",
    synonyms: ["gcp", "google cloud"],
    children: ["bigquery", "cloud run", "gke", "cloud functions"],
    related: ["cloud computing", "aws"]
  },
  "ci/cd": {
    name: "CI/CD",
    category: "cloud_devops",
    synonyms: ["continuous integration", "continuous deployment", "pipelines"],
    children: ["github actions", "gitlab ci", "jenkins", "circleci"],
    related: ["devops", "git", "docker"]
  },
  "git": {
    name: "Git",
    category: "tool",
    synonyms: ["github", "gitlab", "version control", "bitbucket"],
    related: ["ci/cd", "devops", "code review"]
  },
  "terraform": {
    name: "Terraform",
    category: "cloud_devops",
    synonyms: ["iac", "infrastructure as code", "hcl"],
    related: ["aws", "azure", "gcp", "devops"]
  },
  "linux": {
    name: "Linux",
    category: "tool",
    synonyms: ["ubuntu", "debian", "centos", "redhat", "bash", "shell scripting"],
    related: ["devops", "sysadmin", "server administration"]
  },

  // Databases
  "postgresql": {
    name: "PostgreSQL",
    category: "database",
    synonyms: ["postgres", "pgsql"],
    parents: ["sql"],
    related: ["database", "mysql", "prisma", "drizzle"]
  },
  "mongodb": {
    name: "MongoDB",
    category: "database",
    synonyms: ["mongo", "nosql", "documentdb"],
    related: ["database", "mongoose", "node.js"]
  },
  "redis": {
    name: "Redis",
    category: "database",
    synonyms: ["caching", "in-memory database"],
    related: ["caching", "pubsub", "session store"]
  },
  "mysql": {
    name: "MySQL",
    category: "database",
    synonyms: ["mariadb"],
    parents: ["sql"],
    related: ["postgresql", "database"]
  },

  // Data Engineering & Analytics
  "pandas": {
    name: "Pandas",
    category: "framework",
    synonyms: ["dataframe", "data manipulation"],
    parents: ["python"],
    related: ["numpy", "data analysis", "scipy"]
  },
  "numpy": {
    name: "NumPy",
    category: "framework",
    synonyms: ["numerical python"],
    parents: ["python"],
    related: ["pandas", "scipy", "matrix computation"]
  },
  "data analysis": {
    name: "Data Analysis",
    category: "data_engineering",
    synonyms: ["data analytics", "exploratory data analysis", "eda"],
    children: ["pandas", "sql", "excel", "power bi", "tableau"],
    related: ["statistics", "data science"]
  },
  "power bi": {
    name: "Power BI",
    category: "tool",
    synonyms: ["powerbi", "dax"],
    related: ["data visualization", "business intelligence", "tableau", "excel"]
  },
  "tableau": {
    name: "Tableau",
    category: "tool",
    synonyms: ["tableau desktop"],
    related: ["data visualization", "power bi", "analytics"]
  },
  "apache spark": {
    name: "Apache Spark",
    category: "data_engineering",
    synonyms: ["spark", "pyspark"],
    children: ["databricks"],
    related: ["hadoop", "big data", "data pipeline"]
  },

  // Soft Skills
  "communication": {
    name: "Communication",
    category: "soft_skill",
    synonyms: ["verbal communication", "written communication", "presentation skills", "interpersonal skills"],
    related: ["teamwork", "leadership"]
  },
  "problem solving": {
    name: "Problem Solving",
    category: "soft_skill",
    synonyms: ["analytical thinking", "critical thinking", "troubleshooting"],
    related: ["debugging", "innovation"]
  },
  "leadership": {
    name: "Leadership",
    category: "soft_skill",
    synonyms: ["mentoring", "team lead", "technical lead", "project management"],
    related: ["agile", "scrum"]
  },
  "agile": {
    name: "Agile Methodologies",
    category: "soft_skill",
    synonyms: ["scrum", "kanban", "sprint planning", "jira"],
    related: ["team collaboration", "project management"]
  }
};

/**
 * Normalizes a skill string (lowercase, remove punctuation, strip common noise)
 */
export function normalizeSkill(skill: string): string {
  if (!skill) return "";
  let clean = skill.toLowerCase().trim();
  clean = clean.replace(/^(experience with|knowledge of|proficiency in|strong in|hands-on with)\s+/i, '');
  clean = clean.replace(/[,\.;:\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Direct canonical synonym check
  for (const [key, node] of Object.entries(SKILLS_ONTOLOGY)) {
    if (key === clean || node.name.toLowerCase() === clean) {
      return key;
    }
    if (node.synonyms.some(s => s.toLowerCase() === clean)) {
      return key;
    }
  }

  return clean;
}

/**
 * Checks if two skills match or are semantically connected via the ontology.
 * Returns:
 * 1.0 = exact or synonym match
 * 0.8 = parent-child relationship (e.g., PyTorch -> Deep Learning)
 * 0.6 = related skill (e.g., PyTorch <-> TensorFlow, React <-> TypeScript)
 * 0.0 = no known connection
 */
export function calculateOntologyMatchScore(skillA: string, skillB: string): { score: number; reason?: string } {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);

  if (normA === normB && normA.length > 0) {
    return { score: 1.0, reason: "Direct exact or synonym match" };
  }

  const nodeA = SKILLS_ONTOLOGY[normA];
  const nodeB = SKILLS_ONTOLOGY[normB];

  if (!nodeA || !nodeB) {
    // Substring fallback
    if (normA.includes(normB) || normB.includes(normA)) {
      return { score: 0.85, reason: "High lexical substring overlap" };
    }
    return { score: 0.0 };
  }

  // Check parent-child
  if (nodeA.children?.includes(normB) || nodeB.parents?.includes(normA)) {
    return { score: 0.85, reason: `${nodeB.name} is a direct specialized implementation of ${nodeA.name}` };
  }
  if (nodeB.children?.includes(normA) || nodeA.parents?.includes(normB)) {
    return { score: 0.85, reason: `${nodeA.name} is a direct specialized implementation of ${nodeB.name}` };
  }

  // Check shared parent
  const commonParents = nodeA.parents?.filter(p => nodeB.parents?.includes(p)) || [];
  if (commonParents.length > 0) {
    return { score: 0.70, reason: `Both skills belong to the same core domain (${commonParents[0]})` };
  }

  // Check related
  if (nodeA.related?.includes(normB) || nodeB.related?.includes(normA)) {
    return { score: 0.65, reason: `${nodeA.name} and ${nodeB.name} are closely paired technologies in industry workflows` };
  }

  return { score: 0.0 };
}
