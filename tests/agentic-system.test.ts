/**
 * Agentic AI Resume Screening & Role Prediction System — Verification Test Suite
 * Tests all 7 agents, ATS formulas, skill gap calculations, role predictions, and PDF reporting.
 */
import { parseResumeFile } from '../src/ai/agents/parserAgent';
import { extractCandidateProfile } from '../src/ai/agents/extractionAgent';
import { evaluateAtsCompatibility } from '../src/ai/agents/atsAgent';
import { analyzeSkillGap } from '../src/ai/agents/skillGapAgent';
import { predictJobRoles } from '../src/ai/agents/predictionAgent';
import { generateDeterministicRecommendations } from '../src/ai/agents/recommendationAgent';
import { generatePdfReport } from '../src/ai/agents/reportAgent';
import { parseJobDescriptionText } from '../src/ai/agents/jobParser';
import { calculateOntologyMatchScore, normalizeSkill } from '../src/ai/knowledge/skillsOntology';
import { JobDescription } from '../src/types';

async function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING AGENTIC RESUME SYSTEM TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Text & File Parsing (Agent 1)
  console.log("1. Testing Agent 1: Resume Parser Agent...");
  const sampleTxt = Buffer.from(`Jane Doe\nEmail: jane.doe@example.com\nPhone: (555) 123-4567\n\nSKILLS\nPython, PyTorch, Docker, SQL\n\nEXPERIENCE\nSenior ML Engineer - AI Corp - 2022 to Present\n• Built PyTorch models.\n\nEDUCATION\nBS in Computer Science - 2021`);
  const parsedTxt = await parseResumeFile(sampleTxt, 'resume.txt', 'text/plain');
  assert(parsedTxt.rawText.includes('Jane Doe'), 'Parses plain text buffer accurately');
  assert(parsedTxt.detectedFormat === 'txt', 'Detects TXT format correctly');

  // 2. Information Extraction (Agent 2)
  console.log("\n2. Testing Agent 2: Information Extraction Agent...");
  const profile = extractCandidateProfile(parsedTxt.rawText);
  assert(profile.email === 'jane.doe@example.com', 'Extracts email address');
  assert(profile.name === 'Jane Doe', 'Extracts candidate name');
  assert(profile.skills.technical.length > 0 || profile.skills.languages.length > 0, 'Extracts categorized skills');
  assert(profile.education.length > 0, 'Extracts education credentials');

  // 3. Skills Ontology
  console.log("\n3. Testing Skills Ontology & Hierarchical Mapping...");
  assert(normalizeSkill("py") === "python", 'Normalizes skill aliases (py -> python)');
  assert(normalizeSkill("k8s") === "kubernetes", 'Normalizes cloud aliases (k8s -> kubernetes)');
  const mlMatch = calculateOntologyMatchScore("Machine Learning", "Scikit-Learn");
  assert(mlMatch.score >= 0.7, 'Recognizes parent-child ontology relation (ML -> Scikit-learn)');

  // 4. Job Description & Skill Gap (Agent 4)
  console.log("\n4. Testing Dynamic User Job Description Parser...");
  const rawUserJob = `We are hiring a Senior Full Stack Engineer at Stripe.
Looking for someone with 4+ years of experience.
Must have strong hands-on experience with React, TypeScript, Node.js, and PostgreSQL.
Bonus points if you know Docker or AWS.
Must have a Bachelor's degree.`;
  const parsedUserJob = parseJobDescriptionText(rawUserJob);
  assert(parsedUserJob.title.includes("Full Stack"), 'Extracts job title from freeform text');
  assert(parsedUserJob.company.includes("Stripe"), 'Extracts company name from text');
  assert(parsedUserJob.experienceRequired === 4, 'Extracts 4+ years experience from text');
  assert(parsedUserJob.requiredSkills.includes("React") || parsedUserJob.requiredSkills.includes("TypeScript"), 'Extracts core tech skills from description');

  console.log("\n4b. Testing Agent 4: Skill Gap Agent...");
  const testJob: JobDescription = {
    id: "test_job_1",
    title: "Senior Machine Learning Engineer",
    company: "MetaAI",
    category: "AI & ML",
    description: "Looking for an ML engineer with Python, PyTorch, Kubernetes, and SQL.",
    requiredSkills: ["Python", "PyTorch", "Kubernetes", "SQL"],
    preferredSkills: ["Docker", "AWS"],
    experienceRequired: 3,
    educationRequired: "Bachelor's in Computer Science",
    createdAt: new Date().toISOString()
  };

  const skillGap = analyzeSkillGap(profile, testJob);
  assert(skillGap.matchingSkills.includes("Python"), 'Identifies Python as matching skill');
  assert(typeof skillGap.gapPercentage === 'number', 'Calculates exact Skill Gap %');

  // 5. ATS Compatibility Scoring (Agent 3)
  console.log("\n5. Testing Agent 3: ATS Compatibility Engine...");
  const atsEval = evaluateAtsCompatibility(profile, parsedTxt.rawText, testJob);
  assert(atsEval.atsScore >= 0 && atsEval.atsScore <= 100, `Calculates normalized ATS score: ${atsEval.atsScore}/100`);
  assert(atsEval.keywordScore > 0, 'Keyword match score calculated');
  assert(atsEval.semanticScore > 0, 'Semantic similarity calculated');
  assert(atsEval.experienceScore > 0, 'Experience fit score calculated');
  assert(atsEval.formattingScore > 0, 'Formatting compliance checked');

  // 6. Job Role Prediction (Agent 5)
  console.log("\n6. Testing Agent 5: Job Role Prediction Agent...");
  const roles = predictJobRoles(profile, parsedTxt.rawText, 4);
  assert(roles.length === 4, 'Returns ranked top 4 job role predictions');
  assert(roles[0].score >= roles[1].score, 'Roles are sorted descending by relevance score');
  assert(roles[0].reason.length > 0, 'Includes evidence-grounded explanation for top role');

  // 7. Recommendations (Agent 6)
  console.log("\n7. Testing Agent 6: Recommendation Agent...");
  const recs = generateDeterministicRecommendations(profile, testJob, atsEval, skillGap);
  assert(recs.resumeImprovements.length > 0, 'Generates actionable resume improvements');
  assert(recs.strengths.length > 0, 'Generates candidate strengths');
  assert(recs.weaknesses.length > 0, 'Generates candidate improvement areas');

  // 8. PDF Report Generation (Agent 7)
  console.log("\n8. Testing Agent 7: PDF Report Agent...");
  const testAnalysisResult = {
    id: "test_ana_1",
    userId: "usr_1",
    resumeId: "res_1",
    resumeName: "jane_doe_resume.txt",
    jobDescriptionId: testJob.id,
    jobTitle: testJob.title,
    company: testJob.company,
    atsScore: atsEval.atsScore,
    keywordScore: atsEval.keywordScore,
    semanticScore: atsEval.semanticScore,
    experienceScore: atsEval.experienceScore,
    formattingScore: atsEval.formattingScore,
    weights: atsEval.weights,
    keywordDetails: atsEval.keywordDetails,
    semanticDetails: atsEval.semanticDetails,
    experienceDetails: atsEval.experienceDetails,
    formattingDetails: atsEval.formattingDetails,
    skillGap: {
      matchingSkills: skillGap.matchingSkills,
      missingSkills: skillGap.missingSkills,
      additionalSkills: skillGap.additionalSkills,
      gapPercentage: skillGap.gapPercentage
    },
    predictedRoles: roles,
    recommendations: recs,
    profileSnapshot: profile,
    createdAt: new Date().toISOString()
  };

  const pdfDoc = generatePdfReport(testAnalysisResult as any);
  const pdfBytes = pdfDoc.output('arraybuffer');
  assert(pdfBytes.byteLength > 1000, `Generated valid PDF byte array (${pdfBytes.byteLength} bytes)`);

  console.log("\n=================================================");
  console.log(`TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
