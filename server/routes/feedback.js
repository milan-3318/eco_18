const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { optionalAuth } = require('../middleware/auth');

const feedbackRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('category').notEmpty().withMessage('Category is required'),
  body('message').isLength({ min: 5 }).withMessage('Message must be at least 5 characters'),
];

router.post('/', optionalAuth, feedbackRules, submitFeedback);
router.get('/', getAllFeedback);

module.exports = router;
