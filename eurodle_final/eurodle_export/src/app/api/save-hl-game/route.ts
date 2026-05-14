import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth/next'; 
// import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"; // Βάλε το σωστό path για το authOptions σου αν χρειάζεται

// Υπολογισμός Τρέχουσας Ημερομηνίας Ελλάδος
const getGreeceDate = () => {
  return new Intl.DateTimeFormat('el-GR', {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date()); // Παράδειγμα: "12/05/2026"
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(); 
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Μη εξουσιοδοτημένος χρήστης" }, { status: 401 });
    }

    const { pointsToAdd, finalScore } = await req.json();

    if (mongoose.connection.readyState < 1) await mongoose.connect(process.env.MONGODB_URI as string);

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "Ο χρήστης δεν βρέθηκε" }, { status: 404 });

    const todayGreek = getGreeceDate();

    // Αν η μέρα που έχει αποθηκευτεί είναι η σημερινή, τον κόβουμε
    if (user.lastPlayedHL === todayGreek) {
      return NextResponse.json({ error: "Έχεις ήδη παίξει για σήμερα!" }, { status: 400 });
    }

    // Ενημέρωση του χρήστη
    user.lastPlayedHL = todayGreek; // Τον "κλειδώνουμε" για σήμερα
    user.score += pointsToAdd;      // Του δίνουμε τους πόντους
    
    // Αν έκανε νέο ρεκόρ, το αποθηκεύουμε
    if (finalScore > user.bestHlScore) {
      user.bestHlScore = finalScore;
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      newTotalScore: user.score, 
      bestHlScore: user.bestHlScore 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Σφάλμα κατά την αποθήκευση" }, { status: 500 });
  }
}