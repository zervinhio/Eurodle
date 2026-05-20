import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import DailyStat from "@/lib/models/DailyStat";

function getPoints(guessNumber: number, mode: string): number {
  if (mode === 'player_id') {
    // Logic: 100 max, -20 per hint (assuming guessesCount is used as hint count or similar)
    // For now, let's stick to the 100-80-70-60-40-20-10 logic if guessesCount is provided
    // or a fixed logic for path.
    // Based on frontend: 100 - (hints * 20), min 20.
    // We'll pass hints count as guessesCount for path mode.
    let pts = 100 - (guessNumber * 20);
    return Math.max(pts, 20);
  }
  
  // Classic mode logic
  if (guessNumber <= 5) return 100; 
  if (guessNumber <= 8) return 80; 
  if (guessNumber <= 11) return 70;
  if (guessNumber <= 14) return 60; 
  if (guessNumber <= 17) return 40; 
  if (guessNumber <= 20) return 20; 
  return 10;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { guessesCount, mode } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const athensFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' });
    const now = new Date();
    const todayAthens = athensFormatter.format(now);

    const calculatedPoints = getPoints(guessesCount || 0, mode || 'classic');

    let dailyStat = await DailyStat.findOne({ date: todayAthens });
    if (!dailyStat) {
      dailyStat = await DailyStat.create({ date: todayAthens, totalGuesses: 0, totalWinners: 0 });
    }

    if (!mode || mode === 'classic') {
      if (user.lastPlayed) {
        const lastPlayedAthens = athensFormatter.format(new Date(user.lastPlayed));
        if (todayAthens === lastPlayedAthens) {
          const avg = dailyStat.totalWinners > 0 ? (dailyStat.totalGuesses / dailyStat.totalWinners).toFixed(1) : 0;
          return NextResponse.json({ error: "Already played today", streak: user.streak, score: user.score, globalAverage: avg }, { status: 400 });
        }
      }

      let newStreak = 1;
      if (user.lastPlayed) {
        const lastPlayedAthens = athensFormatter.format(new Date(user.lastPlayed));
        const todayDate = new Date(todayAthens);
        const lastPlayedDate = new Date(lastPlayedAthens);
        const diffDays = Math.round((todayDate.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak = (user.streak || 0) + 1;
      }

      user.score = (user.score || 0) + calculatedPoints;
      user.streak = newStreak;
      user.lastPlayed = now;
      if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;

      if (guessesCount) {
        dailyStat.totalGuesses += guessesCount;
        dailyStat.totalWinners += 1;
        await dailyStat.save();
      }
    } else if (mode === 'player_id') {
      if (user.lastPlayedPath === todayAthens) {
        return NextResponse.json({ error: "Already played Path today", score: user.score }, { status: 400 });
      }
      user.score = (user.score || 0) + calculatedPoints;
      user.lastPlayedPath = todayAthens;
    }

    await user.save();
    const globalAverage = dailyStat.totalWinners > 0 ? (dailyStat.totalGuesses / dailyStat.totalWinners).toFixed(1) : (guessesCount || 0);

    return NextResponse.json({ success: true, streak: user.streak, score: user.score, globalAverage, points: calculatedPoints });
  } catch (error) {
    console.error("Save game error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}