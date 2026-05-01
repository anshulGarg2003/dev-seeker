import Discussion from "@/database/model/discussion";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { logActivity } from "@/lib/activity";

// GET all discussions for a room
export async function GET(request, { params }) {
  await connectToDatabase();
  const { roomId } = params;

  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return NextResponse.json(
      { error: "Invalid room ID" },
      { status: 400 }
    );
  }

  try {
    const discussions = await Discussion.find({
      roomId: new mongoose.Types.ObjectId(roomId),
    }).sort({ createdAt: -1 });

    return NextResponse.json(discussions, { status: 200 });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

// POST a new discussion comment
export async function POST(request, { params }) {
  await connectToDatabase();
  const { roomId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return NextResponse.json(
      { error: "Invalid room ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: "Content exceeds 5000 characters" },
        { status: 400 }
      );
    }

    const discussion = await Discussion.create({
      roomId: new mongoose.Types.ObjectId(roomId),
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: session.user.name,
      userImage: session.user.image,
      content: content.trim(),
    });

    await logActivity(session.user.id);

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
