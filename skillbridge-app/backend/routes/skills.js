import express from 'express';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getSkills)
  .post(protect, authorize('seller', 'admin'), createSkill);

router
  .route('/:id')
  .get(getSkill)
  .put(protect, authorize('seller', 'admin'), updateSkill)
  .delete(protect, authorize('seller', 'admin'), deleteSkill);

export default router;
