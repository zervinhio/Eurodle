import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player'; // Αν σου βγάλει σφάλμα εδώ, άλλαξέ το σε '@/src/lib/models/Player'

// Νέα, απόλυτα ασφαλής συνάρτηση σύνδεσης για Serverless / Next.js
async function connectDB() {
  const state = mongoose.connection.readyState;
  
  if (state === 1) {
    return; // Είναι ήδη 100% συνδεδεμένο
  }
  
  if (state === 2) {
    // Είναι ήδη στη διαδικασία σύνδεσης. Του λέμε "περίμενε να τελειώσει πρώτα!"
    await mongoose.connection.asPromise();
    return;
  }
  
  // Δεν υπάρχει σύνδεση, άρα κάνουμε νέα.
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function GET() {
  try {
    // Τώρα θα περιμένει ΠΡΑΓΜΑΤΙΚΑ να συνδεθεί πριν πάει παρακάτω
    await connectDB();

    // Χρησιμοποιούμε το $sample του MongoDB για να φέρουμε 2 τυχαίους, ενεργούς παίκτες
    const randomPlayers = await Player.aggregate([
      { $match: { active: true } },
      { $sample: { size: 2 } },
      { 
        $project: {
          _id: 0,
          id: "$playerId",
          name: 1,
          teamCode: 1,
          dorsal: 1,
          stats: 1
        }
      }
    ]);

    if (randomPlayers.length < 2) {
      return NextResponse.json({ error: "Not enough players found" }, { status: 400 });
    }

    return NextResponse.json(randomPlayers);
  } catch (error) {
    console.error("Higher-Lower API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}