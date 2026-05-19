import { NextResponse } from "next/server";
import mongoose from "mongoose";
import PlayerIdGame from "@/lib/models/PlayerIdGame";
import {Player} from "@/lib/models/Player"; // Το μοντέλο του Classic παιχνιδιού

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) return NextResponse.json([]);

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) return NextResponse.json({ error: "No DB" }, { status: 500 });

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }

    // 1. Ψάχνουμε στη βάση του Player Path (Legends & Stars)
    const pathPlayers = await PlayerIdGame.find({ 
      name: { $regex: q, $options: "i" } 
    }).limit(10); 

    // 2. Ψάχνουμε ΣΥΓΧΡΟΝΩΣ και στη βάση του Classic (όλο το φετινό ρόστερ)
    const classicPlayers = await Player.find({
      name: { $regex: q, $options: "i" }
    }).limit(10);

    // 3. Ενώνουμε τις δύο λίστες χωρίς διπλότυπα
    const combined = [];
    const seenNames = new Set();

    // Βάζουμε πρώτα τους παίκτες από το Player Path
    for (const p of pathPlayers) {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        combined.push({
          playerId: p._id.toString(),
          name: p.name,
          team: p.career && p.career.length > 0 ? p.career[p.career.length - 1].team : "Legend", 
          position: p.hints?.position ? p.hints.position.split(" ")[0] : "UNK"
        });
      }
    }

    // Βάζουμε και τους παίκτες από το Classic (αν δεν έχουν μπει ήδη)
    for (const p of classicPlayers) {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        combined.push({
          playerId: p.playerId || p._id.toString(),
          name: p.name,
          team: p.team || "Unknown",
          position: p.position || "UNK"
        });
      }
    }

    // Επιστρέφουμε τα 10 καλύτερα αποτελέσματα
    return NextResponse.json(combined.slice(0, 10));
  } catch (error) {
    console.error("Search Path Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}