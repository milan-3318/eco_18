const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional if guest feedback is allowed
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    category: {
      type: String,
      enum: ['Gameplay', 'Design', 'Bug', 'Suggestion', 'Other'],
      default: 'Suggestion',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [5, 'Message must be at least 5 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
