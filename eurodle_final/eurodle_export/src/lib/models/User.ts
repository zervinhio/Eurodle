import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String }, 
  score: { type: Number, default: 0 }, // Συνολικοί πόντοι του χρήστη (από όλα τα games)
  streak: { type: Number, default: 0 },
  maxStreak: { type: Number, default: 0 },
  lastPlayed: { type: Date }, // Πότε έπαιξε το κλασικό Eurodle
  
  // --- ΝΕΑ ΠΕΔΙΑ ΓΙΑ HIGHER/LOWER ---
  lastPlayedHL: { type: String }, // Θα αποθηκεύει String (π.χ. "12/05/2026") με ώρα Ελλάδος
  lastPlayedPath: { type: String }, // Πότε έπαιξε το Path mode
  bestHlScore: { type: Number, default: 0 } // Το μεγαλύτερο σερί που έχει κάνει στο Higher/Lower
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;