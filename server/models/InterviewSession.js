import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['HR', 'Technical', 'Mixed'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    weakTopicsFocused: [String],
    resumeSnapshot: String,
    questions: [
      {
        question: String,
        level: String, // Easy, Medium, Hard
        userAnswer: {
          type: String,
          default: '',
        },
        aiFeedback: {
          relevanceScore: Number,
          clarityScore: Number,
          technicalScore: Number,
          completenessScore: Number,
          overallScore: Number,
          analysis: String,
          strengths: [String],
          weaknesses: [String],
          suggestions: [String],
          suggestedAnswer: String,
        },
      },
    ],
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed'],
      default: 'In Progress',
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
