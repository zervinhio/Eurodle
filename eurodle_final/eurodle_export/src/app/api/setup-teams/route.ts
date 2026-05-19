import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Player } from '@/lib/models/Player';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI as string);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (process.env.NODE_ENV === "production" && searchParams.get("key") !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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