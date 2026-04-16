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
    weakTopicsFocused: [String],
    resumeSnapshot: String, // Extracted parsed text from resume at session start
    questions: [
      {
        question: String,
        userAnswer: {
          type: String,
          default: '',
        },
        aiFeedback: {
          relevanceScore: Number, // 0-10
          clarityScore: Number, // 0-10
          suggestions: [String],
          overallScore: Number, // 0-10 combined
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
