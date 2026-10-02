import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../../types';

/**
 * Agent 7 — Report Agent
 * Synthesizes all analysis results into an enterprise-grade multi-page PDF document.
 */
export function generatePdfReport(analysis: AnalysisResult): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text("AGENTIC AI RESUME SCREENING & JOB ROLE PREDICTION SYSTEM", margin, 25);
    doc.text(`CONFIDENTIAL CANDIDATE EVALUATION REPORT | DATE: ${new Date(analysis.createdAt).toLocaleDateString()}`, margin, pageHeight - 20);
  };

  // First page header
  drawHeaderFooter();

  // Top Title Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 68, 6, 6, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("AI RESUME SCREENING & ATS AUDIT REPORT", margin + 18, y + 28);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text(`Target Role: ${analysis.jobTitle} at ${analysis.company}`, margin + 18, y + 48);

  y += 82;

  // Candidate & Metadata Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.text("Candidate Name:", margin + 14, y + 18);
  doc.text("Email Address:", margin + 14, y + 36);

  doc.text("Resume File:", margin + 240, y + 18);
  doc.text("Analysis Date:", margin + 240, y + 36);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(analysis.profileSnapshot.name || "Candidate", margin + 100, y + 18);
  doc.text(analysis.profileSnapshot.email || "Confidential", margin + 100, y + 36);

  doc.text(analysis.resumeName || "Uploaded Resume", margin + 315, y + 18);
  doc.text(new Date(analysis.createdAt).toLocaleDateString(), margin + 315, y + 36);

  y += 66;

  // Executive Score Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 80, 6, 6, 'F');

  // Big ATS Score Circle
  doc.setFillColor(37, 99, 235); // blue-600
  doc.circle(margin + 52, y + 40, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${analysis.atsScore}`, margin + 42, y + 43);
  doc.setFontSize(8);
  doc.text("/100", margin + 45, y + 54);

  // Score details
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ATS COMPATIBILITY SCORE", margin + 98, y + 25);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Keyword Match: ${analysis.keywordScore}%  |  Semantic Similarity: ${analysis.semanticScore}%`, margin + 98, y + 43);
  doc.text(`Experience Fit: ${analysis.experienceScore}%  |  Formatting Compliance: ${analysis.formattingScore}%  |  Skill Gap: ${analysis.skillGap.gapPercentage}%`, margin + 98, y + 58);

  y += 94;

  // Executive Summary
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("EXECUTIVE SUMMARY", margin, y);
  y += 12;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(analysis.recommendations.executiveSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 12 + 10;

  // 4 Pillars Breakdown Table
  checkPageBreak(120);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("ATS PILLAR EVALUATION & TRANSPARENCY", margin, y);
  y += 14;

  const pillars = [
    { title: "Keyword Matching (K)", score: `${analysis.keywordScore}%`, weight: `${Math.round(analysis.weights.keyword * 100)}%`, reason: analysis.keywordDetails.reason },
    { title: "Semantic Similarity (S)", score: `${analysis.semanticScore}%`, weight: `${Math.round(analysis.weights.semantic * 100)}%`, reason: analysis.semanticDetails.reason },
    { title: "Experience & Qualification (E)", score: `${analysis.experienceScore}%`, weight: `${Math.round(analysis.weights.experience * 100)}%`, reason: analysis.experienceDetails.reason },
    { title: "Formatting & Structure (F)", score: `${analysis.formattingScore}%`, weight: `${Math.round(analysis.weights.formatting * 100)}%`, reason: analysis.formattingDetails.summary },
  ];

  pillars.forEach(p => {
    checkPageBreak(36);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${p.title} — ${p.score} (Weight: ${p.weight})`, margin + 10, y + 13);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const pReason = doc.splitTextToSize(p.reason, contentWidth - 20);
    doc.text(pReason[0] || "", margin + 10, y + 24);
    y += 34;
  });

  y += 10;

  // Skill Gap Breakdown
  checkPageBreak(130);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`SKILL GAP ANALYSIS (${analysis.skillGap.gapPercentage}% Gap Detected)`, margin, y);
  y += 14;

  // Matching Skills
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52); // green-800
  doc.text(`MATCHING SKILLS (${analysis.skillGap.matchingSkills.length}):`, margin, y);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const matchStr = analysis.skillGap.matchingSkills.join(' • ') || "None explicitly matched";
  const matchLines = doc.splitTextToSize(matchStr, contentWidth);
  doc.text(matchLines, margin, y);
  y += matchLines.length * 11 + 6;

  // Missing Skills
  checkPageBreak(40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28); // red-700
  doc.text(`MISSING REQUIRED SKILLS (${analysis.skillGap.missingSkills.length}):`, margin, y);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const missStr = analysis.skillGap.missingSkills.join(' • ') || "No critical skill gaps identified";
  const missLines = doc.splitTextToSize(missStr, contentWidth);
  doc.text(missLines, margin, y);
  y += missLines.length * 11 + 6;

  // Additional Skills
  checkPageBreak(40);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text(`ADDITIONAL CANDIDATE SKILLS (${analysis.skillGap.additionalSkills.length}):`, margin, y);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  const addStr = analysis.skillGap.additionalSkills.slice(0, 14).join(' • ') || "None";
  const addLines = doc.splitTextToSize(addStr, contentWidth);
  doc.text(addLines, margin, y);
  y += addLines.length * 11 + 14;

  // Predicted Job Roles
  checkPageBreak(120);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("INTELLIGENT JOB ROLE PREDICTIONS", margin, y);
  y += 14;

  analysis.predictedRoles.slice(0, 4).forEach((role, idx) => {
    checkPageBreak(28);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${role.role} — Match Fit: ${role.score}%`, margin + 10, y + 11);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const rReason = doc.splitTextToSize(role.reason, contentWidth - 20);
    doc.text(rReason[0] || "", margin + 10, y + 20);
    y += 28;
  });

  y += 10;

  // Personalized AI Recommendations
  checkPageBreak(140);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("ACTIONABLE RESUME RECOMMENDATIONS", margin, y);
  y += 14;

  analysis.recommendations.resumeImprovements.slice(0, 4).forEach((rec) => {
    checkPageBreak(26);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text("•", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    const recLines = doc.splitTextToSize(rec, contentWidth - 14);
    doc.text(recLines, margin + 12, y);
    y += recLines.length * 11 + 5;
  });

  // Responsible AI Disclaimer Footer
  checkPageBreak(50);
  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 38, 4, 4, 'F');

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "ETHICAL AI NOTICE: This report provides automated algorithmic screening and job-matching insights based strictly on text matching and skills ontology. It is intended for candidate self-improvement and should not be used as an automated hiring determinant. No protected personal demographic characteristics are factored into any calculation.",
    margin + 10,
    y + 12,
    { maxWidth: contentWidth - 20 }
  );

  return doc;
}
