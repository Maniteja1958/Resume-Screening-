import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
// Safely load CommonJS pdf-parse
let pdfParse: any;
try {
  pdfParse = require('pdf-parse');
} catch (e) {
  console.warn("Could not require pdf-parse:", e);
}

export interface ParseResult {
  rawText: string;
  pageCount: number;
  wordCount: number;
  detectedFormat: 'pdf' | 'docx' | 'txt' | 'unknown';
  parsingWarnings: string[];
}

/**
 * Agent 1 — Resume Parser Agent
 * Converts PDF, DOCX, or TXT file buffers into normalized plain text.
 */
export async function parseResumeFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType?: string
): Promise<ParseResult> {
  const extension = originalFilename.split('.').pop()?.toLowerCase() || '';
  const warnings: string[] = [];

  let rawText = '';
  let pageCount = 1;
  let detectedFormat: 'pdf' | 'docx' | 'txt' | 'unknown' = 'unknown';

  try {
    if (extension === 'pdf' || mimeType === 'application/pdf') {
      detectedFormat = 'pdf';
      try {
        const data = await pdfParse(buffer);
        rawText = data.text || '';
        pageCount = data.numpages || 1;
        if (rawText.length < 50) {
          warnings.push("PDF contains very little text. It might be scanned or image-based.");
        }
      } catch (err: any) {
        // Fallback for corrupted/encrypted PDF or edge case
        warnings.push(`PDF parsing encountered an issue: ${err.message || 'Unknown'}. Attempting text stream salvage.`);
        rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
      }
    } else if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      detectedFormat = 'docx';
      try {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value || '';
        if (result.messages && result.messages.length > 0) {
          warnings.push(...result.messages.map(m => m.message));
        }
      } catch (err: any) {
        warnings.push(`DOCX parsing issue: ${err.message}.`);
        rawText = buffer.toString('utf-8');
      }
    } else if (extension === 'txt' || mimeType === 'text/plain') {
      detectedFormat = 'txt';
      rawText = buffer.toString('utf-8');
    } else {
      // Default try UTF-8 text
      detectedFormat = 'txt';
      rawText = buffer.toString('utf-8');
      warnings.push(`Unrecognized extension .${extension}. Parsed as raw text.`);
    }

    // Clean text normalization: remove excessive carriage returns, fix multi-spaces
    rawText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const wordCount = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;

    return {
      rawText,
      pageCount,
      wordCount,
      detectedFormat,
      parsingWarnings: warnings,
    };
  } catch (error: any) {
    return {
      rawText: buffer.toString('utf-8'),
      pageCount: 1,
      wordCount: 0,
      detectedFormat: 'unknown',
      parsingWarnings: [`Critical parser error: ${error.message || 'File read failed'}`],
    };
  }
}
