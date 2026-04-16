import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'Codeforces', 'GeeksForGeeks', 'Other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    topic: {
      type: String,
      enum: [
        'Array', 'String', 'LinkedList', 'Tree', 'Graph', 
        'DP', 'Heap', 'Stack', 'Recursion', 'Sorting', 
        'Searching', 'Other'
      ],
      required: true,
    },
    link: {
      type: String,
    },
    notes: {
      type: String,
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries for analytics
problemSchema.index({ userId: 1, topic: 1 });
problemSchema.index({ userId: 1, solvedAt: -1 });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
