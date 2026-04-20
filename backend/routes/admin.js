const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getAllUsers,
  deleteUser,
  getAllFeedback,
  getStats
} = require('../controllers/adminController');

// All routes here are protected and require admin role
router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/feedback', getAllFeedback);
router.get('/stats', getStats);

module.exports = router;
