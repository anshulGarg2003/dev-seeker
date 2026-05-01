"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Terminal, PenTool, ArrowRight, Eye, ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/blog");
    return null;
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");
    if (content.trim().length < 50) return toast.error("Content should be at least 50 characters");

    setSubmitting(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          tags: tags.trim(),
          coverImage: coverImage.trim() || undefined,
        }),
      });

      if (res.ok) {
        const blog = await res.json();
        toast.success("Blog published!");
        router.push(`/blog/${blog._id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
              write
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              New <span className="text-gradient">Blog</span>
            </h1>
            <p className="mt-3 text-muted-foreground font-light">
              Share your knowledge with the developer community.
            </p>
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
            {tags && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 text-[10px] font-mono uppercase border border-violet-400/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap break-words">
              {content || "No content yet..."}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="An eye-catching title for your blog..."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/200</p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Excerpt <span className="text-muted-foreground font-normal">(optional — shown on cards)</span></label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="A short summary of your blog..."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Content *</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={50000}
                rows={16}
                placeholder="Write your blog content here... Share tips, tutorials, debugging stories, or anything useful for fellow devs."
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-muted-foreground text-right">{content.length}/50000</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. react, nextjs, debugging, mongodb"
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 font-mono text-sm"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Cover Image <span className="text-muted-foreground font-normal">(optional)</span></label>
              
              {/* Upload button */}
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

              {/* URL input */}
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://example.com/my-image.png"
                className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 font-mono text-sm"
              />

              {/* Preview */}
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-600/20 border-0 py-3 text-base group"
            >
              {submitting ? "Publishing..." : "Publish Blog"} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
