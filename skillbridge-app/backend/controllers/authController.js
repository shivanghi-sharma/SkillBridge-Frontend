import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, skills } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError('User with that email already exists', 400));
  }

  // Create user
  const user = await User.create({
    name: name || email.split('@')[0], // Fallback name if none provided
    email,
    password,
    role: role || 'buyer',
    skills: skills || [],
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ApiError('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ApiError('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
  // req.user is set in auth middleware
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
