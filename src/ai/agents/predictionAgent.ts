import { CandidateProfile, PredictedRole } from '../../types';
import { JOB_ROLES_DATABASE, JobRoleDefinition } from '../knowledge/jobRolesDatabase';
import { calculateOntologyMatchScore } from '../knowledge/skillsOntology';

/**
 * Agent 5 — Job Role Prediction Agent
 * Evaluates candidate profile across 20+ career roles and calculates relevance scores and explainable rationale.
 */
export function predictJobRoles(
  profile: CandidateProfile,
  rawResumeText: string,
  topN: number = 6
): PredictedRole[] {
  const candidateSkills = Array.from(new Set([
    ...profile.skills.technical,
    ...profile.skills.languages,
    ...profile.skills.frameworks,
    ...profile.skills.tools,
    ...profile.skills.soft,
  ]));

  const resumeLower = rawResumeText.toLowerCase();

  // Experience years estimated
  let detectedYears = 0;
  profile.experience.forEach(exp => {
    const yearMatches = exp.duration.match(/\b(20\d\d|19\d\d)\b/g);
    if (yearMatches && yearMatches.length >= 2) {
      detectedYears += Math.max(1, Math.abs(parseInt(yearMatches[1], 10) - parseInt(yearMatches[0], 10)));
    } else {
      detectedYears += 1.5;
    }
  });

  const scoredRoles: { roleDef: JobRoleDefinition; score: number; matchedPoints: string[]; missingPoints: string[]; reason: string }[] = [];

  JOB_ROLES_DATABASE.forEach(role => {
    let matchedWeight = 0;
    let totalWeight = 0;
    const matchedPoints: string[] = [];
    const missingPoints: string[] = [];

    // 1. Required Skills Score
    role.requiredSkills.forEach(reqSkill => {
      const weight = 2.0;
      totalWeight += weight;

      let hasSkill = false;
      for (const candSkill of candidateSkills) {
        const match = calculateOntologyMatchScore(reqSkill, candSkill);
        if (match.score >= 0.70) {
          hasSkill = true;
          break;
        }
      }

      if (hasSkill) {
        matchedWeight += weight;
        matchedPoints.push(reqSkill);
      } else {
        missingPoints.push(reqSkill);
      }
    });

    // 2. Preferred Skills Score
    role.preferredSkills.forEach(prefSkill => {
      const weight = 1.0;
      totalWeight += weight;

      let hasSkill = false;
      for (const candSkill of candidateSkills) {
        const match = calculateOntologyMatchScore(prefSkill, candSkill);
        if (match.score >= 0.70) {
          hasSkill = true;
          break;
        }
      }

      if (hasSkill) {
        matchedWeight += weight;
        matchedPoints.push(prefSkill);
      }
    });

    // 3. Project & Text Keyword Overlap
    let textOverlapBonus = 0;
    if (resumeLower.includes(role.title.toLowerCase())) {
      textOverlapBonus += 6;
    }
    role.relatedSkills.forEach(rel => {
      if (resumeLower.includes(rel.toLowerCase())) {
        textOverlapBonus += 2;
      }
    });

    // 4. Experience Fit Score
    const expFactor = Math.min(1.0, Math.max(0.6, (detectedYears + 0.5) / Math.max(1, role.minYearsExp)));

    // Calculate baseline percentage
    const skillRatio = totalWeight > 0 ? (matchedWeight / totalWeight) : 0.5;
    let finalScore = Math.round((skillRatio * 80 * expFactor) + Math.min(18, textOverlapBonus));
    finalScore = Math.min(96, Math.max(18, finalScore));

    // Construct human-readable reason
    const topMatchesStr = matchedPoints.slice(0, 4).join(', ');
    const reason = matchedPoints.length > 0
      ? `Strong alignment detected with core competencies: ${topMatchesStr}.${missingPoints.length > 0 ? ` Fulfilling ${missingPoints.slice(0, 2).join(', ')} would elevate fit further.` : ' Complete required stack matched.'}`
      : `Foundational transferable analytical and technical skills applicable to ${role.title}.`;

    scoredRoles.push({
      roleDef: role,
      score: finalScore,
      matchedPoints,
      missingPoints,
      reason,
    });
  });

  // Sort descending by score
  scoredRoles.sort((a, b) => b.score - a.score);

  return scoredRoles.slice(0, topN).map(item => ({
    role: item.roleDef.title,
    score: item.score,
    category: item.roleDef.category,
    matchingPoints: item.matchedPoints,
    missingPoints: item.missingPoints,
    reason: item.reason,
  }));
}
