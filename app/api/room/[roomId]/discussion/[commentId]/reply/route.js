import Discussion from "@/database/model/discussion";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// POST a reply to a discussion comment
export async function POST(request, { params }) {
  await connectToDatabase();
  const { commentId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    return NextResponse.json(
      { error: "Invalid comment ID" },
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

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Reply exceeds 2000 characters" },
        { status: 400 }
      );
    }

    const discussion = await Discussion.findById(commentId);

    if (!discussion) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    discussion.replies.push({
      userId: new mongoose.Types.ObjectId(session.user.id),
      userName: session.user.name,
      userImage: session.user.image,
      content: content.trim(),
    });

    await discussion.save();

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
