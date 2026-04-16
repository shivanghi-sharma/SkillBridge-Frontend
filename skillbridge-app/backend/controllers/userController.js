import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

// @desc    Get all active sellers
// @route   GET /api/users
// @access  Public
export const getSellers = asyncHandler(async (req, res, next) => {
  const query = { role: 'seller' };

  // Filter by verified if provided
  if (req.query.isVerified) {
    query.isVerified = req.query.isVerified === 'true';
  }

  const sellers = await User.find(query).select('-password');

  res.status(200).json({
    success: true,
    count: sellers.length,
    data: sellers,
  });
});

// @desc    Get public user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ApiError(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    bio: req.body.bio,
    skills: req.body.skills,
    experience: req.body.experience,
    hourlyRate: req.body.hourlyRate,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select('-password');

  res.status(200).json({
    success: true,
    data: user,
  });
});
