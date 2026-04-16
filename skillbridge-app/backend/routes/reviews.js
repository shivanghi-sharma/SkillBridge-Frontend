import express from 'express';
import { getReviewsByUser, addReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(protect, addReview);
router.route('/user/:userId').get(getReviewsByUser);

export default router;
