import { CandidateProfile, JobDescription } from '../../types';
import { calculateOntologyMatchScore, normalizeSkill } from '../knowledge/skillsOntology';

export interface SkillGapAnalysis {
  matchingSkills: string[];
  missingSkills: string[];
  additionalSkills: string[];
  gapPercentage: number;
  matchPercentage: number;
  ontologyMatches: {
    jobSkill: string;
    matchedWithCandidateSkill: string;
    relationship: string;
  }[];
}

/**
 * Agent 4 — Skill Gap Agent
 * Evaluates Candidate Skills against Target Job Skills, factoring in the knowledge ontology.
 */
export function analyzeSkillGap(
  profile: CandidateProfile,
  job: JobDescription
): SkillGapAnalysis {
  // Aggregate all candidate skills
  const candidateSkills = Array.from(new Set([
    ...profile.skills.technical,
    ...profile.skills.languages,
    ...profile.skills.frameworks,
    ...profile.skills.tools,
    ...profile.skills.soft,
  ]));

  const requiredJobSkills = job.requiredSkills.length > 0
    ? job.requiredSkills
    : ["Python", "SQL", "Git", "Problem Solving"];

  const matchingSkillsSet = new Set<string>();
  const missingSkillsSet = new Set<string>();
  const matchedCandidateSkillsSet = new Set<string>();
  const ontologyMatches: SkillGapAnalysis['ontologyMatches'] = [];

  // Check each required job skill
  requiredJobSkills.forEach(jobSkill => {
    let matched = false;
    let matchedCandSkill = '';
    let matchRelationship = '';

    for (const candSkill of candidateSkills) {
      const match = calculateOntologyMatchScore(jobSkill, candSkill);
      if (match.score >= 0.70) {
        matched = true;
        matchedCandSkill = candSkill;
        matchRelationship = match.reason || "Ontology relation";
        break;
      }
    }

    if (matched) {
      matchingSkillsSet.add(jobSkill);
      matchedCandidateSkillsSet.add(matchedCandSkill);
      if (normalizeSkill(jobSkill) !== normalizeSkill(matchedCandSkill)) {
        ontologyMatches.push({
          jobSkill,
          matchedWithCandidateSkill: matchedCandSkill,
          relationship: matchRelationship
        });
      }
    } else {
      missingSkillsSet.add(jobSkill);
    }
  });

  // Additional skills: skills present on candidate profile not directly required
  const additionalSkillsSet = new Set<string>();
  candidateSkills.forEach(candSkill => {
    const isMatched = Array.from(matchingSkillsSet).some(js => {
      return calculateOntologyMatchScore(js, candSkill).score >= 0.70;
    });

    if (!isMatched) {
      additionalSkillsSet.add(candSkill);
    }
  });

  const totalRequired = requiredJobSkills.length;
  const missingCount = missingSkillsSet.size;

  // Skill Gap % = (Number of Missing Required Skills / Total Required Skills) * 100
  const gapPercentage = totalRequired > 0
    ? Math.round((missingCount / totalRequired) * 100)
    : 0;

  const matchPercentage = 100 - gapPercentage;

  return {
    matchingSkills: Array.from(matchingSkillsSet),
    missingSkills: Array.from(missingSkillsSet),
    additionalSkills: Array.from(additionalSkillsSet),
    gapPercentage,
    matchPercentage,
    ontologyMatches,
  };
}
