import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import DailyStat from "@/lib/models/DailyStat"; // Φορτώνουμε το νέο μοντέλο!

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Τώρα παίρνουμε και το guessesCount από το frontend!
    const { points, guessesCount } = await req.json();
    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const athensFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' });
    const now = new Date();
    const todayAthens = athensFormatter.format(now);

    let newStreak = user.streak || 0;
    let isAlreadyPlayed = false;

    if (user.lastPlayed) {
      const lastPlayedAthens = athensFormatter.format(new Date(user.lastPlayed));
      
      if (todayAthens === lastPlayedAthens) {
        isAlreadyPlayed = true;
      } else {
        const todayDate = new Date(todayAthens);
        const lastPlayedDate = new Date(lastPlayedAthens);
        
        // Βάλαμε Math.round για απόλυτη ασφάλεια στις αλλαγές ώρας
        const diffDays = Math.round((todayDate.getTime() - lastPlayedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1; // Συνεχίζει το σερί!
        } else {
          newStreak = 1; // Έχασε μέρα (άφησε το παιχνίδι στη μέση χθες), το σερί ξεκινάει πάλι από το 1.
        }
      }
    } else {
      newStreak = 1; // Πρώτη φορά που παίζει
    }

    // --- ΒΡΕΣ Η ΦΤΙΑΞΕ ΤΑ ΣΗΜΕΡΙΝΑ ΣΤΑΤΙΣΤΙΚΑ (DailyStat) ---
    let dailyStat = await DailyStat.findOne({ date: todayAthens });
    if (!dailyStat) {
      dailyStat = await DailyStat.create({ date: todayAthens, totalGuesses: 0, totalWinners: 0 });
    }

    // Αν έχει ήδη παίξει, απλά του επιστρέφουμε τον τρέχοντα μέσο όρο χωρίς να τον προσθέσουμε ξανά
    if (isAlreadyPlayed) {
      const avg = dailyStat.totalWinners > 0 ? (dailyStat.totalGuesses / dailyStat.totalWinners).toFixed(1) : 0;
      return NextResponse.json({ error: "Already played today", streak: user.streak, score: user.score, globalAverage: avg }, { status: 400 });
    }

    // --- 1. ΕΝΗΜΕΡΩΣΗ ΧΡΗΣΤΗ ---
    user.score = (user.score || 0) + points;
    user.streak = newStreak;
    user.lastPlayed = now;
    if (user.streak > (user.maxStreak || 0)) user.maxStreak = user.streak;
    await user.save();

    // --- 2. ΕΝΗΜΕΡΩΣΗ GLOBAL ΣΤΑΤΙΣΤΙΚΩΝ ---
    if (guessesCount) {
      dailyStat.totalGuesses += guessesCount;
      dailyStat.totalWinners += 1;
      await dailyStat.save();
    }

    // Υπολογισμός του νέου μέσου όρου (στρογγυλοποίηση στο 1 δεκαδικό, π.χ. 4.2)
    const globalAverage = dailyStat.totalWinners > 0 ? (dailyStat.totalGuesses / dailyStat.totalWinners).toFixed(1) : guessesCount;

    return NextResponse.json({ success: true, streak: user.streak, score: user.score, globalAverage });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}