import mongoose from 'mongoose';

const PlayerIdGameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // Ημερομηνία για το ποια μέρα θα παίξει αυτός ο παίκτης (π.χ. "2026-05-18")
  scheduledDate: { type: String, unique: true, sparse: true }, 
  
  // Η πορεία του παίκτη
  career: [{
    team: { type: String, required: true },
    years: { type: String, required: true }
  }],

  // Τα 3 Hints που θα ξεκλειδώνουν σταδιακά ανά 3 λάθη
  hints: {
    jersey: { type: String, required: true },
    position: { type: String, required: true },
    nationality: { type: String, required: true }
  },
  guessableOnly: { type: Boolean, default: false } 
}, { timestamps: true });

const PlayerIdGame = mongoose.models.PlayerIdGame || mongoose.model('PlayerIdGame', PlayerIdGameSchema);

export default PlayerIdGame;