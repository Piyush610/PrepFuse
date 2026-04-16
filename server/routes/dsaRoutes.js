import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProblems,
  addProblem,
  deleteProblem,
  getInsights
} from '../controllers/dsaController.js';

const router = express.Router();

router.use(protect);

router.route('/problems')
  .get(getProblems)
  .post(addProblem);

router.route('/problems/:id')
  .delete(deleteProblem);

router.get('/insights', getInsights);

export default router;
