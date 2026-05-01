import Discussion from "@/database/model/discussion";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// DELETE a discussion (only by author)
export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { roomId, commentId } = params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !commentId ||
    !mongoose.Types.ObjectId.isValid(commentId) ||
    !roomId ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    return NextResponse.json({ error: "Invalid IDs" }, { status: 400 });
  }

  try {
    const discussion = await Discussion.findById(commentId);

    if (!discussion) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (discussion.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this comment" },
        { status: 403 }
      );
    }

    await Discussion.findByIdAndDelete(commentId);

    return NextResponse.json(
      { message: "Comment deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}

// PATCH - toggle like on a discussion
export async function PATCH(request, { params }) {
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
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const discussion = await Discussion.findById(commentId);

    if (!discussion) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const hasLiked = discussion.likes.some(
      (id) => id.toString() === session.user.id
    );

    if (hasLiked) {
      discussion.likes = discussion.likes.filter(
        (id) => id.toString() !== session.user.id
      );
    } else {
      discussion.likes.push(userId);
    }

    await discussion.save();

    return NextResponse.json(discussion, { status: 200 });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
