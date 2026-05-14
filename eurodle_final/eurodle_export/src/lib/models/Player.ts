// src/lib/models/Player.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayer extends Document {
  playerId: string;
  name: string;
  firstName: string;
  lastName: string;
  team: string;
  teamCode: string;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  nationality: string;
  height: number;
  imageUrl: string;
  dorsal: string; // Το νούμερο της φανέλας
  active: boolean;
  // ΠΡΟΣΘΗΚΗ: Στατιστικά της σεζόν
  stats: {
    ppg: number; // Points Per Game
    rpg: number; // Rebounds Per Game
    apg: number; // Assists Per Game
  };
}

const PlayerSchema = new Schema<IPlayer>(
  {
    playerId:    { type: String, required: true, unique: true },
    name:        { type: String, required: true },
    firstName:   String,
    lastName:    String,
    team:        { type: String, required: true },
    teamCode:    String, // π.χ. "OLY", "PAO", "RMB"
    position:    { type: String, required: true },
    nationality: { type: String, required: true },
    height:      { type: Number, required: true },
    imageUrl:    String,
    dorsal:      String,
    active:      { type: Boolean, default: true },
    // ΠΡΟΣΘΗΚΗ: Στατιστικά
    stats: {
      ppg: { type: Number, default: 0 },
      rpg: { type: Number, default: 0 },
      apg: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

PlayerSchema.index({ name: "text" });
PlayerSchema.index({ active: 1 });

export const Player: Model<IPlayer> =
  mongoose.models.Player ||
  mongoose.model<IPlayer>("Player", PlayerSchema);