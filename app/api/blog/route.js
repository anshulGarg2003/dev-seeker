import Blog from "@/database/model/blog";
import connectToDatabase from "@/database/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

// GET all published blogs (sorted newest first)
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");

    const query = { published: true };
    if (tag) {
      query.tags = { $regex: tag, $options: "i" };
    }

    const blogs = await Blog.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST create a new blog
export async function POST(req) {
  await connectToDatabase();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, tags, coverImage } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: "Title too long (max 200)" }, { status: 400 });
    }
    if (content.length > 50000) {
      return NextResponse.json({ error: "Content too long (max 50000)" }, { status: 400 });
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const blog = await Blog.create({
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image,
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim()?.slice(0, 500) || content.trim().slice(0, 200),
      content: content.trim(),
      tags: tags?.trim() || "",
      coverImage: coverImage?.trim() || "",
    });

    await logActivity(session.user.id);

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
