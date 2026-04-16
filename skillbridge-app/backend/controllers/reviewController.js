import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Get reviews for a specific user (seller)
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getReviewsByUser = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ reviewee: req.params.userId })
    .populate('reviewer', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res, next) => {
  const { bookingId, rating, comment } = req.body;

  // Find booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Ensure user is the buyer
  if (booking.buyer.toString() !== req.user.id) {
    return next(new ApiError('Only the buyer can leave a review', 401));
  }

  // Ensure booking is completed
  if (booking.status !== 'completed') {
    return next(new ApiError('Cannot review a booking that is not completed', 400));
  }

  // Create review
  const review = await Review.create({
    booking: bookingId,
    reviewer: req.user.id,
    reviewee: booking.seller,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});
