import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import Skill from '../models/Skill.js';

// @desc    Get all skills with optional search & filter
// @route   GET /api/skills
// @access  Public
export const getSkills = asyncHandler(async (req, res, next) => {
  let query;
  
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from normal matching
  const removeFields = ['search', 'sort', 'limit', 'page'];
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  // Search logic (using text index)
  if (req.query.search) {
    query = Skill.find({
      $text: { $search: req.query.search },
      ...JSON.parse(queryStr)
    });
  } else {
    query = Skill.find(JSON.parse(queryStr)).populate({
      path: 'seller',
      select: 'name role rating totalReviews avatar',
    });
  }

  const skills = await query;

  res.status(200).json({
    success: true,
    count: skills.length,
    data: skills,
  });
});

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id).populate({
    path: 'seller',
    select: 'name role rating totalReviews bio avatar',
  });

  if (!skill) {
    return next(new ApiError(`No skill found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: skill,
  });
});

// @desc    Add a skill listing
// @route   POST /api/skills
// @access  Private (Seller only)
export const createSkill = asyncHandler(async (req, res, next) => {
  req.body.seller = req.user.id;

  const skill = await Skill.create(req.body);

  res.status(201).json({
    success: true,
    data: skill,
  });
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Seller only)
export const updateSkill = asyncHandler(async (req, res, next) => {
  let skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new ApiError(`No skill found with id of ${req.params.id}`, 404));
  }

  // Make sure user is skill owner
  if (skill.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ApiError(`User not authorized to update this skill`, 401));
  }

  skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: skill,
  });
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Seller only)
export const deleteSkill = asyncHandler(async (req, res, next) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    return next(new ApiError(`No skill found with id of ${req.params.id}`, 404));
  }

  // Make sure user is skill owner
  if (skill.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ApiError(`User not authorized to delete this skill`, 401));
  }

  await skill.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
