import { JobDescription } from '../../types';
import { SKILLS_ONTOLOGY, normalizeSkill } from '../knowledge/skillsOntology';
import { JOB_ROLES_DATABASE } from '../knowledge/jobRolesDatabase';

/**
 * Intelligent Job Description Parser
 * Parses ANY free-form, pasted, or uploaded job description text into a structured JobDescription.
 * Handles any industry, career level, or formatting style (bullet points, paragraphs, job board dumps).
 */
export function parseJobDescriptionText(
  rawText: string,
  providedTitle?: string,
  providedCompany?: string
): JobDescription {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const textLower = rawText.toLowerCase();

  // 1. Title Extraction
  let title = providedTitle?.trim() || "";
  if (!title) {
    // Check for explicit title labels
    for (const line of lines.slice(0, 10)) {
      const titleMatch = line.match(/^(?:job\s*title|role|position|title)\s*[:\-]\s*(.+)$/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
        break;
      }
    }
  }
  if (!title) {
    // Check "Looking for a / Hiring a [Role]"
    const hiringMatch = rawText.match(/(?:looking for an?|hiring an?|seeking an?|in search of an?)\s+([A-Za-z0-9\s/&.-]{3,40}?)(?:(?:\s+to|\s+who|\s+with|\s+for|\.|\n))/i);
    if (hiringMatch && hiringMatch[1]) {
      title = hiringMatch[1].trim();
    }
  }
  if (!title) {
    // Check against known roles database
    for (const roleDef of JOB_ROLES_DATABASE) {
      if (new RegExp(`\\b${roleDef.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText)) {
        title = roleDef.title;
        break;
      }
    }
  }
  if (!title && lines.length > 0) {
    // If first line is reasonably short and title-like
    if (lines[0].length < 60 && !lines[0].includes('http') && !lines[0].includes('@')) {
      title = lines[0].replace(/^#+\s*/, '').trim();
    }
  }
  if (!title) {
    title = "Target Professional Role";
  }

  // 2. Company Extraction
  let company = providedCompany?.trim() || "";
  if (!company) {
    const compMatch = rawText.match(/(?:at|company|organization|employer)\s*(?:[:\-]\s*|\s+)([A-Z][a-zA-Z0-9&.-]{1,30})/);
    if (compMatch && compMatch[1]) {
      company = compMatch[1].replace(/[.,;:].*$/, '').trim();
    }
  }
  if (!company) {
    company = "Target Employer";
  }

  // 3. Experience Required (in years)
  let experienceRequired = 2;
  const expMatch = rawText.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?(?:-\s*\d+\s*)?(?:years?|yrs?)(?:\s*of)?\s*(?:relevant|hands-on|professional|work)?\s*experience/i);
  if (expMatch && expMatch[1]) {
    const parsedYears = parseInt(expMatch[1], 10);
    if (!isNaN(parsedYears) && parsedYears >= 0 && parsedYears <= 20) {
      experienceRequired = parsedYears;
    }
  }

  // 4. Education Required
  let educationRequired = "Bachelor's Degree";
  if (/ph\.?d|doctorate/i.test(textLower)) {
    educationRequired = "Ph.D. or equivalent advanced degree";
  } else if (/master'?s|m\.?s\.?|m\.?tech|m\.?a\.?/i.test(textLower)) {
    educationRequired = "Master's Degree (M.S., M.Tech, or equivalent)";
  } else if (/bachelor'?s|b\.?s\.?|b\.?tech|b\.?a\.?/i.test(textLower)) {
    educationRequired = "Bachelor's Degree in related field";
  } else if (/associate'?s|diploma/i.test(textLower)) {
    educationRequired = "Associate's Degree or Diploma";
  } else if (/high school/i.test(textLower)) {
    educationRequired = "High School Diploma";
  }

  // 5. Skills Extraction (Required vs Preferred)
  const detectedSkills = new Set<string>();
  const preferredSkills = new Set<string>();

  // Check section separation: "Preferred", "Bonus", "Nice to have"
  const preferredSectionMatch = rawText.split(/(?:preferred|nice to have|bonus|pluses|ideal candidate)/i);
  const mainPart = preferredSectionMatch[0] || rawText;
  const preferredPart = preferredSectionMatch.length > 1 ? preferredSectionMatch.slice(1).join(' ') : "";

  // Match skills from ontology
  for (const [key, node] of Object.entries(SKILLS_ONTOLOGY)) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const synMatch = node.synonyms.some(syn => {
      return new RegExp(`\\b${syn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(rawText);
    });

    if (regex.test(rawText) || synMatch) {
      if (preferredPart && (regex.test(preferredPart))) {
        preferredSkills.add(node.name);
      } else {
        detectedSkills.add(node.name);
      }
    }
  }

  // Also parse bullet points under "Requirements" or "Qualifications"
  const reqSection = rawText.match(/(?:requirements|qualifications|what you'?ll need|key skills|responsibilities)[:\s]([\s\S]*?)(?=(?:preferred|nice to have|about us|benefits|compensation|$))/i);
  if (reqSection && reqSection[1]) {
    const reqLines = reqSection[1].split('\n').map(l => l.trim()).filter(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
    reqLines.forEach(l => {
      const clean = l.replace(/^[•\-*]\s*/, '').trim();
      // Extract key nouns / capitalized terms
      const words = clean.split(/[,;\/]/).map(w => w.trim()).filter(w => w.length > 2 && w.length < 30);
      words.forEach(w => {
        const norm = normalizeSkill(w);
        if (SKILLS_ONTOLOGY[norm]) {
          detectedSkills.add(SKILLS_ONTOLOGY[norm].name);
        } else if (/^[A-Z][a-zA-Z0-9+#.-]{1,20}$/.test(w) && !['The', 'And', 'With', 'Our', 'You', 'Will', 'Must'].includes(w)) {
          detectedSkills.add(w);
        }
      });
    });
  }

  // Ensure reasonable default skills if very short description
  if (detectedSkills.size === 0) {
    detectedSkills.add("Problem Solving");
    detectedSkills.add("Communication");
    detectedSkills.add("Domain Expertise");
  }

  // 6. Category determination
  let category = "Technology & Engineering";
  if (/machine learning|data science|ai|analytics|statistic/i.test(textLower)) {
    category = "AI & Data Science";
  } else if (/frontend|react|ui|ux|web/i.test(textLower)) {
    category = "Frontend & Design";
  } else if (/cloud|devops|aws|kubernetes|docker|infrastructure/i.test(textLower)) {
    category = "Cloud & Infrastructure";
  } else if (/security|cyber|penetration|threat|soc/i.test(textLower)) {
    category = "Cybersecurity";
  } else if (/marketing|seo|content|growth/i.test(textLower)) {
    category = "Marketing & Growth";
  } else if (/finance|accounting|banking|investment/i.test(textLower)) {
    category = "Finance & Accounting";
  } else if (/product|management|scrum|agile/i.test(textLower)) {
    category = "Product Management";
  }

  return {
    id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title,
    company,
    location: "United States (or Remote)",
    category,
    description: rawText,
    requiredSkills: Array.from(detectedSkills),
    preferredSkills: Array.from(preferredSkills),
    experienceRequired,
    educationRequired,
    createdAt: new Date().toISOString(),
  };
}
