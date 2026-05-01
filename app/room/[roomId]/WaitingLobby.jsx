"use client";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  Loader2,
  ArrowLeft,
  Radio,
  Fingerprint,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Lottie from "@/components/LottieWrapper";
import Waiting from "@/Waiting.json";

const STATUS_MESSAGES = {
  idle: "Request access to enter this room",
  pending: "Waiting for the host to admit you...",
  rejected: "Your request was declined by the host",
};

export default function WaitingLobby({ room, roomId, session, onAdmitted }) {
  const [status, setStatus] = useState("idle"); // idle | pending | rejected | loading
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const pollRef = useRef(null);

  // Check if there's already a pending/approved request
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const checkExisting = async () => {
      try {
        const res = await fetch(`/api/room/${roomId}/join-request`, {
          signal: controller.signal,
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.request?.status === "approved") {
            onAdmitted();
            return;
          }
          if (data.request?.status === "pending") {
            setStatus("pending");
          }
          if (data.request?.status === "rejected") {
            setStatus("rejected");
          }
        }
      } catch (e) {
        if (e.name !== "AbortError") console.error("Check existing error:", e);
      }
    };
    checkExisting();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [roomId]);

  // Poll for status updates when pending (5s interval with AbortController)
  useEffect(() => {
    if (status !== "pending") {
      if (pollRef.current) clearInterval(pollRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let cancelled = false;
    setElapsed(0);
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    pollRef.current = setInterval(async () => {
      if (cancelled) return;
      const controller = new AbortController();
      // Auto-timeout each poll request after 8 seconds
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(`/api/room/${roomId}/join-request`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.request?.status === "approved") {
            onAdmitted();
          } else if (data.request?.status === "rejected") {
            setStatus("rejected");
          }
        }
      } catch (e) {
        clearTimeout(timeout);
        if (e.name !== "AbortError") console.error("Poll error:", e);
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
      clearInterval(intervalRef.current);
    };
  }, [status, roomId]);

  const handleRequestJoin = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/room/${roomId}/join-request`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "approved") {
          onAdmitted();
        } else {
          setStatus("pending");
        }
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.05] via-transparent to-cyan-500/[0.05] pointer-events-none" />

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-violet-500/10 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-fuchsia-500/10 animate-pulse-slow [animation-delay:1s]" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/10 animate-pulse-slow [animation-delay:2s]" />
      </div>

      {/* Main card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="rounded-3xl border border-border dark:border-white/[0.06] bg-background/80 dark:bg-[#0c0c14]/80 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Top gradient strip */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500" />

          <div className="p-8 sm:p-10 space-y-8">
            {/* Security badge */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20">
                  {status === "pending" ? (
                    <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
                  ) : status === "rejected" ? (
                    <ShieldX className="w-10 h-10 text-red-400" />
                  ) : (
                    <Shield className="w-10 h-10 text-violet-400" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500 animate-ping" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500" />
              </div>
            </div>

            {/* Room info */}
            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                {room?.name || "Room Lobby"}
              </h1>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {STATUS_MESSAGES[status] || STATUS_MESSAGES.idle}
              </p>
            </div>

            {/* Host info */}
            <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-muted/30 dark:bg-white/[0.03] border border-border dark:border-white/5">
              <Avatar className="h-10 w-10 ring-2 ring-violet-500/30">
                <AvatarImage src={room?.userProfile} />
                <AvatarFallback className="bg-violet-500/10 text-violet-400 text-sm font-bold">
                  {room?.userName?.slice(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  {room?.userName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  Room Host
                </p>
              </div>
            </div>

            {/* Waiting animation + timer (when pending) */}
            {status === "pending" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48">
                    <Lottie animationData={Waiting} />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="font-mono">{formatTime(elapsed)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Fingerprint className="w-4 h-4 text-violet-400" />
                    <span>Verified identity</span>
                  </div>
                </div>

                {/* Pulsing dots */}
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"
                      style={{ animationDelay: `${i * 300}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected state */}
            {status === "rejected" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                  <p className="text-sm text-red-400 font-medium">
                    The host has declined your join request. You can try requesting again.
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3">
              {status === "idle" && (
                <button
                  onClick={handleRequestJoin}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Request to Join
                </button>
              )}

              {status === "loading" && (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600/60 to-fuchsia-600/60 text-white/80 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending request...
                </button>
              )}

              {status === "rejected" && (
                <button
                  onClick={handleRetry}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Request Again
                </button>
              )}

              <Link
                href="/browse"
                className="w-full py-3 rounded-2xl border border-border dark:border-white/10 text-muted-foreground font-semibold text-sm hover:text-foreground hover:border-violet-500/30 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Browse
              </Link>
            </div>

            {/* Security footer */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <p className="text-xs text-muted-foreground">
                Protected room — host approval required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
