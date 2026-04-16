import Problem from '../models/Problem.js';
import User from '../models/User.js';
import { detectWeakTopics, calculateStreak } from '../services/analyticsService.js';
import { z } from 'zod';

const problemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  platform: z.enum(['LeetCode', 'Codeforces', 'GeeksForGeeks', 'Other']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topic: z.enum([
    'Array', 'String', 'LinkedList', 'Tree', 'Graph', 
    'DP', 'Heap', 'Stack', 'Recursion', 'Sorting', 
    'Searching', 'Other'
  ]),
  link: z.string().optional(),
  notes: z.string().optional(),
});

// @desc    Get all problems for logged in user
// @route   GET /api/dsa/problems
// @access  Private
export const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({ userId: req.user._id }).sort({ solvedAt: -1 });
    res.json(problems);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new DSA problem
// @route   POST /api/dsa/problems
// @access  Private
export const addProblem = async (req, res, next) => {
  try {
    const parsed = problemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400);
      throw new Error(parsed.error.errors[0].message);
    }

    const problem = await Problem.create({
      ...parsed.data,
      userId: req.user._id,
      solvedAt: new Date(),
    });

    // Update streak immediately
    const userProblems = await Problem.find({ userId: req.user._id });
    const { current, longest, lastActivity } = calculateStreak(userProblems);

    await User.findByIdAndUpdate(req.user._id, {
        streak: { current, longest, lastActivity }
    });

    res.status(201).json(problem);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a problem
// @route   DELETE /api/dsa/problems/:id
// @access  Private
export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }

    if (problem.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this problem');
    }

    await problem.deleteOne();
    
    // Recalculate streak
    const userProblems = await Problem.find({ userId: req.user._id });
    const { current, longest, lastActivity } = calculateStreak(userProblems);
    await User.findByIdAndUpdate(req.user._id, {
        streak: { current, longest, lastActivity }
    });

    res.json({ message: 'Problem removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get DSA Stats & Weak Topics Insights
// @route   GET /api/dsa/insights
// @access  Private
export const getInsights = async (req, res, next) => {
   try {
     const problems = await Problem.find({ userId: req.user._id });
     
     const totalSolved = problems.length;
     const weakTopics = detectWeakTopics(problems);
     const streak = await User.findById(req.user._id).select('streak');

     // Group data for radar chart on frontend
     const topicCounts = {};
     problems.forEach(p => {
         topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
     });

     res.json({
         totalSolved,
         streak: streak.streak,
         weakTopics,
         topicCounts, // e.g. { Array: 10, DP: 2, Graph: 0 }
     });
   } catch(err) {
       next(err);
   }
};
