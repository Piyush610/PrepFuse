import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import fetch from 'node-fetch'; // need node-fetch because resume is remote URL from Cloudinary

// Try initializing Gemini instance
let genAI;
let aiModel;

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} else {
  console.warn("GEMINI_API_KEY not found. AI features will be mocked.");
}

/**
 * Downloads and parses PDF resume into raw text.
 */
export const extractResumeText = async (pdfUrl) => {
  if (!pdfUrl) return "";
  try {
    const response = await fetch(pdfUrl);
    const buffer = await response.arrayBuffer();
    const data = await pdfParse(Buffer.from(buffer));
    return data.text.substring(0, 3000); // Limit to 3000 chars to save tokens
  } catch (error) {
    console.error("Error parsing resume PDF", error);
    return "";
  }
};

/**
 * Generates N questions targeting weak topics & resume.
 */
export const generateQuestions = async (type, weakTopics, resumeText, count = 3) => {
  if (!aiModel) {
    // Return mocked questions if no API key
    return Array(count).fill(0).map((_, i) => ({
      question: `[MOCK] Describe your experience with ${weakTopics[0] || 'software engineering'}?`,
    }));
  }

  const prompt = `
    You are an expert tech interviewer. Generate ${count} interview questions for a candidate.
    
    Context:
    - Interview Type: ${type} (If Mixed, provide both technical and HR)
    - Areas candidate needs practice on (Focus technical questions here): ${weakTopics.join(', ')}
    - Candidate Resume summary: ${resumeText || 'Not provided'}
    
    Format the response as a pure JSON array of strings containing ONLY the questions. Example: ["Q1?", "Q2?", "Q3?"]
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text();
    // safely parse JSON out of text response (strip markdown wrappers)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedQuestions = JSON.parse(jsonStr);
    
    return parsedQuestions.map(q => ({ question: q }));
  } catch (error) {
    console.error('Error in generateQuestions', error);
    throw new Error('Failed to generate AI questions');
  }
};

/**
 * Evaluates a single answer and returns scores + suggestions.
 */
export const evaluateAnswer = async (question, answer) => {
  if (!aiModel) {
      return {
          relevanceScore: 7,
          clarityScore: 6,
          suggestions: ["[MOCK] Try to be more concise.", "[MOCK] Use the STAR method."],
          overallScore: 6.5
      };
  }

  const prompt = `
    You are an expert tech interviewer grading an answer.
    
    Question asked: "${question}"
    Candidate's Answer: "${answer}"
    
    Grade this answer and return EXACTLY this JSON format (no markdown, just raw JSON):
    {
      "relevanceScore": <number 0-10>,
      "clarityScore": <number 0-10>,
      "suggestions": ["<suggestion 1>", "<suggestion 2>"]
    }
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const feedback = JSON.parse(jsonStr);
    
    feedback.overallScore = (feedback.relevanceScore + feedback.clarityScore) / 2;
    return feedback;
  } catch (error) {
    console.error("AI Evaluation error:", error);
    return { relevanceScore: 0, clarityScore: 0, suggestions: ["Error evaluating answer"], overallScore: 0 };
  }
};
