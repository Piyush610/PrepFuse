import express from 'express';
import passport from 'passport';
import {
  registerUser,
  loginUser,
  getUserProfile,
  githubAuthSuccess,
  verifyPhoneOtp,
  updateProfile,
  uploadResume
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login?error=github_failed' }),
  (req, res) => {
    // Usually you redirect to the frontend with token, or send back JSON if popup.
    // For simplicity, we could redirect to a frontend route passing the token.
    res.redirect(`http://localhost:5173/auth?github_status=success`);
  }
);
router.get('/github/success', githubAuthSuccess);

// Phone OTP Route (Verification done via firebase client, backend verifies token)
router.post('/phone/verify-otp', verifyPhoneOtp);

// Profile and Resume Routes
router.put('/profile', protect, updateProfile);
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);

export default router;
