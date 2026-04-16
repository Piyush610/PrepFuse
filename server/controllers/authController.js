import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { z } from 'zod';
import admin from '../config/firebase.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400);
      throw new Error(parsed.error.errors[0].message);
    }

    const { name, email, password } = parsed.data;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      authMethod: 'email',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400);
      throw new Error(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        token: generateToken(res, user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        githubId: user.githubId,
        resumeUrl: user.resumeUrl,
        authMethod: user.authMethod,
        streak: user.streak,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    GitHub OAuth Callback successful
// @route   GET /api/auth/github/success
// @access  Public
export const githubAuthSuccess = (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      authMethod: req.user.authMethod,
      token: generateToken(res, req.user._id),
      message: 'GitHub login successful',
    });
  } else {
    res.status(401).json({ message: 'GitHub authentication failed' });
  }
};

// @desc    Verify Firebase phone OTP and log in/register
// @route   POST /api/auth/phone/verify-otp
// @access  Public
export const verifyPhoneOtp = async (req, res, next) => {
  try {
    const { idToken, phone } = req.body;
    if (!idToken || !phone) {
      res.status(400);
      throw new Error('Firebase ID token and phone number are required');
    }

    // Verify token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    if (decodedToken.phone_number !== phone) {
      res.status(401);
      throw new Error('Phone number mismatch');
    }

    let user = await User.findOne({ phone });

    if (!user) {
      // Register with phone
      user = await User.create({
        name: `User-${phone.slice(-4)}`, // generate default name
        phone,
        authMethod: 'phone',
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      authMethod: user.authMethod,
      token: generateToken(res, user._id),
    });
  } catch (error) {
    res.status(401);
    next(new Error('Invalid or expired OTP token'));
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) {
        user.password = req.body.password; // pre-save hook will hash it
      }

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         phone: updatedUser.phone,
         avatar: updatedUser.avatar,
         resumeUrl: updatedUser.resumeUrl,
         message: 'Profile updated successfully',
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/auth/upload-resume
// @access  Private
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No resume file provided');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.resumeUrl = req.file.path; // Cloudinary URL assigned by multer storage
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeUrl: user.resumeUrl,
    });
  } catch (error) {
    next(error);
  }
};
