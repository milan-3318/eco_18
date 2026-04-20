const User = require('../models/User');
const GameScore = require('../models/GameScore');
const Feedback = require('../models/Feedback');

// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    const publicUsers = users.map(u => u.toPublicJSON());
    res.json({ success: true, users: publicUsers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
};

// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin users.' });

    await User.findByIdAndDelete(req.params.id);
    await GameScore.deleteMany({ username: user.username });
    
    res.json({ success: true, message: 'User and their scores deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
};

// @route   GET /api/admin/feedback
// @access  Private/Admin
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort('-createdAt');
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching feedback.' });
  }
};

// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const scoreCount = await GameScore.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    
    const highScores = await GameScore.find().sort('-score').limit(5);

    res.json({
      success: true,
      stats: {
        users: userCount,
        scores: scoreCount,
        feedback: feedbackCount,
        recentHighScores: highScores
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
};
