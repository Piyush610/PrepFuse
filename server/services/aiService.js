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
 * Generates a SINGLE question based on current difficulty and user context.
 */
export const generateSingleQuestion = async (type, difficulty, weakTopics, resumeText, questionHistory = []) => {
  if (!aiModel) {
    const mockPool = {
      Easy: ["Tell me about yourself.", "What are arrays and strings?"],
      Medium: ["Explain how a Linked List works.", "How do you handle conflict in a team?"],
      Hard: ["Design a rate limiter.", "Solve the Longest Increasing Subsequence problem using DP."]
    };
    const pool = mockPool[difficulty] || mockPool.Easy;
    return { question: `[MOCK] ${pool[Math.floor(Math.random() * pool.length)]}`, level: difficulty };
  }

  const prompt = `
    You are an AI Interviewer for PrepFusion. 
    Current Level: ${difficulty}
    Interview Type: ${type}
    Weak Topics: ${weakTopics.join(', ')}
    Resume: ${resumeText || 'Not provided'}
    Question History: ${questionHistory.join(' | ')}

    Instructions:
    1. Generate ONE question that matches the logic:
       - Easy: Basic HR or Fundamentals (Programming basics, simple arrays/strings).
       - Medium: Intermediate DSA (Linked lists, stacks, queues) or Scenario-based.
       - Hard: Complex DSA (Graphs, DP) or System Design basics.
    2. Do NOT repeat questions from history.
    3. Make it professional and conversational.

    Format: JSON { "question": "...", "level": "${difficulty}" }
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error in generateSingleQuestion', error);
    return { question: "Could you tell me about your technical background?", level: difficulty };
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
          technicalScore: 6,
          completenessScore: 5,
          overallScore: 6,
          analysis: "Feedback is mocked since GEMINI_API_KEY is missing.",
          strengths: ["You identified the core concept."],
          weaknesses: ["Missing depth in explanation."],
          suggestions: ["Be more descriptive.", "Use real-world examples."],
          suggestedAnswer: "A full perfect answer for this question would be..."
      };
  }

  const prompt = `
    Analyze this interview answer:
    Question: "${question}"
    Answer: "${answer}"

    Evaluate based on:
    1. Relevance
    2. Clarity
    3. Technical Correctness
    4. Completeness

    Return JSON:
    {
      "relevanceScore": <0-10>,
      "clarityScore": <0-10>,
      "technicalScore": <0-10>,
      "completenessScore": <0-10>,
      "overallScore": <0-10>,
      "analysis": "...",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."],
      "suggestions": ["...", "..."],
      "suggestedAnswer": "..."
    }
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI Evaluation error:", error);
    return { overallScore: 0, analysis: "Error analyzing answer" };
  }
};
