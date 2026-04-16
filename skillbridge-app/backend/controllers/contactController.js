import asyncHandler from '../utils/asyncHandler.js';
import Contact from '../models/Contact.js';

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    data: contact,
    message: 'Message sent successfully. We will get back to you soon!',
  });
});
