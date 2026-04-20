const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    avatar: {
      type: String,
      default: '🌿',
    },
    school: {
      type: String,
      default: 'EcoWarriors Player',
      trim: true,
    },
    // Aggregated stats (updated on each score save)
    totalGames: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    bestScore:  { type: Number, default: 0 },
    isActive:   { type: Boolean, default: true },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// ── Hash password before saving ───────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare plain password with hash ─────────
userSchema.methods.matchPassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// ── Virtual: public profile (no sensitive fields) ─────────────
userSchema.methods.toPublicJSON = function () {
  return {
    id:         this._id,
    username:   this.username,
    email:      this.email,
    avatar:     this.avatar,
    school:     this.school,
    totalGames: this.totalGames,
    totalScore: this.totalScore,
    bestScore:  this.bestScore,
    role:       this.role,
    createdAt:  this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
