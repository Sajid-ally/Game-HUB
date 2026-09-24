const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Game = require('./models/Game');
const gamesData = require('./config/seedData');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auto-seed initial games if collection is empty
const autoSeedIfEmpty = async () => {
  try {
    const count = await Game.countDocuments();
    if (count === 0) {
      await Game.insertMany(gamesData);
      console.log(`Auto-seeded ${gamesData.length} games into GameHub database.`);
    }
  } catch (error) {
    console.error('Auto-seed check error:', error.message);
  }
};
autoSeedIfEmpty();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Root / Health check route
app.get('/api', (req, res) => {
  res.json({
    name: 'GameHub API',
    status: 'online',
    version: '1.0.0'
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GameHub backend server running on http://localhost:${PORT}`);
});
