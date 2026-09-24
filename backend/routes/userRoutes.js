const express = require('express');
const router = express.Router();
const { getProfile, getLibrary } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.get('/library', protect, getLibrary);

module.exports = router;
