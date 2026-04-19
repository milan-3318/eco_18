const Feedback = require('../models/Feedback');
const { validationResult } = require('express-validator');

// @route   POST /api/feedback
// @desc    Submit new feedback
// @access  Public (Optional Auth)
exports.submitFeedback = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { name, email, rating, category, message } = req.body;

    const feedback = await Feedback.create({
      user: req.user ? req.user._id : null,
      name,
      email,
      rating,
      category,
      message,
    });

    console.log(`💬 New Feedback from ${name}: [${category}] ${rating} stars`);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! 🌍',
      feedback,
    });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
};

// @route   GET /api/feedback
// @desc    Get all feedback (for admin/display)
// @access  Public
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: feedback.length, feedback });
  } catch (err) {
    console.error('Get feedback error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback.' });
  }
};
