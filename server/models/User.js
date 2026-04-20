import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // sparse allows null values to not trigger unique constraint if we use phone/github later without email
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      sparse: true,
    },
    avatar: {
      type: String,
    },
    githubId: {
      type: String,
    },
    resumeUrl: {
      type: String,
    },
    authMethod: {
      type: String,
      enum: ['email', 'github', 'phone'],
      required: true,
      default: 'email'
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastSolvedDate: { type: Date, default: null }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
