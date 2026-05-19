import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function GET() {
  try {
    await connectDB();

    // Ενημέρωση με τους ΠΡΑΓΜΑΤΙΚΟΥΣ ΜΕΣΟΥΣ ΟΡΟΟΥΣ (Per Game)
    const updatedPlayer = await Player.findOneAndUpdate(
      { name: { $regex: /Bacot/i } },
      {
        $set: {
          stats: {
            ppg: 2.6,  // Πραγματικοί πόντοι ανά αγώνα (Μέσος Όρος)
            rpg: 1.9,  // Πραγματικά ριμπάουντ ανά αγώνα
            apg: 0.3,  // Πραγματικές ασίστ ανά αγώνα
            spg: 0.2,
            bpg: 0.2
          }
        }
      },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ error: "Player Bacot not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Τα στατιστικά του Bacot διορθώθηκαν σε Μέσους Όρους!",
      player: updatedPlayer
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}