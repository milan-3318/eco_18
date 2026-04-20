const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// ── Helper: sign JWT ──────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const { name, email, password, avatar, school, adminCode } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: name }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        message: `${field} is already registered. Please use a different one.`,
      });
    }

    // Determine role (check secret code)
    let role = 'user';
    if (adminCode && adminCode === process.env.ADMIN_SECRET_CODE) {
      role = 'admin';
    }

    // Create user (password hashed by pre-save hook)
    const user = await User.create({
      username: name,
      email,
      password,
      avatar: avatar || '🌿',
      school: school || 'EcoWarriors Player',
      role,
    });

    const token = signToken(user._id);

    console.log(`✅ New user registered: ${user.username} (${user.email})`);

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.username}! Your account has been created.`,
      token,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
    });
  } catch (err) {
    console.error('Register error:', err);
    // MongoDB duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already taken.`,
      });
    }
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login and receive JWT
// @access  Public
// ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { email, password } = req.body;

    // Find user by email OR username (frontend may send either)
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email }, // 'email' field may actually be a username
      ],
    }).select('+password'); // include password for comparison

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with that email or username.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    const token = signToken(user._id);

    console.log(`✅ User logged in: ${user.username}`);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.username}!`,
      token,
      username: user.username,
      avatar: user.avatar,
      school: user.school,
      role: user.role,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user's profile
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: user.toPublicJSON() });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update user profile (school, avatar)
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { school, avatar } = req.body;
    const updates = {};
    if (school) updates.school = school.trim();
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Profile updated.', user: user.toPublicJSON() });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
