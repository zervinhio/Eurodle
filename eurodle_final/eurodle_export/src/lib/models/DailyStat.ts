import mongoose, { Schema, model, models } from "mongoose";

const dailyStatSchema = new Schema({
  date: { type: String, required: true, unique: true }, // Ημερομηνία σε μορφή YYYY-MM-DD
  totalGuesses: { type: Number, default: 0 },           // Το άθροισμα όλων των προσπαθειών
  totalWinners: { type: Number, default: 0 },           // Πόσοι χρήστες κέρδισαν σήμερα
});

const DailyStat = models.DailyStat || model("DailyStat", dailyStatSchema);
export default DailyStat;