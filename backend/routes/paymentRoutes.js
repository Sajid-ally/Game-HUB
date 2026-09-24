const express = require('express');
const router = express.Router();
const { demoPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/demo', protect, demoPayment);

module.exports = router;
