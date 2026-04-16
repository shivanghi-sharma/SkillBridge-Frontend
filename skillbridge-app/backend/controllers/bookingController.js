import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Booking from '../models/Booking.js';
import Skill from '../models/Skill.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res, next) => {
  const { skillId, date, timeSlot, notes } = req.body;

  // Find the skill to get the seller and price
  const skill = await Skill.findById(skillId);
  if (!skill) {
    return next(new ApiError('Skill not found', 404));
  }

  // A seller cannot book their own skill
  if (skill.seller.toString() === req.user.id) {
    return next(new ApiError('You cannot book your own skill', 400));
  }

  const booking = await Booking.create({
    buyer: req.user.id,
    seller: skill.seller,
    skill: skillId,
    date,
    timeSlot,
    duration: skill.duration,
    totalPrice: skill.price,
    notes,
    status: 'pending',
    paymentStatus: 'pending', // Will be handle later by Razorpay
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Get logged in user's bookings (both as buyer and seller)
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res, next) => {
  const bookingsAsBuyer = await Booking.find({ buyer: req.user.id })
    .populate('seller', 'name avatar')
    .populate('skill', 'title price duration')
    .sort('-createdAt');

  const bookingsAsSeller = await Booking.find({ seller: req.user.id })
    .populate('buyer', 'name avatar')
    .populate('skill', 'title price duration')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: {
      buying: bookingsAsBuyer,
      selling: bookingsAsSeller,
    },
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('buyer', 'name avatar email')
    .populate('seller', 'name avatar email')
    .populate('skill');

  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Ensure user is part of the booking
  if (
    booking.buyer._id.toString() !== req.user.id &&
    booking.seller._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ApiError('Not authorized to view this booking', 401));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Update booking status (Confirm, Complete, Cancel)
// @route   PATCH /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['confirmed', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new ApiError('Invalid status', 400));
  }

  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ApiError('Booking not found', 404));
  }

  // Authorization logic
  const isBuyer = booking.buyer.toString() === req.user.id;
  const isSeller = booking.seller.toString() === req.user.id;

  if (!isBuyer && !isSeller && req.user.role !== 'admin') {
    return next(new ApiError('Not authorized to update this booking', 401));
  }

  if (status === 'confirmed' && !isSeller) {
    return next(new ApiError('Only the seller can confirm a booking', 401));
  }

  booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: booking,
  });
});
