const mongoose = require('mongoose');

const gameScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    school: {
      type: String,
      default: 'EcoWarriors Player',
    },
    score: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
    },
    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },
    itemsSorted: {
      type: Number,
      default: 0,
      min: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    time: {
      type: Number,  // seconds taken to complete
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes for fast leaderboard queries ──────────────────────
gameScoreSchema.index({ score: -1 });          // sort by score desc
gameScoreSchema.index({ level: 1, score: -1 }); // filter by level then sort
gameScoreSchema.index({ user: 1, score: -1 });  // user's best scores

module.exports = mongoose.model('GameScore', gameScoreSchema);
