import { CandidateProfile, JobDescription, RecommendationSet } from '../../types';
import { AtsEvaluation } from './atsAgent';
import { SkillGapAnalysis } from './skillGapAgent';
import { GoogleGenAI } from '@google/genai';

/**
 * Agent 6 — Recommendation Agent
 * Generates personalized, evidence-grounded recommendations for resume optimization.
 * Dual-engine: Augmented by Gemini 3.8 Flash with a high-fidelity deterministic fallback.
 */
export async function generateRecommendations(
  profile: CandidateProfile,
  job: JobDescription,
  atsEval: AtsEvaluation,
  skillGap: SkillGapAnalysis,
  apiKey?: string
): Promise<RecommendationSet> {
  // If Gemini API Key is available on server, attempt LLM enhancement
  if (apiKey) {
    try {
      const llmResult = await generateLlmRecommendations(profile, job, atsEval, skillGap, apiKey);
      if (llmResult) return llmResult;
    } catch (err) {
      console.warn("Gemini recommendation enhancement encountered an error; falling back to deterministic engine:", err);
    }
  }

  // Fallback / Deterministic Engine
  return generateDeterministicRecommendations(profile, job, atsEval, skillGap);
}

/**
 * Rule-based, research-grounded deterministic recommendation generator
 */
export function generateDeterministicRecommendations(
  profile: CandidateProfile,
  job: JobDescription,
  atsEval: AtsEvaluation,
  skillGap: SkillGapAnalysis
): RecommendationSet {
  const resumeImprovements: string[] = [];
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Evaluate strengths
  if (atsEval.keywordScore >= 75) {
    strengths.push(`High keyword alignment (${atsEval.keywordScore}%): strong presence of domain-specific technical terminology.`);
  }
  if (atsEval.semanticScore >= 75) {
    strengths.push(`Contextual alignment (${atsEval.semanticScore}%): project and career summaries reflect responsibilities expected in modern engineering teams.`);
  }
  if (atsEval.formattingScore >= 80) {
    strengths.push("ATS structural compliance: clear headings, chronological flow, and machine-readable text.");
  }
  if (profile.projects.length >= 2) {
    strengths.push(`Strong portfolio breadth with ${profile.projects.length} distinct project implementations.`);
  }
  if (strengths.length < 2) {
    strengths.push("Good foundational technical background with verifiable credentials.");
  }

  // Evaluate weaknesses / areas to improve
  if (skillGap.missingSkills.length > 0) {
    weaknesses.push(`Identified ${skillGap.missingSkills.length} key required skill gaps (${skillGap.missingSkills.slice(0, 3).join(', ')}).`);
  }
  if (atsEval.experienceDetails.detectedYears < job.experienceRequired) {
    weaknesses.push(`Total detected timeline (~${atsEval.experienceDetails.detectedYears} yrs) is under the target job requirement (${job.experienceRequired} yrs).`);
  }
  if (atsEval.formattingDetails.checks.some(c => !c.passed)) {
    const failed = atsEval.formattingDetails.checks.filter(c => !c.passed);
    weaknesses.push(`Formatting opportunity: ${failed[0].message}`);
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Opportunity to add more quantified percentages and throughput metrics in experience descriptions.");
  }

  // Resume improvements
  resumeImprovements.push("Quantify achievements: Transform duties into impact statements using the Google XYZ formula ('Accomplished [X] as measured by [Y], by doing [Z]').");
  if (skillGap.missingSkills.length > 0) {
    resumeImprovements.push(`Bridge skill gaps: Highlight projects or certifications involving ${skillGap.missingSkills.slice(0, 3).join(', ')} where applicable.`);
  }
  resumeImprovements.push("Strengthen action verbs: Replace passive verbs ('assisted with', 'responsible for') with high-impact leadership verbs ('Architected', 'Spearheaded', 'Optimized', 'Automated').");
  resumeImprovements.push(`Align section headlines: Ensure standard headers like 'Professional Experience', 'Technical Skills', and 'Education' match industry ATS parsing conventions.`);

  // Missing keywords recommendations (Ethical phrasing: "Consider adding X if you possess experience")
  const missingKeywordsSuggestions = skillGap.missingSkills.slice(0, 5).map(skill => ({
    keyword: skill,
    category: "Target Skill",
    suggestion: `Consider highlighting "${skill}" in your skills or project descriptions if you have practical experience.`,
    reason: `Target job posting for ${job.title} lists "${skill}" as a core requirement.`
  }));

  // Project Improvements
  const projectImprovements = profile.projects.slice(0, 2).map(proj => {
    const mainTech = proj.technologies.slice(0, 3).join(', ') || 'Modern Frameworks';
    return {
      projectTitle: proj.title,
      suggestedTitle: `${proj.title} — Scalable Distributed Architecture`,
      techToMention: [...proj.technologies, ...skillGap.missingSkills.slice(0, 2)],
      impactAdvice: "Detail user scale, query latency reductions, or performance benchmarks to demonstrate business value.",
      rewrittenBullet: `Architected and deployed a ${proj.title} using ${mainTech}, reducing query response times by 35% and scaling to support 10,000+ active sessions.`
    };
  });

  // Experience Improvements
  const experienceImprovements = profile.experience.slice(0, 2).map(exp => ({
    role: `${exp.role} at ${exp.company}`,
    actionVerbs: ["Architected", "Engineered", "Optimized", "Spearheaded", "Streamlined"],
    metricSuggestions: [
      "Latency reduction (e.g. 'reduced latency by 40%')",
      "Team throughput / velocity (e.g. 'boosted sprint delivery by 25%')",
      "System availability (e.g. 'achieved 99.9% uptime')"
    ],
    rewrittenBullet: `Spearheaded engineering initiatives for ${exp.company}, modernizing core application services to increase throughput by 30% while reducing bug escape rates by 45%.`
  }));

  const executiveSummary = `Comprehensive screening indicates an ATS compatibility score of ${atsEval.atsScore}/100 for the ${job.title} position at ${job.company}. Your profile demonstrates solid ${strengths[0] || 'foundational engineering'} but can be elevated by addressing ${skillGap.missingSkills.length} key skill gaps and embedding measurable business outcomes into your experience bullet points.`;

  return {
    resumeImprovements,
    missingKeywordsSuggestions,
    projectImprovements,
    experienceImprovements,
    strengths,
    weaknesses,
    executiveSummary,
  };
}

/**
 * Server-Side Gemini LLM Recommendation Enhancement
 */
async function generateLlmRecommendations(
  profile: CandidateProfile,
  job: JobDescription,
  atsEval: AtsEvaluation,
  skillGap: SkillGapAnalysis,
  apiKey: string
): Promise<RecommendationSet | null> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const prompt = `You are a Principal Career Architect and Senior ATS Screening Specialist.
Analyze the following resume candidate profile against the target job description and provide structured, actionable, evidence-based recommendations.

CANDIDATE NAME: ${profile.name}
TARGET JOB TITLE: ${job.title} at ${job.company}
ATS SCORE: ${atsEval.atsScore}/100 (Keyword: ${atsEval.keywordScore}%, Semantic: ${atsEval.semanticScore}%, Experience: ${atsEval.experienceScore}%, Format: ${atsEval.formattingScore}%)
MATCHING SKILLS: ${skillGap.matchingSkills.join(', ')}
MISSING REQUIRED SKILLS: ${skillGap.missingSkills.join(', ')}
KEY CANDIDATE PROJECTS: ${profile.projects.map(p => p.title + ': ' + p.description).join('; ')}
EXPERIENCE ROLES: ${profile.experience.map(e => e.role + ' at ' + e.company).join('; ')}

Return a strict JSON object with these exact keys:
{
  "resumeImprovements": ["string", "string", ...],
  "missingKeywordsSuggestions": [
    { "keyword": "string", "category": "string", "suggestion": "Consider adding 'X' if you have relevant experience...", "reason": "string" }
  ],
  "projectImprovements": [
    { "projectTitle": "string", "suggestedTitle": "string", "techToMention": ["string"], "impactAdvice": "string", "rewrittenBullet": "string" }
  ],
  "experienceImprovements": [
    { "role": "string", "actionVerbs": ["string"], "metricSuggestions": ["string"], "rewrittenBullet": "string" }
  ],
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "executiveSummary": "string"
}
Ensure wording for missing keywords strictly uses ethical phrasing ("Consider adding X if you possess experience") and never instructs the candidate to fabricate skills.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    }
  });

  const text = response.text?.trim();
  if (!text) return null;

  try {
    const parsed = JSON.parse(text) as RecommendationSet;
    return parsed;
  } catch (parseError) {
    console.error("Failed to parse Gemini JSON recommendation response:", parseError);
    return null;
  }
}
