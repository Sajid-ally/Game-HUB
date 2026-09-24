const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get user profile details
// @route   GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        libraryCount: user.library.length,
        createdAt: user.createdAt
      },
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching profile' });
  }
};

// @desc    Get user's personal game library
// @route   GET /api/user/library
const getLibrary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'library.game',
      model: 'Game'
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format output with game data and addedAt date
    const libraryGames = user.library
      .filter((item) => item.game != null) // Guard against deleted games
      .map((item) => ({
        _id: item.game._id,
        title: item.game.title,
        description: item.game.description,
        genre: item.game.genre,
        price: item.game.price,
        image: item.game.image,
        rating: item.game.rating,
        addedAt: item.addedAt
      }));

    res.json(libraryGames);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching library' });
  }
};

module.exports = {
  getProfile,
  getLibrary
};
