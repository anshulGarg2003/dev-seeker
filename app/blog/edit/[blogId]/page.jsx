"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PenTool, ArrowRight, Eye, Loader2, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import toast from "react-hot-toast";

export default function EditBlogPage({ params }) {
  const { blogId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max file size is 5MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCoverImage(data.url);
        toast.success("Image uploaded!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.userId?.toString() !== session?.user?.id) {
            toast.error("Not authorized");
            router.push("/blog");
            return;
          }
          setTitle(data.title || "");
          setContent(data.content || "");
          setExcerpt(data.excerpt || "");
          setTags(data.tags || "");
          setCoverImage(data.coverImage || "");
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

    if (status === "authenticated") {
      fetchBlog();
    } else if (status === "unauthenticated") {
      router.push("/blog");
    }
  }, [blogId, session, status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");

    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          tags: tags.trim(),
          coverImage: coverImage.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Blog updated!");
        router.push(`/blog/${blogId}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Lottie loop={true} animationData={Loading} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto flex flex-col gap-8 max-w-3xl px-6 py-14">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-widest">
              <PenTool className="w-3.5 h-3.5" />
              edit
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              Edit <span className="text-gradient">Blog</span>
            </h1>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreview(!preview)}
            className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-4 hover:border-violet-500/30 hover:text-violet-500 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> {preview ? "Edit" : "Preview"}
          </Button>
        </div>

        {preview ? (
          <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground mb-4">{title || "Untitled"}</h2>
            {excerpt && <p className="text-muted-foreground italic mb-6 border-l-2 border-violet-500 pl-4">{excerpt}</p>}
            <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap break-words">
              {content || "No content yet..."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="Blog title..."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Excerpt</label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="A short summary..."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Content *</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={50000}
                rows={16}
                placeholder="Write your content here..."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground text-right">{content.length}/50000</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Tags</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. react, nextjs"
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Cover Image</label>

              <div className="flex items-center gap-3">
                <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border dark:border-white/10 bg-background/50 dark:bg-white/[0.03] hover:border-violet-500/40 hover:bg-violet-500/[0.03] transition-colors cursor-pointer text-sm font-medium text-muted-foreground ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageUp className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <span className="text-xs text-muted-foreground">or paste a URL below</span>
              </div>

              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.png"
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 font-mono text-sm"
              />

              {coverImage && (
                <div className="relative mt-2 rounded-xl overflow-hidden border border-border dark:border-white/5 h-40">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-bold hover:bg-black/80 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-600/20 border-0 py-3 text-base group"
            >
              {submitting ? "Saving..." : "Save Changes"} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
