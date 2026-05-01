"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Heart,
  Reply,
  Trash2,
  ArrowLeft,
  Terminal,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

function timeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now - then) / 1000);

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

// ── Reply Component ──
function ReplyItem({ reply, currentUserId }) {
  return (
    <div className="flex gap-3 py-3">
      <Link href={`/user/${reply.userId}`}>
        <Avatar className="w-6 h-6 ring-1 ring-violet-500/20 flex-shrink-0">
          <AvatarImage src={reply.userImage} />
          <AvatarFallback className="text-[10px]">
            {reply.userName?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/user/${reply.userId}`}
            className="text-xs font-semibold text-foreground hover:text-violet-500 transition-colors"
          >
            {reply.userName}
          </Link>
          <span className="text-[10px] text-muted-foreground font-mono">
            {timeAgo(reply.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap break-words">
          {reply.content}
        </p>
      </div>
    </div>
  );
}

// ── Comment Component ──
function CommentItem({
  comment,
  currentUserId,
  roomId,
  onDelete,
  onLike,
  onReplyAdded,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const hasLiked = comment.likes?.some(
    (id) => id.toString() === currentUserId
  );
  const likeCount = comment.likes?.length || 0;
  const replyCount = comment.replies?.length || 0;

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(
        `/api/room/${roomId}/discussion/${comment._id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: replyContent }),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        onReplyAdded(comment._id, updated);
        setReplyContent("");
        setShowReplyForm(false);
        setShowReplies(true);
        toast.success("Reply added");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to reply");
      }
    } catch {
      toast.error("Failed to reply");
    }
    setSubmittingReply(false);
  };

  return (
    <div className="group/comment rounded-xl border border-border dark:border-white/5 bg-card/60 dark:bg-white/[0.015] backdrop-blur-sm p-5 transition-all duration-300 hover:border-violet-500/20">
      {/* Author row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Link href={`/user/${comment.userId}`}>
            <Avatar className="w-8 h-8 ring-2 ring-violet-500/20 flex-shrink-0 mt-0.5">
              <AvatarImage src={comment.userImage} />
              <AvatarFallback className="text-xs">
                {comment.userName?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/user/${comment.userId}`}
                className="text-sm font-semibold text-foreground hover:text-violet-500 transition-colors"
              >
                {comment.userName}
              </Link>
              <span className="text-[11px] text-muted-foreground font-mono">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground/90 mt-2 whitespace-pre-wrap break-words leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>

        {/* Delete */}
        {currentUserId === comment.userId?.toString() && (
          <button
            onClick={() => onDelete(comment._id)}
            className="p-1.5 rounded-lg opacity-0 group-hover/comment:opacity-100 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 mt-3 ml-11">
        <button
          onClick={() => onLike(comment._id)}
          className={`flex items-center gap-1 text-xs transition-colors ${
            hasLiked
              ? "text-rose-500"
              : "text-muted-foreground hover:text-rose-500"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`}
          />
          {likeCount > 0 && <span className="font-mono">{likeCount}</span>}
        </button>

        <button
          onClick={() => {
            setShowReplyForm(!showReplyForm);
            if (!showReplyForm) setShowReplies(true);
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-violet-500 transition-colors"
        >
          <Reply className="w-3.5 h-3.5" />
          Reply
        </button>

        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-500 transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && replyCount > 0 && (
        <div className="ml-11 mt-2 pl-4 border-l-2 border-violet-500/10">
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <div className="ml-11 mt-3 flex gap-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            maxLength={2000}
            className="flex-1 rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none text-sm"
          />
          <Button
            onClick={handleReply}
            disabled={!replyContent.trim() || submittingReply}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 self-end px-3"
          >
            {submittingReply ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function DiscussionPage({ params }) {
  const { roomId } = params;
  const { data: session } = useSession();
  const router = useRouter();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);

  const fetchDiscussions = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomId}/discussion`);
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data);
      }
    } catch {
      console.error("Failed to fetch discussions");
    }
    setLoading(false);
  }, [roomId]);

  const fetchRoomInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setRoomInfo(data);
      }
    } catch {
      console.error("Failed to fetch room info");
    }
  }, [roomId]);

  useEffect(() => {
    fetchDiscussions();
    fetchRoomInfo();
  }, [fetchDiscussions, fetchRoomInfo]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    if (!session) {
      toast.error("Please login to comment");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/room/${roomId}/discussion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiscussions((prev) => [data, ...prev]);
        setNewComment("");
        toast.success("Comment posted");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to post");
      }
    } catch {
      toast.error("Failed to post comment");
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(
        `/api/room/${roomId}/discussion/${commentId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setDiscussions((prev) => prev.filter((d) => d._id !== commentId));
        toast.success("Comment deleted");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleLike = async (commentId) => {
    if (!session) {
      toast.error("Please login to like");
      return;
    }
    try {
      const res = await fetch(
        `/api/room/${roomId}/discussion/${commentId}`,
        { method: "PATCH" }
      );
      if (res.ok) {
        const updated = await res.json();
        setDiscussions((prev) =>
          prev.map((d) => (d._id === commentId ? updated : d))
        );
      }
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleReplyAdded = (commentId, updatedComment) => {
    setDiscussions((prev) =>
      prev.map((d) => (d._id === commentId ? updatedComment : d))
    );
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative py-12 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[350px] h-[350px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href={`/room/${roomId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-violet-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Room
          </Link>

          {/* Title */}
          <div className="flex items-start gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-600/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-widest">
                <Terminal className="w-3 h-3" />
                discussion
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-foreground">
                {roomInfo ? (
                  <>
                    <span className="text-gradient">{roomInfo.name}</span>
                  </>
                ) : (
                  "Loading..."
                )}
              </h1>
              {roomInfo && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {roomInfo.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 ml-14 mt-3">
            <span className="text-xs text-muted-foreground font-mono">
              <span className="text-foreground font-bold">
                {discussions.length}
              </span>{" "}
              {discussions.length === 1 ? "comment" : "comments"}
            </span>
            {roomInfo?.userName && (
              <span className="text-xs text-muted-foreground">
                by{" "}
                <Link
                  href={`/user/${roomInfo.userId}`}
                  className="text-violet-500 hover:underline"
                >
                  {roomInfo.userName}
                </Link>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="relative px-6 lg:px-8 pb-20">
        <div className="absolute inset-0 bg-dots opacity-15 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl">
          {/* ── New Comment Form ── */}
          {session ? (
            <div className="rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-5 mb-8">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 ring-2 ring-violet-500/20 flex-shrink-0 mt-1">
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback className="text-xs">
                    {session.user.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share a solution, ask a question, or discuss the bug..."
                    rows={3}
                    maxLength={5000}
                    className="w-full rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none text-sm"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {newComment.length}/5000
                    </span>
                    <Button
                      onClick={handlePost}
                      disabled={!newComment.trim() || submitting}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-violet-600/20 font-bold px-5 group"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Send className="w-4 h-4 mr-1 group-hover:translate-x-0.5 transition-transform" />
                      )}
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-6 mb-8 text-center">
              <p className="text-muted-foreground text-sm">
                Sign in to join the discussion
              </p>
            </div>
          )}

          {/* ── Comments List ── */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
          ) : discussions.length === 0 ? (
            <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-bold text-foreground mb-1">
                No discussions yet
              </p>
              <p className="text-sm text-muted-foreground">
                Be the first to start the conversation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={session?.user?.id}
                  roomId={roomId}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onReplyAdded={handleReplyAdded}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
