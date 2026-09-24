const express = require('express');
const router = express.Router();
const { getGames, getGameById, addToLibrary } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/:id/library', protect, addToLibrary);

module.exports = router;
