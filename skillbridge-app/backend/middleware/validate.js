import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    // You can also pass the structured errors array if needed
    return next(new ApiError(errorMessages.join(', '), 400, errors.array()));
  }
  next();
};

export default validate;
