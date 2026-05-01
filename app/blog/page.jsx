"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Terminal, PenTool, Heart, Eye, Clock, Search, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import toast from "react-hot-toast";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function BlogPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTag, setSearchTag] = useState("");

  const fetchBlogs = async (tag = "") => {
    setLoading(true);
    try {
      const url = tag ? `/api/blog?tag=${encodeURIComponent(tag)}` : "/api/blog";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs(searchTag.trim());
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative py-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-violet-600/15 dark:bg-violet-600/8 blur-[120px] animate-pulse-slow pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/8 blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-widest">
                <PenTool className="w-3.5 h-3.5" />
                dev blogs
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
                Community <span className="text-gradient">Blogs</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-lg font-light">
                Knowledge shared by developers. Tips, tutorials, war stories, and debugging tales.
              </p>
            </div>

            {session && (
              <div className="flex-shrink-0">
                <Link
                  href="/blog/create"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] animate-gradient-x text-white font-bold shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-500"
                >
                  <PenTool className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Write a Blog
                </Link>
              </div>
            )}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-10 p-5 rounded-2xl bg-card/60 dark:bg-white/[0.02] backdrop-blur-md border border-border dark:border-white/5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  placeholder="Search by tag (e.g. react, nextjs, mongodb)..."
                  className="pl-10 rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 font-mono text-sm"
                />
              </div>
              <Button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold px-6 border-0">
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="relative px-6 lg:px-8 pb-20">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Lottie loop={true} animationData={Loading} />
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20">
              <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-12 text-center">
                <PenTool className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-xl font-bold text-foreground mb-2">No blogs yet</p>
                <p className="text-muted-foreground font-light">
                  {searchTag ? `No blogs found for "${searchTag}". Try a different tag.` : "Be the first to share your knowledge!"}
                </p>
                {session && !searchTag && (
                  <Link
                    href="/blog/create"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-600/20 hover:scale-[1.02] transition-transform"
                  >
                    <PenTool className="w-4 h-4" /> Write a Blog
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function BlogCard({ blog }) {
  const tags = blog.tags ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <Link href={`/blog/${blog._id}`} className="group block">
      <div className="card-3d border-glow h-full rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-600/5">
        {/* Cover Image or Gradient */}
        {blog.coverImage ? (
          <div className="relative h-44 overflow-hidden">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-cyan-500/10 relative">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute bottom-3 left-4">
              <Terminal className="w-6 h-6 text-violet-400/60" />
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Author Row */}
          <div className="flex items-center gap-2.5 mb-3">
            <Image src={blog.userImage} alt={blog.userName} width={28} height={28} className="rounded-full ring-1 ring-border" />
            <span className="text-xs font-medium text-muted-foreground">{blog.userName}</span>
            <span className="text-xs text-muted-foreground/50">·</span>
            <span className="text-xs text-muted-foreground/70 font-mono">{timeAgo(blog.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-violet-500 transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 font-light leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-300 text-[10px] font-mono uppercase tracking-wider border border-violet-400/10">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50 dark:border-white/5">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {blog.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {blog.views || 0}
              </span>
            </div>
            <span className="text-xs font-bold text-violet-500 flex items-center gap-1 group-hover:gap-2 transition-all">
              Read <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
