import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { image: imageUrl } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, image: user.image });
  } catch (error) {
    console.error("Update icon error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
