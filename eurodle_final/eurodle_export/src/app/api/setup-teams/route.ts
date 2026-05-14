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

    // Ενημέρωση μόνο για τον Παναθηναϊκό
    const result = await Player.updateMany(
      { team: "Panathinaikos Athens" },
      { $set: { teamCode: "PAO" } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Ενημερώθηκαν ${result.modifiedCount} παίκτες του Παναθηναϊκού με το teamCode: PAO` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Σφάλμα κατά την ενημέρωση" }, { status: 500 });
  }
}