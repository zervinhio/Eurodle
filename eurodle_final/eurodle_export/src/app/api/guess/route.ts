// src/app/api/guess/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Player } from "@/lib/models/Player";
import { getDailyPlayer } from "@/lib/dailyPlayer";
import { buildFeedback, GuessResult } from "@/lib/gameLogic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const playerId: string = body?.playerId ?? "";

  if (!playerId) {
    return NextResponse.json({ error: "playerId is required" }, { status: 400 });
  }

  await connectDB();

  // Load guessed player
  const guessed = await Player.findOne({ playerId, active: true }).lean();
  if (!guessed) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  // Load today's secret player
  const target = await getDailyPlayer();

  const feedback = buildFeedback(
    {
      team: guessed.team,
      position: guessed.position,
      nationality: guessed.nationality,
      height: guessed.height,
    },
    {
      team: target.team,
      position: target.position,
      nationality: target.nationality,
      height: target.height,
    }
  );

  const isCorrect = guessed.playerId === target.playerId;

  const result: GuessResult & { isCorrect: boolean } = {
    name: guessed.name,
    team: guessed.team,
    position: guessed.position,
    nationality: guessed.nationality,
    height: guessed.height,
    imageUrl: guessed.imageUrl ?? "",
    feedback,
    isCorrect,
  };

  return NextResponse.json(result);
}
