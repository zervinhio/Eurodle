import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

// Λέμε στο Next.js να μην κρατάει cache, ώστε το leaderboard να είναι πάντα φρέσκο!
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    // Ψάχνουμε όλους τους χρήστες, τους ταξινομούμε με βάση το score (φθίνουσα σειρά) και κρατάμε τους top 50
    const topPlayers = await User.find({})
      .sort({ score: -1 })
      .limit(50)
      .select("name image score streak");

    return NextResponse.json(topPlayers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}