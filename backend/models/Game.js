const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a game title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a game description']
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price']
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL']
    },
    rating: {
      type: Number,
      default: 4.5
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Game', gameSchema);
