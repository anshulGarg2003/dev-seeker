"use client";
import TagList from "@/components/tag-list";
import { Github, MessageSquare, Shield, Users, Clock, Zap, LogIn } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import VideoCall from "./VideoPlayer";
import WaitingLobby from "./WaitingLobby";
import { splitTags } from "@/lib/utils";
import { OnAir } from "./action";
import { useSession, signIn } from "next-auth/react";

const Page = (props) => {
  const { data: session, status } = useSession();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admitted, setAdmitted] = useState(false);
  const { roomId } = props.params;

  const isCreator = room && session?.user?.id === room.userId?.toString();

  // Only fetch room data on mount
  useEffect(() => {
    let mounted = true;

    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        const response = await fetch(`/api/room/${roomId}`);
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            setRoom(data);
            setLoading(false);
          }
        } else {
          console.error("Failed to fetch room");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    };

    fetchRoom();
    return () => { mounted = false; };
  }, [roomId]);

  // Only call OnAir when user actually enters the call (creator or admitted)
  const inCall = isCreator || admitted;

  // Reliable cleanup (works even if tab is killed / browser crashes)
  const sendOfflineBeacon = useCallback(() => {
    try {
      // fetch with keepalive survives page unload and supports PATCH
      fetch(`/api/room/${roomId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLive: false }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Silently fail — best effort
    }
  }, [roomId]);

  useEffect(() => {
    if (!inCall) return;

    const onAirTrue = async () => {
      try {
        await OnAir(roomId, true);
      } catch (error) {
        console.error("Failed to call OnAir with true:", error);
      }
    };
    onAirTrue();

    return () => {
      // Try server action first, beacon as fallback
      OnAir(roomId, false).catch(() => sendOfflineBeacon());
    };
  }, [roomId, inCall, sendOfflineBeacon]);

  // beforeunload — use sendBeacon (async fetch is unreliable here)
  useEffect(() => {
    if (!inCall) return;

    const handleBeforeUnload = () => {
      sendOfflineBeacon();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [roomId, inCall, sendOfflineBeacon]);

  // Network offline detection
  useEffect(() => {
    if (!inCall) return;

    const handleOffline = () => {
      console.warn("Network offline — marking room as not live");
      OnAir(roomId, false).catch(() => {});
    };

    const handleOnline = () => {
      console.log("Network back online — marking room as live");
      OnAir(roomId, true).catch(() => {});
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [roomId, inCall]);

  // Page visibility — mark offline when tab is hidden for too long
  useEffect(() => {
    if (!inCall) return;
    let hiddenTimeout;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // If hidden for more than 30s, mark as not live
        hiddenTimeout = setTimeout(() => {
          OnAir(roomId, false).catch(() => {});
        }, 30000);
      } else {
        clearTimeout(hiddenTimeout);
        OnAir(roomId, true).catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearTimeout(hiddenTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [roomId, inCall]);

  // Callbacks from VideoPlayer
  const handleConnectionLost = useCallback(() => {
    OnAir(roomId, false).catch(() => sendOfflineBeacon());
  }, [roomId, sendOfflineBeacon]);

  const handleConnectionRestored = useCallback(() => {
    OnAir(roomId, true).catch(() => {});
  }, [roomId]);

  // Show loading
  if (loading || !room || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading room...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → prompt sign in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm text-center p-8 rounded-2xl border border-border dark:border-white/[0.06] bg-background/80 dark:bg-[#0c0c14]/80 backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <LogIn className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">Sign in required</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You need to be signed in to join a room. Sign in with your account to start collaborating.
            </p>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: `/room/${roomId}` })}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Google
          </button>
          <Link
            href="/browse"
            className="text-xs text-muted-foreground hover:text-violet-400 transition-colors"
          >
            or browse rooms first
          </Link>
        </div>
      </div>
    );
  }

  // Non-creator and not admitted → show lobby
  if (!isCreator && !admitted) {
    return (
      <WaitingLobby
        room={room}
        roomId={roomId}
        session={session}
        onAdmitted={() => setAdmitted(true)}
      />
    );
  }

  // Creator or admitted user → show the room
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 min-h-screen gap-0">
        {/* Video area */}
        <div className="lg:col-span-3 p-3">
          <div className="rounded-2xl border border-border dark:border-white/[0.06] bg-background/50 dark:bg-[#0c0c14]/50 overflow-hidden h-full">
            <VideoCall roomInfo={roomId} isCreator={isCreator} onConnectionLost={handleConnectionLost} onConnectionRestored={handleConnectionRestored} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 p-3 pl-0">
          <div className="rounded-2xl border border-border dark:border-white/[0.06] bg-background/80 dark:bg-[#0c0c14]/80 backdrop-blur-xl p-5 flex flex-col gap-5 h-full">
            {/* Room title */}
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-foreground leading-tight">
                {room.name}
              </h1>
              {room.category && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-semibold">
                  <Zap className="w-3 h-3" />
                  {room.category}
                </span>
              )}
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2">
              {room.difficulty && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  room.difficulty === "easy"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : room.difficulty === "hard"
                      ? "bg-red-500/10 text-red-400 border-red-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}>
                  {room.difficulty}
                </span>
              )}
              {room.estimatedTime && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {room.estimatedTime}
                </span>
              )}
            </div>

            {/* GitHub */}
            {room.githubrepo && (
              <Link
                href={room.githubrepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border dark:border-white/5 bg-muted/30 dark:bg-white/[0.02] text-sm text-muted-foreground hover:text-violet-400 hover:border-violet-500/30 transition-all group truncate"
              >
                <Github className="w-4 h-4 shrink-0 group-hover:text-violet-400 transition-colors" />
                <span className="truncate">{room.githubrepo}</span>
              </Link>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {room.description}
            </p>

            {/* Tags */}
            <TagList tags={splitTags(room.language)} />

            {/* Divider */}
            <div className="border-t border-border dark:border-white/5" />

            {/* Security badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-400/80 font-medium">
                {isCreator
                  ? "You control who can join this room"
                  : "Admitted by host"}
              </p>
            </div>

            {/* Discussion link */}
            <Link
              href={`/room/${roomId}/discussion`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border dark:border-white/10 bg-card/60 dark:bg-white/[0.02] text-sm font-semibold text-muted-foreground hover:text-violet-400 hover:border-violet-500/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              Discussion Forum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
