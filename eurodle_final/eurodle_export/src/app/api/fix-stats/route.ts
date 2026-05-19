import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

const PLAYERS_TO_FIX = [
  "Giannoulis Larentzakis",
  "Isaiah Canaan",
  "Monte Morris",
  "Miikka Muurinen",
  "Alex Len",
  "Richaun Holmes",
  "Cole Swider"
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (process.env.NODE_ENV === "production" && searchParams.get("key") !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const result = await Player.updateMany(
      { name: { $in: PLAYERS_TO_FIX } },
      { 
        $set: { 
          eligibleForHL: false,
          stats: { ppg: 0, rpg: 0, apg: 0 } 
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: `Ενημερώθηκαν ${result.modifiedCount} παίκτες. Τα στατιστικά τους μηδενίστηκαν και αφαιρέθηκαν από το Higher/Lower.`,
      fixedPlayers: PLAYERS_TO_FIX
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
