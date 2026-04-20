import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import { extractResumeText, generateSingleQuestion, evaluateAnswer } from '../services/aiService.js';
import { detectWeakTopics } from '../services/analyticsService.js';

// @desc    Start a new interview session
// @route   POST /api/interview/start
// @access  Private
export const startSession = async (req, res, next) => {
  try {
    const { type = 'Mixed' } = req.body;
    const user = await User.findById(req.user._id);
    
    // 1. Detect weak topics
    const problems = await Problem.find({ userId: user._id });
    const weakTopics = detectWeakTopics(problems);

    // 2. Fetch and parse resume
    let resumeText = '';
    if (user.resumeUrl) {
      resumeText = await extractResumeText(user.resumeUrl);
    }

    // 3. Start at 'Easy' and generate the first question
    const firstQuestion = await generateSingleQuestion(type, 'Easy', weakTopics, resumeText);

    // 4. Create session
    const session = await InterviewSession.create({
      userId: user._id,
      type,
      difficulty: 'Easy',
      weakTopicsFocused: weakTopics,
      resumeSnapshot: resumeText.substring(0, 500),
      questions: [firstQuestion],
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an answer for evaluation
// @route   POST /api/interview/:sessionId/submit
// @access  Private
export const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answer } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.sessionId, userId: req.user._id });

    if (!session) {
      res.status(404);
      throw new Error('Interview session not found');
    }

    const questionIndex = session.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      res.status(400);
      throw new Error('Question not found in this session');
    }

    // 1. Evaluate answer
    const feedback = await evaluateAnswer(session.questions[questionIndex].question, answer);
    session.questions[questionIndex].userAnswer = answer;
    session.questions[questionIndex].aiFeedback = feedback;

    // 2. Adaptive Logic: Determine next difficulty
    const score = feedback.overallScore;
    let nextDifficulty = session.difficulty;

    if (score >= 8) {
      if (session.difficulty === 'Easy') nextDifficulty = 'Medium';
      else if (session.difficulty === 'Medium') nextDifficulty = 'Hard';
    } else if (score < 5) {
      if (session.difficulty === 'Hard') nextDifficulty = 'Medium';
      else if (session.difficulty === 'Medium') nextDifficulty = 'Easy';
    }

    session.difficulty = nextDifficulty;

    // 3. Generate NEXT question if not reached limit (limit = 5 questions)
    if (session.questions.length < 5) {
      const user = await User.findById(req.user._id);
      const questionHistory = session.questions.map(q => q.question);
      const nextQ = await generateSingleQuestion(session.type, nextDifficulty, session.weakTopicsFocused, session.resumeSnapshot, questionHistory);
      session.questions.push(nextQ);
    } else {
      // Mark as completed
      session.status = 'Completed';
      session.completedAt = new Date();
      const sumScores = session.questions.reduce((acc, q) => acc + (q.aiFeedback?.overallScore || 0), 0);
      session.totalScore = sumScores / session.questions.length;
    }

    await session.save();
    res.json(session);
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview session history
// @route   GET /api/interview/history
// @access  Private
export const getHistory = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed single session
// @route   GET /api/interview/:id
// @access  Private
export const getSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }
    res.json(session);
  } catch (error) {
    next(error);
  }
};
