import express from 'express';
import {
  upsertContinueWatching,
  getContinueWatching,
  removeContinueWatching,
} from '../controllers/continueWatchingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, upsertContinueWatching)
  .get(protect, getContinueWatching)
  .delete(protect, removeContinueWatching);

export default router;
