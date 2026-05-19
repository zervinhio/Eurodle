
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env.local");
  process.exit(1);
}

// Define Player Schema locally for the script
const PlayerSchema = new mongoose.Schema({
  name: String,
  eligibleForHL: Boolean,
  stats: {
    ppg: Number,
    rpg: Number,
    apg: Number
  }
}, { collection: 'players' }); // Ensure it matches your collection name

const Player = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

async function updateDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const targets = ['Georgios Papagiannis', 'Brice Dessert', 'Boogie Ellis', 'Cameron Payne', 'Kai Jones'];
    
    // 1. Update specific targets
    const res1 = await Player.updateMany(
      { name: { $in: targets } },
      { 
        $set: { 
          eligibleForHL: false,
          stats: { ppg: 0, rpg: 0, apg: 0 } 
        } 
      }
    );
    console.log(`📝 Updated specific targets: ${res1.modifiedCount} players.`);

    // 2. Update anyone with zero stats
    const res2 = await Player.updateMany(
      { 
        "stats.ppg": 0, 
        "stats.rpg": 0, 
        "stats.apg": 0,
        eligibleForHL: { $ne: false } 
      },
      { $set: { eligibleForHL: false } }
    );
    console.log(`📝 Set eligibleForHL to false for ${res2.modifiedCount} players with zero stats.`);

    console.log("🚀 Database sync complete!");
  } catch (err) {
    console.error("❌ Error updating database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

updateDB();
