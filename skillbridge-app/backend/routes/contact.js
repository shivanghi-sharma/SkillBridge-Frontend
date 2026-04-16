import express from 'express';
import { body } from 'express-validator';
import { submitContact } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required'),
  validate,
];

router.post('/', contactLimiter, contactValidation, submitContact);

export default router;
