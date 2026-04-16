import express from 'express';
import { getMessagesByBooking } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/booking/:bookingId', protect, getMessagesByBooking);

export default router;
