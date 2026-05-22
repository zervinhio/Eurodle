const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

async function resetUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // Χρησιμοποιούμε δυναμικό import ή require για το μοντέλο User
    // Αν δεν θέλουμε να μπλέξουμε με ESM/CommonJS θέματα των models, 
    // μπορούμε να ορίσουμε ένα πρόχειρο schema εδώ για το update
    const UserSchema = new mongoose.Schema({
        score: Number,
        streak: Number,
        maxStreak: Number,
        lastPlayed: Date,
        lastPlayedHL: String,
        lastPlayedPath: String,
        bestHlScore: Number,
        lastClassicGuesses: Number,
        lastPathPoints: Number,
        lastHLPoints: Number
    });
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    console.log('🧹 Resetting all users to 0...');
    
    const result = await User.updateMany({}, {
      $set: {
        score: 0,
        streak: 0,
        maxStreak: 0,
        lastPlayed: null,
        lastPlayedHL: null,
        lastPlayedPath: null,
        bestHlScore: 0,
        lastClassicGuesses: 0,
        lastPathPoints: 0,
        lastHLPoints: 0
      }
    });

    console.log(`✅ Successfully reset ${result.modifiedCount} users.`);
    
  } catch (err) {
    console.error('❌ Error during reset:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

resetUsers();
