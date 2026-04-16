import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Message from '../models/Message.js';
import Booking from '../models/Booking.js';

// @desc    Get chat history for a booking
// @route   GET /api/messages/booking/:bookingId
// @access  Private
export const getMessagesByBooking = asyncHandler(async (req, res, next) => {
  const { bookingId } = req.params;

  // Ensure booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Ensure user is part of the booking
  if (
    booking.buyer.toString() !== req.user.id &&
    booking.seller.toString() !== req.user.id
  ) {
    return next(new ApiError('Not authorized to view these messages', 401));
  }

  const messages = await Message.find({ booking: bookingId })
    .populate('sender', 'name avatar')
    .sort('createdAt');

  res.status(200).json({
    success: true,
    data: messages,
  });
});
