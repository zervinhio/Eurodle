import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player'; // Βάλε το σωστό path αν χρειάζεται

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function GET() {
  try {
    await connectDB();
    const allPlayers = await Player.find({}); // Φέρνει όλα τα documents
    return NextResponse.json(allPlayers);
  } catch (error) {
    return NextResponse.json({ error: "Σφάλμα εξαγωγής" }, { status: 500 });
  }
}