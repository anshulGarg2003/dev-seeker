"use client";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  Check,
  X,
  Loader2,
  Bell,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdmitPanel({ roomId }) {
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomId}/join-request`);
      if (res.ok) {
        const data = await res.json();
        if (data.role === "creator" && data.requests) {
          setRequests(data.requests);
        }
      }
    } catch {}
  }, [roomId]);

  // Poll every 4 seconds
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 4000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleAction = async (requestId, action, userName) => {
    setActionLoading(`${action}-${requestId}`);
    try {
      const res = await fetch(`/api/room/${roomId}/join-request`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (res.ok) {
        toast.success(
          action === "approve"
            ? `${userName} has been admitted`
            : `${userName}'s request declined`
        );
        fetchRequests();
      } else {
        toast.error("Failed to update request");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80 animate-in slide-in-from-right-5">
      <div className="rounded-2xl border border-amber-500/20 bg-background/95 dark:bg-[#0c0c14]/95 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <UserPlus className="w-4 h-4 text-amber-400" />
              </div>
              {/* Badge */}
              <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {requests.length}
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                Join Requests
              </p>
              <p className="text-xs text-muted-foreground">
                {requests.length} waiting for approval
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Request list */}
        {expanded && (
          <div className="border-t border-border dark:border-white/5 max-h-72 overflow-y-auto">
            {requests.map((req) => (
              <div
                key={req._id}
                className="flex items-center justify-between p-3 px-4 border-b border-border/50 dark:border-white/[0.03] last:border-0 hover:bg-muted/20 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border dark:ring-white/10">
                    <AvatarImage src={req.userImage} />
                    <AvatarFallback className="bg-violet-500/10 text-violet-400 text-xs font-bold">
                      {req.userName?.slice(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {req.userName}
                    </p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" />
                      Requesting access
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() =>
                      handleAction(req._id, "approve", req.userName)
                    }
                    disabled={actionLoading === `approve-${req._id}`}
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all disabled:opacity-50"
                    title="Admit"
                  >
                    {actionLoading === `approve-${req._id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleAction(req._id, "reject", req.userName)
                    }
                    disabled={actionLoading === `reject-${req._id}`}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all disabled:opacity-50"
                    title="Decline"
                  >
                    {actionLoading === `reject-${req._id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer hint */}
        {expanded && (
          <div className="px-4 py-2.5 border-t border-border dark:border-white/5 bg-muted/20 dark:bg-white/[0.01]">
            <p className="text-[10px] text-muted-foreground text-center">
              Only admitted users can join the video call
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
