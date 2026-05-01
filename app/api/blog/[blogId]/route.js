import Blog from "@/database/model/blog";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET single blog by ID
export async function GET(req, { params }) {
  await connectToDatabase();
  const { blogId } = params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

// DELETE blog (author only)
export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { blogId } = params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    if (blog.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Blog.findByIdAndDelete(blogId);
    return NextResponse.json({ message: "Blog deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

// PATCH blog (author only — update or toggle like)
export async function PATCH(req, { params }) {
  await connectToDatabase();
  const { blogId } = params;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Toggle like
    if (body.action === "like") {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      const userId = session.user.id;
      const alreadyLiked = blog.likes.some(
        (id) => id.toString() === userId
      );

      if (alreadyLiked) {
        blog.likes = blog.likes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        blog.likes.push(userId);
      }

      await blog.save();
      return NextResponse.json({ likes: blog.likes }, { status: 200 });
    }

    // Edit blog (author only)
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    if (blog.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content, excerpt, tags, coverImage } = body;
    if (title) blog.title = title.trim().slice(0, 200);
    if (content) blog.content = content.trim().slice(0, 50000);
    if (excerpt !== undefined) blog.excerpt = excerpt.trim().slice(0, 500);
    if (tags !== undefined) blog.tags = tags.trim();
    if (coverImage !== undefined) blog.coverImage = coverImage.trim();

    await blog.save();
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
