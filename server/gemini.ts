import { GoogleGenAI } from '@google/genai';

/**
 * Shared Gemini client utility initialized on the server.
 * Returns null if GEMINI_API_KEY is not configured in the environment,
 * signaling downstream agent services to execute their deterministic algorithms.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

export function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
}
