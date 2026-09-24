const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password']
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free'
    },
    library: [
      {
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Game',
          required: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

module.exports = mongoose.model('User', userSchema);
