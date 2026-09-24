const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Game = require('../models/Game');
const gamesData = require('./seedData');

dotenv.config();

const seedGames = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gamehub';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await Game.deleteMany();
    console.log('Existing games cleared.');

    const insertedGames = await Game.insertMany(gamesData);
    console.log(`Successfully seeded ${insertedGames.length} games into GameHub!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seed: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedGames();
}

module.exports = seedGames;
