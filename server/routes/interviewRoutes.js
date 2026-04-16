import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  startSession,
  submitAnswer,
  getHistory,
  getSession
} from '../controllers/interviewController.js';

const router = express.Router();

router.use(protect);

router.post('/start', startSession);
router.post('/:sessionId/submit', submitAnswer);
router.get('/history', getHistory);
router.get('/:id', getSession);

export default router;
