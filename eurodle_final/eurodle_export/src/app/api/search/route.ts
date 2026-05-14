// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/lib/models/Player";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  await connectDB();

  const players = await Player.find({
    active: true,
    name: { $regex: q, $options: "i" },
  })
    .select("playerId name team position imageUrl")
    .limit(8)
    .lean();

  return NextResponse.json(players);
}
