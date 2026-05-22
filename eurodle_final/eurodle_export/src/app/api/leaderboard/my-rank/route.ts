import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ rank: null });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email }).select("score name image");
    if (!currentUser) {
      return NextResponse.json({ rank: null });
    }

    // Υπολογίζουμε πόσοι χρήστες έχουν μεγαλύτερο σκορ
    const countAbove = await User.countDocuments({ score: { $gt: currentUser.score } });
    
    // Η θέση του είναι countAbove + 1
    const rank = countAbove + 1;

    return NextResponse.json({ 
      rank, 
      score: currentUser.score,
      name: currentUser.name,
      image: currentUser.image 
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return NextResponse.json({ error: "Failed to fetch rank" }, { status: 500 });
  }
}
