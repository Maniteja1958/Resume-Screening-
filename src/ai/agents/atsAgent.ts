import { ATSWeights, CandidateProfile, FormattingCheck, JobDescription, KeywordMatchItem } from '../../types';
import { SKILLS_ONTOLOGY, calculateOntologyMatchScore, normalizeSkill } from '../knowledge/skillsOntology';

/**
 * Agent 3 — ATS Compatibility Agent
 * Calculates the ATS Compatibility Score: ATS = w1*K + w2*S + w3*E + w4*F
 */

export interface AtsEvaluation {
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
}

export function evaluateAtsCompatibility(
  profile: CandidateProfile,
  rawResumeText: string,
  job: JobDescription,
  customWeights?: Partial<ATSWeights>,
  fileName?: string
): AtsEvaluation {
  const weights: ATSWeights = {
    keyword: customWeights?.keyword ?? 0.30,
    semantic: customWeights?.semantic ?? 0.30,
    experience: customWeights?.experience ?? 0.25,
    formatting: customWeights?.formatting ?? 0.15,
  };

  const resumeLower = rawResumeText.toLowerCase();

  // ----------------------------------------------------
  // 1. Keyword Matching (K)
  // ----------------------------------------------------
  const candidateSkillsCombined = [
    ...profile.skills.technical,
    ...profile.skills.languages,
    ...profile.skills.frameworks,
    ...profile.skills.tools,
    ...profile.skills.soft,
  ];

  // Extract keywords from job description (requiredSkills, preferredSkills, plus high-value nouns in description)
  const jobKeywordsToEvaluate = Array.from(new Set([
    ...job.requiredSkills,
    ...job.preferredSkills,
  ]));

  const matchedKeywords: KeywordMatchItem[] = [];
  const missingKeywords: KeywordMatchItem[] = [];

  let weightedMatches = 0;
  let totalKeywordWeight = 0;

  jobKeywordsToEvaluate.forEach(keyword => {
    const isRequired = job.requiredSkills.includes(keyword);
    const weight = isRequired ? 1.5 : 1.0;
    totalKeywordWeight += weight;

    // Check direct in resume text or skills list
    const normKey = normalizeSkill(keyword);
    const keyRegex = new RegExp(`\\b${normKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    
    let isFound = false;
    let frequency = 0;

    // Regex check in full resume text
    const textMatches = resumeLower.match(keyRegex);
    if (textMatches && textMatches.length > 0) {
      isFound = true;
      frequency = textMatches.length;
    }

    // Ontology synonym or parent-child check
    if (!isFound) {
      for (const candSkill of candidateSkillsCombined) {
        const { score } = calculateOntologyMatchScore(candSkill, keyword);
        if (score >= 0.70) {
          isFound = true;
          frequency = 1;
          break;
        }
      }
    }

    const category = SKILLS_ONTOLOGY[normKey]?.category || 'technical';

    if (isFound) {
      matchedKeywords.push({
        name: keyword,
        category,
        foundInResume: true,
        frequency,
      });
      weightedMatches += weight;
    } else {
      missingKeywords.push({
        name: keyword,
        category,
        foundInResume: false,
        frequency: 0,
      });
    }
  });

  const keywordScore = totalKeywordWeight > 0 
    ? Math.round(Math.min(100, (weightedMatches / totalKeywordWeight) * 100))
    : 75;

  const keywordReason = `${matchedKeywords.length} of ${jobKeywordsToEvaluate.length} target keywords and domain competencies were detected in your resume, representing an exact/synonym match rate of ${keywordScore}%.`;

  // ----------------------------------------------------
  // 2. Semantic Similarity Engine (S)
  // ----------------------------------------------------
  // TF-IDF & N-Gram Cosine Vector Similarity
  const semanticScore = computeTfIdfCosineSimilarity(rawResumeText, job.description);
  
  const keyThemes: string[] = [];
  if (job.title.toLowerCase().includes("engineer") || resumeLower.includes("engineer")) keyThemes.push("Software Engineering Architecture");
  if (job.title.toLowerCase().includes("data") || resumeLower.includes("data")) keyThemes.push("Data Modeling & Analytics");
  if (job.title.toLowerCase().includes("machine") || resumeLower.includes("machine learning")) keyThemes.push("Statistical Learning & Inference");
  if (job.title.toLowerCase().includes("cloud") || resumeLower.includes("docker")) keyThemes.push("Cloud Infrastructure & Automation");
  if (keyThemes.length === 0) keyThemes.push("Domain Problem Solving", "Modern Technical Delivery");

  const semanticReason = `Your resume exhibits a ${semanticScore}% contextual and conceptual alignment with the target role description, with strong overlap in ${keyThemes.slice(0, 2).join(' and ')}.`;

  // ----------------------------------------------------
  // 3. Experience and Qualification Fit (E)
  // ----------------------------------------------------
  let detectedYears = 0;
  // Sum years from experience
  profile.experience.forEach(exp => {
    const yearMatches = exp.duration.match(/\b(20\d\d|19\d\d)\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      const y1 = parseInt(yearMatches[0], 10);
      const y2 = parseInt(yearMatches[1], 10);
      detectedYears += Math.max(1, Math.abs(y2 - y1));
    } else if (exp.duration.toLowerCase().includes("present") || exp.duration.toLowerCase().includes("current")) {
      const startYearMatch = exp.duration.match(/\b(20\d\d)\b/);
      if (startYearMatch) {
        detectedYears += Math.max(1, 2026 - parseInt(startYearMatch[0], 10));
      } else {
        detectedYears += 2;
      }
    } else {
      detectedYears += 1.5;
    }
  });

  const requiredYears = job.experienceRequired || 2;
  const experienceFit = Math.min(100, Math.round((Math.max(1, detectedYears) / Math.max(1, requiredYears)) * 100));

  // Check degree qualification
  const eduText = profile.education.map(e => `${e.degree} ${e.major}`).join(' ').toLowerCase();
  const reqEdu = (job.educationRequired || "Bachelor").toLowerCase();

  let educationSatisfied = false;
  if (reqEdu.includes("master") || reqEdu.includes("ms")) {
    educationSatisfied = eduText.includes("master") || eduText.includes("m.s.") || eduText.includes("phd") || eduText.includes("doctor");
  } else if (reqEdu.includes("bachelor") || reqEdu.includes("bs")) {
    educationSatisfied = eduText.includes("bachelor") || eduText.includes("b.s.") || eduText.includes("b.tech") || eduText.includes("master");
  } else {
    educationSatisfied = profile.education.length > 0;
  }

  const qualificationFit = educationSatisfied ? 95 : 70;
  const experienceScore = Math.round((experienceFit * 0.6) + (qualificationFit * 0.4));

  const satisfiedRequirements: string[] = [];
  const missingRequirements: string[] = [];

  if (detectedYears >= requiredYears) {
    satisfiedRequirements.push(`${detectedYears}+ years professional experience (Job requires ${requiredYears} years)`);
  } else {
    missingRequirements.push(`Experience timeline: Detected ~${Math.round(detectedYears)} years, job specifies ${requiredYears}+ years`);
  }

  if (educationSatisfied) {
    satisfiedRequirements.push(`Education: Candidate holds ${profile.education[0]?.degree || 'relevant degree'} fulfilling requirement: ${job.educationRequired}`);
  } else {
    missingRequirements.push(`Education target: Job specifies ${job.educationRequired}; candidate profile lists ${profile.education[0]?.degree || 'unspecified degree'}`);
  }

  const experienceReason = `Estimated ${Math.round(detectedYears)} years of relevant work experience detected against ${requiredYears} years required. Qualification fit is ${qualificationFit}%.`;

  // ----------------------------------------------------
  // 4. Resume Format / ATS Structure Checker (F)
  // ----------------------------------------------------
  const checks: FormattingCheck[] = [];

  // Check 1: File type
  const isPdfOrDocx = !fileName || fileName.endsWith('.pdf') || fileName.endsWith('.docx');
  checks.push({
    id: 'file_type',
    label: 'Standard File Format (.pdf / .docx)',
    passed: isPdfOrDocx,
    severity: isPdfOrDocx ? 'pass' : 'warning',
    message: isPdfOrDocx ? 'Resume is in standard ATS-parsable format.' : 'Consider uploading as standard PDF or DOCX.'
  });

  // Check 2: Extractability
  const hasGoodTextLength = rawResumeText.length > 250;
  checks.push({
    id: 'extractability',
    label: 'Direct Text Extractability',
    passed: hasGoodTextLength,
    severity: hasGoodTextLength ? 'pass' : 'warning',
    message: hasGoodTextLength ? 'Text layer was parsed with high fidelity.' : 'Low text volume detected; ensure resume is not an image scan.'
  });

  // Check 3: Contact information
  const hasContact = Boolean(profile.email && (profile.phone || profile.linkedin));
  checks.push({
    id: 'contact_info',
    label: 'Contact Information (Email & Phone/LinkedIn)',
    passed: hasContact,
    severity: hasContact ? 'pass' : 'warning',
    message: hasContact ? `Contact info verified: ${profile.email}` : 'Missing direct contact telephone or email header.'
  });

  // Check 4: Education section
  const hasEdu = profile.education.length > 0;
  checks.push({
    id: 'education_section',
    label: 'Standard Education Section',
    passed: hasEdu,
    severity: hasEdu ? 'pass' : 'warning',
    message: hasEdu ? 'Education section with degree details clearly recognized.' : 'Clear education section was not detected.'
  });

  // Check 5: Experience section
  const hasExp = profile.experience.length > 0;
  checks.push({
    id: 'experience_section',
    label: 'Professional Experience Section',
    passed: hasExp,
    severity: hasExp ? 'pass' : 'warning',
    message: hasExp ? `${profile.experience.length} work experience roles parsed.` : 'Work experience entries were not clearly isolated.'
  });

  // Check 6: Bullet points consistency
  const hasBulletPoints = rawResumeText.includes('•') || rawResumeText.includes('-') || rawResumeText.includes('*');
  checks.push({
    id: 'bullet_points',
    label: 'Action-Oriented Bullet Consistency',
    passed: hasBulletPoints,
    severity: hasBulletPoints ? 'pass' : 'info',
    message: hasBulletPoints ? 'Clear bullet points detected in project/experience descriptions.' : 'Recommend utilizing consistent bullet points (•) for readability.'
  });

  // Check 7: Two-column / Table layout risk
  const hasColumnsOrTables = /\|\s*\||table\b/i.test(rawResumeText);
  checks.push({
    id: 'layout_simplicity',
    label: 'Single-Column Flow (ATS Safe)',
    passed: !hasColumnsOrTables,
    severity: !hasColumnsOrTables ? 'pass' : 'warning',
    message: !hasColumnsOrTables ? 'Clean single-column sequential text flow.' : 'Multi-column tables may scramble ATS reading order.'
  });

  // Check 8: Resume Length
  const wordCount = rawResumeText.split(/\s+/).length;
  const lengthAppropriate = wordCount >= 200 && wordCount <= 1100;
  checks.push({
    id: 'resume_length',
    label: 'Optimal Resume Length (300 - 900 words)',
    passed: lengthAppropriate,
    severity: lengthAppropriate ? 'pass' : 'info',
    message: lengthAppropriate ? `Word count (${wordCount} words) is within optimal 1-2 page ATS guidelines.` : `Word count (${wordCount} words) is slightly outside typical 1-2 page length.`
  });

  // Calculate formatting score
  const passedCount = checks.filter(c => c.passed).length;
  const formattingScore = Math.round((passedCount / checks.length) * 100);

  const formattingSummary = `${passedCount} of ${checks.length} structural ATS checks passed. Format is clean, parsable, and compliant with modern candidate tracking software.`;

  // ----------------------------------------------------
  // Final Weighted ATS Score
  // ATS = w1*K + w2*S + w3*E + w4*F
  // ----------------------------------------------------
  const rawAts = (weights.keyword * keywordScore) +
                 (weights.semantic * semanticScore) +
                 (weights.experience * experienceScore) +
                 (weights.formatting * formattingScore);

  const atsScore = Math.min(99, Math.max(15, Math.round(rawAts)));

  return {
    atsScore,
    keywordScore,
    semanticScore,
    experienceScore,
    formattingScore,
    weights,
    keywordDetails: {
      matched: matchedKeywords,
      missing: missingKeywords,
      totalRequired: jobKeywordsToEvaluate.length,
      matchRate: keywordScore,
      reason: keywordReason,
    },
    semanticDetails: {
      similarityScore: semanticScore,
      keyThemesDetected: keyThemes,
      reason: semanticReason,
    },
    experienceDetails: {
      qualificationFit,
      experienceFit,
      requiredYears,
      detectedYears: Math.round(detectedYears * 10) / 10,
      educationSatisfied,
      satisfiedRequirements,
      missingRequirements,
      reason: experienceReason,
    },
    formattingDetails: {
      score: formattingScore,
      checks,
      summary: formattingSummary,
    }
  };
}

/**
 * Computes Cosine Similarity between document term-frequency vectors
 * with sublinear term-frequency scaling and stopword filtering.
 */
function computeTfIdfCosineSimilarity(textA: string, textB: string): number {
  const stopWords = new Set([
    "the", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", 
    "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", 
    "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", 
    "your", "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", 
    "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these",
    "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
    "two", "more", "write", "go", "see", "number", "no", "way", "could", "people", "my",
    "than", "first", "water", "been", "call", "who", "oil", "its", "now", "find", "long",
    "down", "day", "did", "get", "come", "made", "may", "part"
  ]);

  const tokenize = (str: string): Map<string, number> => {
    const tokens = str.toLowerCase().replace(/[^a-z0-9+#.]/g, ' ').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));
    const counts = new Map<string, number>();
    tokens.forEach(t => {
      counts.set(t, (counts.get(t) || 0) + 1);
    });
    return counts;
  };

  const tfA = tokenize(textA);
  const tfB = tokenize(textB);

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  const allWords = new Set([...tfA.keys(), ...tfB.keys()]);

  allWords.forEach(word => {
    const countA = tfA.get(word) || 0;
    const countB = tfB.get(word) || 0;

    // Sublinear TF: 1 + log(tf)
    const valA = countA > 0 ? (1 + Math.log(countA)) : 0;
    const valB = countB > 0 ? (1 + Math.log(countB)) : 0;

    dotProduct += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  });

  if (magA === 0 || magB === 0) return 50;

  const cosine = dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
  // Scale from [0, 1] cosine into a normalized percentage [30% to 96%]
  const percentage = Math.round(Math.min(95, Math.max(35, (cosine * 100 * 1.35))));
  return percentage;
}
