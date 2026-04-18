const { validationResult } = require('express-validator');
const GameScore = require('../models/GameScore');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// @route   POST /api/game/save
// @desc    Save a completed game score
// @access  Private (JWT required)
// ─────────────────────────────────────────────────────────────
exports.saveScore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { score, level, itemsSorted, time, accuracy, streak } = req.body;
    const user = req.user;

    // Save game score record
    const gameScore = await GameScore.create({
      user:        user._id,
      username:    user.username,
      school:      user.school || 'EcoWarriors Player',
      score,
      level,
      itemsSorted: itemsSorted || 0,
      accuracy:    accuracy    || 0,
      time:        time        || 0,
      streak:      streak      || 0,
    });

    // Update user's aggregated stats
    await User.findByIdAndUpdate(user._id, {
      $inc: { totalGames: 1, totalScore: score },
      $max: { bestScore: score },
    });

    console.log(`🎮 Score saved: ${user.username} scored ${score} on Level ${level}`);

    res.status(201).json({
      success: true,
      message: 'Score saved successfully!',
      score: gameScore,
    });
  } catch (err) {
    console.error('Save score error:', err);
    res.status(500).json({ success: false, message: 'Failed to save score.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/game/leaderboard
// @desc    Get top scores — optionally filter by level
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.getLeaderboard = async (req, res) => {
  try {
    const { level, limit = 50 } = req.query;

    const filter = {};
    if (level && [1, 2, 3].includes(Number(level))) {
      filter.level = Number(level);
    }

    // Get the top N scores; use aggregation to get each user's BEST score per level
    const pipeline = [
      { $match: filter },
      {
        $sort: { score: -1 },
      },
      {
        // Get only one (best) record per user (per level if filtered)
        $group: {
          _id:         '$user',
          username:    { $first: '$username' },
          school:      { $first: '$school' },
          score:       { $max: '$score' },
          level:       { $first: '$level' },
          itemsSorted: { $first: '$itemsSorted' },
          accuracy:    { $first: '$accuracy' },
          time:        { $first: '$time' },
          createdAt:   { $first: '$createdAt' },
        },
      },
      { $sort: { score: -1 } },
      { $limit: Math.min(Number(limit), 100) },
      {
        $project: {
          _id:         0,
          userId:      '$_id',
          username:    1,
          school:      1,
          score:       1,
          level:       1,
          itemsSorted: 1,
          accuracy:    1,
          time:        1,
          createdAt:   1,
        },
      },
    ];

    const leaderboard = await GameScore.aggregate(pipeline);

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/game/my-scores
// @desc    Get all scores for the logged-in user
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getMyScores = async (req, res) => {
  try {
    const scores = await GameScore.find({ user: req.user._id })
      .sort({ score: -1 })
      .limit(20)
      .select('-user -__v');

    res.json({ success: true, count: scores.length, scores });
  } catch (err) {
    console.error('My scores error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch your scores.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/game/stats
// @desc    Get overall game statistics (public)
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [totalGames, totalPlayers, topScore] = await Promise.all([
      GameScore.countDocuments(),
      User.countDocuments({ isActive: true }),
      GameScore.findOne().sort({ score: -1 }).select('score username'),
    ]);

    res.json({
      success: true,
      stats: {
        totalGames,
        totalPlayers,
        topScore: topScore ? topScore.score : 0,
        topPlayer: topScore ? topScore.username : null,
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};
