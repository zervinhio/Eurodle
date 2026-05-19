import { NextResponse } from "next/server";
import { getDailyPlayerPath } from "@/lib/dailyPlayer";

// Λέμε στο Next.js να μην το κάνει cache, για να φέρνει τον σωστό παίκτη αν αλλάξει η μέρα
export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    const dailyPlayer = await getDailyPlayerPath();
    return NextResponse.json(dailyPlayer);
  } catch (error: any) {
    console.error("Player ID API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}