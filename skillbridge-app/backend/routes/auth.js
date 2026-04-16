import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Validation chains
const registerValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Please enter a password with 6 or more characters'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
  validate,
];

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);

export default router;
