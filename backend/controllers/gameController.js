const Game = require('../models/Game');
const User = require('../models/User');

// @desc    Get all games
// @route   GET /api/games
const getGames = async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error fetching games' });
  }
};

// @desc    Get single game by ID
// @route   GET /api/games/:id
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(500).json({ message: error.message || 'Server error fetching game details' });
  }
};

// @desc    Add a game to current user's library
// @route   POST /api/games/:id/library
const addToLibrary = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if game is already in user library
    const alreadyInLibrary = user.library.some(
      (item) => item.game.toString() === gameId
    );

    if (alreadyInLibrary) {
      return res.status(400).json({ message: 'Game is already in your library' });
    }

    // Check plan limits (Free plan allows maximum 3 games)
    if (user.plan === 'free' && user.library.length >= 3) {
      return res.status(403).json({
        message: 'Free plan limit reached (maximum 3 games). Please upgrade to Pro for unlimited library access.',
        limitReached: true
      });
    }

    // Add game to library
    user.library.push({
      game: game._id,
      addedAt: new Date()
    });

    await user.save();

    res.status(200).json({
      message: `"${game.title}" has been added to your library!`,
      library: user.library
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(500).json({ message: error.message || 'Server error adding game to library' });
  }
};

module.exports = {
  getGames,
  getGameById,
  addToLibrary
};
