"use client";
import React, { useState } from "react";
import { useCallContext } from "@/context/CallContext";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import Lottie from "@/components/LottieWrapper";
import Thankyou from "@/Thankyou.json";
import { sendComplete, sendFeedback } from "./actions";
import StarRating from "./StarRating";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Send,
  MessageSquare,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const Page = () => {
  const { roomInfo, callSession, roomCreator } = useCallContext();
  const session = useSession();
  const [feedback, setFeedback] = useState("");
  const [star, setStar] = useState(0);
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSelection = (value) => {
    setSelected(value);
    if (value === "yes") {
      toast.promise(sendComplete(roomInfo), {
        loading: "Marking as solved...",
        success: "Room marked as solved!",
        error: "Could not update room status.",
      });
    }
  };

  const handleSendMessage = async () => {
    if (star === 0 && feedback === "") {
      toast.error("Please give a rating and your feedback");
      return;
    }
    if (feedback === "") {
      toast.error("Please share your feedback");
      return;
    }
    setSubmitting(true);
    try {
      await toast.promise(sendFeedback(feedback, star), {
        loading: "Sending feedback...",
        success: "Thanks for your feedback!",
        error: "Could not send feedback.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isCreator = roomCreator === session.data?.user?.id;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back */}
        <button
          onClick={() => router.push("/browse")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to rooms
        </button>

        {/* Thank you animation */}
        <div className="flex justify-center mb-2">
          <div className="w-48 h-48 sm:w-56 sm:h-56">
            <Lottie animationData={Thankyou} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Session <span className="text-gradient">Complete</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Thanks for being part of the Dev-Seeker community
          </p>
        </div>

        {/* Creator / Contributor card */}
        <div className="rounded-2xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6 mb-6">
          {isCreator ? (
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/10">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-lg font-semibold">Was your bug resolved?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelection("yes")}
                  className={`flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    selected === "yes"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10"
                      : "border-border/50 dark:border-white/[0.08] text-muted-foreground hover:border-emerald-500/20 hover:bg-emerald-500/5"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Yes, solved!
                </button>
                <button
                  type="button"
                  onClick={() => handleSelection("no")}
                  className={`flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    selected === "no"
                      ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 shadow-sm shadow-red-500/10"
                      : "border-border/50 dark:border-white/[0.08] text-muted-foreground hover:border-red-500/20 hover:bg-red-500/5"
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  Not yet
                </button>
              </div>
              {selected === "yes" && (
                <p className="text-xs text-emerald-500 text-center font-medium animate-in fade-in">
                  Great! Room has been marked as completed.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Coins className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="text-lg font-semibold">Contribution Summary</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/10">
                  <Clock className="w-4 h-4 text-violet-400 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Time spent</p>
                    <p className="text-sm font-bold font-mono">
                      {callSession ? `${callSession.toFixed(1)} min` : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10">
                  <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reward</p>
                    <p className="text-sm font-bold font-mono text-emerald-500">
                      Coins credited
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Every contribution counts — thanks for helping out!
              </p>
            </div>
          )}
        </div>

        {/* Rating section */}
        <div className="rounded-2xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm p-6 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold">Rate this session</h2>
            <p className="text-xs text-muted-foreground">
              Your feedback helps improve the experience for everyone
            </p>
          </div>

          <StarRating changeRating={setStar} />

          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Your Feedback
            </label>
            <Textarea
              placeholder="What went well? What could be improved? Share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => router.push("/browse")}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-all"
            >
              Skip
            </button>
            <button
              onClick={handleSendMessage}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
