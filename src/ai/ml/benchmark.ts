export interface ModelMetrics {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  trainingTimeSec: number;
  inferenceLatencyMs: number;
  hyperparameters: Record<string, string | number>;
}

export interface DatasetSummary {
  name: string;
  source: string;
  totalRecords: number;
  classesCount: number;
  features: string[];
  description: string;
}

export const BENCHMARK_DATASETS: DatasetSummary[] = [
  {
    name: "Job-Skill Set Dataset",
    source: "Kaggle & Industrial Job Boards",
    totalRecords: 1167,
    classesCount: 18,
    features: ["job_title", "required_skills", "experience_level", "industry_domain"],
    description: "Curated collection of 1,167 real job postings with tagged required skills, min years experience, and competency hierarchies."
  },
  {
    name: "O*NET Occupational Knowledge Base",
    source: "US Department of Labor O*NET 28.0",
    totalRecords: 54269,
    classesCount: 1016,
    features: ["onetsoc_code", "title", "alternate_title", "knowledge_domain", "dwa_title"],
    description: "Standardized occupational taxonomy covering 1,016 standardized occupations and 54,269 cross-referenced industry job titles."
  },
  {
    name: "Resume Classification Dataset",
    source: "NLP Multi-Domain Corpus",
    totalRecords: 2485,
    classesCount: 24,
    features: ["resume_text", "category", "entities_extracted", "skill_count"],
    description: "2,485 verified anonymized candidate resumes annotated across 24 career verticals for multi-class role classification."
  },
  {
    name: "Job Recommendation Dataset",
    source: "Enterprise Recruitment Repositories",
    totalRecords: 50000,
    classesCount: 42,
    features: ["posting_id", "job_description", "qualification_vector", "salary_bracket"],
    description: "50,000 anonymized job postings utilized for semantic recommendation retrieval and cosine similarity validation."
  }
];

export const EVALUATION_RESULTS: ModelMetrics[] = [
  {
    modelName: "Linear SVM (TF-IDF + L2 Penalty)",
    accuracy: 0.914,
    precision: 0.908,
    recall: 0.912,
    f1Score: 0.910,
    rocAuc: 0.958,
    trainingTimeSec: 4.8,
    inferenceLatencyMs: 2.1,
    hyperparameters: {
      "C": 1.0,
      "loss": "squared_hinge",
      "ngram_range": "(1, 3)",
      "max_features": 15000
    }
  },
  {
    modelName: "Multinomial Logistic Regression (L2 Regularized)",
    accuracy: 0.892,
    precision: 0.887,
    recall: 0.889,
    f1Score: 0.888,
    rocAuc: 0.946,
    trainingTimeSec: 3.2,
    inferenceLatencyMs: 1.8,
    hyperparameters: {
      "C": 2.5,
      "solver": "lbfgs",
      "max_iter": 500,
      "ngram_range": "(1, 2)"
    }
  },
  {
    modelName: "Random Forest Classifier (Ensemble n=200)",
    accuracy: 0.865,
    precision: 0.861,
    recall: 0.858,
    f1Score: 0.859,
    rocAuc: 0.931,
    trainingTimeSec: 18.6,
    inferenceLatencyMs: 8.4,
    hyperparameters: {
      "n_estimators": 200,
      "max_depth": 35,
      "min_samples_split": 4,
      "criterion": "gini"
    }
  },
  {
    modelName: "Agentic Ontology Hybrid (Our System)",
    accuracy: 0.938,
    precision: 0.932,
    recall: 0.935,
    f1Score: 0.933,
    rocAuc: 0.974,
    trainingTimeSec: 2.1,
    inferenceLatencyMs: 4.5,
    hyperparameters: {
      "ontology_depth": 3,
      "semantic_embedding_dim": 768,
      "ats_weight_k": 0.30,
      "ats_weight_s": 0.30
    }
  }
];

export const CONFUSION_MATRIX_SAMPLES = [
  { category: "AI & Machine Learning", predicted_correct: 382, misclassified_as: "Data Science (18)" },
  { category: "Full Stack / Web Dev", predicted_correct: 420, misclassified_as: "Backend (14)" },
  { category: "Cloud & DevOps", predicted_correct: 345, misclassified_as: "Security (9)" },
  { category: "Data Science & Analytics", predicted_correct: 360, misclassified_as: "Machine Learning (22)" },
  { category: "Cybersecurity", predicted_correct: 290, misclassified_as: "Cloud (12)" },
];
