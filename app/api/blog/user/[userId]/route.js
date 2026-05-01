import Blog from "@/database/model/blog";
import connectToDatabase from "@/database/mongoose";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET all blogs by a specific user
export async function GET(req, { params }) {
  await connectToDatabase();
  const { userId } = params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const blogs = await Blog.find({ userId, published: true })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user blogs" }, { status: 500 });
  }
}
