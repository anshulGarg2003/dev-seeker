"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Eye, Clock, Trash2, PenTool, Terminal, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import toast from "react-hot-toast";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogViewPage({ params }) {
  const { blogId } = params;
  const { data: session } = useSession();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          toast.error("Blog not found");
          router.push("/blog");
        }
      } catch {
        toast.error("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId, router]);

  const handleLike = async () => {
    if (!session) {
      toast.error("Login to like");
      return;
    }
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
      if (res.ok) {
        const data = await res.json();
        setBlog((prev) => ({ ...prev, likes: data.likes }));
      }
    } catch {
      toast.error("Failed to like");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/blog/${blogId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted");
        router.push("/blog");
      } else {
        toast.error("Failed to delete blog");
      }
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie loop={true} animationData={Loading} />
      </div>
    );
  }

  if (!blog) return null;

  const isAuthor = session?.user?.id === blog.userId?.toString();
  const hasLiked = blog.likes?.some((id) => id.toString() === session?.user?.id);
  const tags = blog.tags ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />

        {blog.coverImage ? (
          <div className="relative h-64 sm:h-80">
            <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-violet-600/15 via-fuchsia-600/10 to-cyan-500/5" />
        )}
      </section>

      {/* Content */}
      <article className="relative z-10 mx-auto max-w-3xl px-6 -mt-16">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-violet-500 transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> All Blogs
        </Link>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-wider border border-violet-400/10">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-foreground leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author + Meta Row */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border/50 dark:border-white/5">
          <Link href={`/user/${blog.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src={blog.userImage} alt={blog.userName} width={40} height={40} className="rounded-full ring-2 ring-violet-500/20" />
            <div>
              <p className="text-sm font-bold text-foreground">{blog.userName}</p>
              <p className="text-xs text-muted-foreground font-mono">{formatDate(blog.createdAt)}</p>
            </div>
          </Link>

          <div className="flex items-center gap-4 ml-auto text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> {blog.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} /> {blog.likes?.length || 0}
            </span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none mb-12 leading-relaxed text-foreground/90 whitespace-pre-wrap break-words">
          {blog.content}
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3 py-6 border-t border-border/50 dark:border-white/5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={likeLoading}
            className={`rounded-xl border-border dark:border-white/10 text-xs font-bold px-4 transition-colors ${
              hasLiked
                ? "border-rose-500/30 text-rose-500 bg-rose-500/5"
                : "hover:border-violet-500/30 hover:text-violet-500"
            }`}
          >
            {likeLoading ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Heart className={`w-3.5 h-3.5 mr-1 ${hasLiked ? "fill-rose-500" : ""}`} />
            )}
            {hasLiked ? "Liked" : "Like"} ({blog.likes?.length || 0})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-4 hover:border-violet-500/30 hover:text-violet-500 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 mr-1" /> Share
          </Button>

          {isAuthor && (
            <>
              <Link href={`/blog/edit/${blog._id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-4 hover:border-cyan-500/30 hover:text-cyan-500 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-4 hover:border-rose-500/30 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this blog?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your blog post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </article>
    </div>
  );
}
