import express from 'express';
import { getSellers, getUserProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSellers);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);

export default router;
