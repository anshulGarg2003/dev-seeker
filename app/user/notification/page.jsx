"use client";

import {
  Bell,
  BellOff,
  DoorOpen,
  UserPlus,
  Coins,
  Trash2,
  Gift,
  ArrowRight,
  CheckCheck,
  Loader2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchUserNotifications, RemoveNotification } from "./actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallContext } from "@/context/CallContext";

const NOTIFICATION_CONFIG = {
  1: {
    icon: DoorOpen,
    color: "violet",
    label: "Room Invite",
    getMessage: (n) =>
      `Your friend **${n.sendBy}** created a room **${n.data}**. Jump in and earn rewards!`,
  },
  2: {
    icon: UserPlus,
    color: "cyan",
    label: "Friend Request",
    getMessage: (n) =>
      `You have a new friend request from **${n.sendBy}**. Connect and start collaborating!`,
  },
  3: {
    icon: Coins,
    color: "amber",
    label: "Room Created",
    getMessage: (n) =>
      `"${n.data}" room has been created and your coins have been updated.`,
  },
  4: {
    icon: Coins,
    color: "emerald",
    label: "Coins Earned",
    getMessage: (n) =>
      `You earned coins for deleting the "${n.data}" room. Check your rewards!`,
  },
  5: {
    icon: Gift,
    color: "pink",
    label: "Welcome Bonus",
    getMessage: () =>
      `Welcome aboard! We've gifted you **100 coins** to get started.`,
  },
};

const colorMap = {
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    dot: "bg-violet-400",
    hover: "hover:border-violet-500/40",
    glow: "group-hover:shadow-violet-500/10",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
    hover: "hover:border-cyan-500/40",
    glow: "group-hover:shadow-cyan-500/10",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    dot: "bg-amber-400",
    hover: "hover:border-amber-500/40",
    glow: "group-hover:shadow-amber-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    hover: "hover:border-emerald-500/40",
    glow: "group-hover:shadow-emerald-500/10",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    dot: "bg-pink-400",
    hover: "hover:border-pink-500/40",
    glow: "group-hover:shadow-pink-500/10",
  },
};

function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function renderMessage(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-foreground">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { setHeaderRefresh } = useCallContext();
  const [loading, setLoading] = useState(true);
  const [dismissing, setDismissing] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetchUserNotifications();
        setLoading(false);
        if (res === false) {
          toast.error("Failed to load notifications");
          return;
        }
        // Sort newest first
        const sorted = res.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } catch (err) {
        setLoading(false);
        toast.error("Something went wrong");
      }
    };
    fetchNotifications();
  }, []);

  const handleView = async (item) => {
    setDismissing(item._id);
    try {
      await RemoveNotification(item);
      setNotifications((prev) => prev.filter((n) => n._id !== item._id));
      setHeaderRefresh((prev) => !prev);

      if (item.code === 1) {
        router.push(`/user/room/${item.usefulId}`);
      } else if (item.code === 2) {
        router.push(`/user/friends`);
      } else {
        router.push(`/user/${item.usefulId}`);
      }
    } catch (error) {
      toast.error("Error processing notification");
    } finally {
      setDismissing(null);
    }
  };

  const handleDismiss = async (e, item) => {
    e.stopPropagation();
    setDismissing(item._id);
    try {
      await RemoveNotification(item);
      setNotifications((prev) => prev.filter((n) => n._id !== item._id));
      setHeaderRefresh((prev) => !prev);
      toast.success("Notification dismissed");
    } catch (error) {
      toast.error("Failed to dismiss");
    } finally {
      setDismissing(null);
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    try {
      await Promise.all(notifications.map((n) => RemoveNotification(n)));
      setNotifications([]);
      setHeaderRefresh((prev) => !prev);
      toast.success("All notifications cleared");
    } catch {
      toast.error("Failed to clear all");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Notifications
                </h1>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : notifications.length === 0
                      ? "You're all caught up"
                      : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            {notifications.length > 1 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-400 bg-muted/30 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Clear all
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="mt-5 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border dark:border-white/5 flex items-center justify-center">
              <BellOff className="w-7 h-7 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                No notifications
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                When someone invites you or sends a request, it&apos;ll show up
                here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {notifications.map((notice) => {
              const config =
                NOTIFICATION_CONFIG[notice.code] || NOTIFICATION_CONFIG[5];
              const colors = colorMap[config.color];
              const Icon = config.icon;
              const isProcessing = dismissing === notice._id;

              return (
                <button
                  key={notice._id}
                  onClick={() => handleView(notice)}
                  disabled={isProcessing}
                  className={`group relative w-full text-left rounded-xl border ${colors.border} ${colors.hover} bg-background/50 dark:bg-[#0c0c14]/50 backdrop-blur-sm p-4 transition-all duration-200 hover:shadow-lg ${colors.glow} disabled:opacity-50`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Icon */}
                    <div
                      className={`shrink-0 w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center mt-0.5`}
                    >
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold ${colors.text}`}
                        >
                          {config.label}
                        </span>
                        <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                        {notice.createdAt && (
                          <span className="text-[11px] text-muted-foreground/60">
                            {formatRelativeTime(notice.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {renderMessage(config.getMessage(notice))}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                      ) : (
                        <>
                          <div
                            role="button"
                            onClick={(e) => handleDismiss(e, notice)}
                            className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="p-1.5 rounded-lg text-muted-foreground/40 group-hover:text-violet-400 transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Unseen dot */}
                  {!notice.isSeen && (
                    <div
                      className={`absolute top-3 right-3 w-2 h-2 rounded-full ${colors.dot} animate-pulse`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
