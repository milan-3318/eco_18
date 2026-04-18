const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  saveScore,
  getLeaderboard,
  getMyScores,
  getStats,
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

// ── Validation rules ──────────────────────────────────────────
const saveScoreRules = [
  body('score')
    .isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
  body('level')
    .isInt({ min: 1, max: 3 }).withMessage('Level must be 1, 2, or 3'),
  body('itemsSorted')
    .optional()
    .isInt({ min: 0 }).withMessage('itemsSorted must be a non-negative integer'),
  body('time')
    .optional()
    .isInt({ min: 0 }).withMessage('Time must be a non-negative integer'),
  body('accuracy')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100'),
];

// ── Routes ────────────────────────────────────────────────────

// POST /api/game/save   (protected — must be logged in to save scores)
router.post('/save', protect, saveScoreRules, saveScore);

// GET  /api/game/leaderboard  (public — anyone can view)
// Query params: ?level=1|2|3  ?limit=50
router.get('/leaderboard', getLeaderboard);

// GET  /api/game/my-scores  (protected)
router.get('/my-scores', protect, getMyScores);

// GET  /api/game/stats  (public)
router.get('/stats', getStats);

module.exports = router;
