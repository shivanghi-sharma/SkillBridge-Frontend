import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/').post(createBooking).get(getMyBookings);

router.route('/:id').get(getBooking);

router.route('/:id/status').patch(updateBookingStatus);

export default router;
