"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Accept, Decline, FetchFriends, RemoveRequest } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Users,
  UserPlus,
  Send,
  Check,
  X,
  Trash2,
  Loader2,
  Search,
  UserRoundSearch,
  Inbox,
  ArrowUpRight,
} from "lucide-react";

const tabs = [
  { id: "friends", label: "Friends", icon: Users },
  { id: "requests", label: "Requests", icon: UserPlus },
  { id: "sent", label: "Sent", icon: Send },
];

/* ─── Skeleton pulse card ─── */
const SkeletonCard = () => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-border dark:border-white/5 bg-background/40 dark:bg-white/[0.02] animate-pulse">
    <div className="h-14 w-14 rounded-full bg-muted dark:bg-white/10 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-32 rounded-lg bg-muted dark:bg-white/10" />
      <div className="h-3 w-20 rounded-lg bg-muted dark:bg-white/10" />
    </div>
  </div>
);

/* ─── Empty state ─── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="p-5 rounded-2xl bg-violet-500/[0.06] border border-violet-500/10">
      <Icon className="w-10 h-10 text-violet-400" />
    </div>
    <p className="text-lg font-semibold text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground max-w-xs text-center">{subtitle}</p>
  </div>
);

/* ─── Person card (friend / request / sent) ─── */
const PersonCard = ({ item, actions }) => (
  <div className="group relative flex items-center justify-between gap-4 p-4 rounded-2xl border border-border dark:border-white/5 bg-background/50 dark:bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/[0.03] transition-all duration-300">
    <Link
      href={`/user/${item.friendId}`}
      className="flex items-center gap-4 flex-1 min-w-0"
    >
      <div className="relative shrink-0">
        <Avatar className="h-14 w-14 ring-2 ring-border dark:ring-white/10 group-hover:ring-violet-500/40 transition-all">
          <AvatarImage src={item.friendimage} />
          <AvatarFallback className="bg-violet-500/10 text-violet-400 font-bold text-lg">
            {item.friendname?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background dark:border-[#0a0a0f] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-foreground group-hover:text-violet-400 transition-colors truncate">
          {item.friendname}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          View profile <ArrowUpRight className="w-3 h-3" />
        </p>
      </div>
    </Link>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);

/* ─── Action button ─── */
const ActionBtn = ({ icon: Icon, label, variant = "default", loading, onClick }) => {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    accept:
      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40",
    decline:
      "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
    remove:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40",
    default:
      "bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-500/40",
  };

  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${variants[variant]}`}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

const Page = () => {
  const session = useSession();
  const [activeTab, setActiveTab] = useState("friends");
  const [friendList, setFriendList] = useState([]);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [sendRequests, setSendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await FetchFriends();
      setFriendRequestList(res.requests);
      setFriendList(res.friends);
      setSendRequests(res.sendrequest);
    } catch (error) {
      console.error("Error fetching friends data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const withAction = async (id, fn) => {
    setActionLoading(id);
    try {
      await fn();
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = (item) =>
    withAction(`accept-${item.friendId}`, async () => {
      const res = await Accept(item);
      res ? (toast.success("Request accepted!"), fetchAllData()) : toast.error("Failed to accept");
    });

  const handleDecline = (item) =>
    withAction(`decline-${item.friendId}`, async () => {
      const res = await Decline(item);
      res ? (toast.success("Request declined"), fetchAllData()) : toast.error("Failed to decline");
    });

  const handleRemove = (item) =>
    withAction(`remove-${item.friendId}`, async () => {
      const res = await RemoveRequest(item);
      res ? (toast.success("Request removed"), fetchAllData()) : toast.error("Failed to remove");
    });

  /* search filter */
  const filterList = (list) =>
    search.trim()
      ? list.filter((i) => i.friendname?.toLowerCase().includes(search.toLowerCase()))
      : list;

  const filteredFriends = filterList(friendList);
  const filteredRequests = filterList(friendRequestList);
  const filteredSent = filterList(sendRequests);

  const currentList =
    activeTab === "friends"
      ? filteredFriends
      : activeTab === "requests"
        ? filteredRequests
        : filteredSent;

  return (
    <div className="relative min-h-screen">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] via-transparent to-fuchsia-500/[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* ─── Header ─── */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Friends
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage connections &amp; collaborate faster
              </p>
            </div>
          </div>
        </div>

        {/* ─── Stats row ─── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Friends", count: friendList.length, color: "violet" },
            { label: "Requests", count: friendRequestList.length, color: "emerald" },
            { label: "Sent", count: sendRequests.length, color: "amber" },
          ].map((s) => (
            <div
              key={s.label}
              className={`relative overflow-hidden rounded-2xl border border-border dark:border-white/5 bg-background/50 dark:bg-white/[0.02] p-4 text-center`}
            >
              <div className={`absolute inset-0 bg-${s.color}-500/[0.04] pointer-events-none`} />
              <p className="relative text-3xl font-bold text-foreground">
                {loading ? "—" : s.count}
              </p>
              <p className="relative text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Tabs + Search ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-1 p-1 rounded-2xl border border-border dark:border-white/5 bg-background/50 dark:bg-white/[0.02]">
            {tabs.map((tab) => {
              const count =
                tab.id === "friends"
                  ? friendList.length
                  : tab.id === "requests"
                    ? friendRequestList.length
                    : sendRequests.length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {!loading && count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-violet-500/10 text-violet-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:w-auto sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 dark:bg-white/[0.03] border border-border dark:border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : currentList.length === 0 ? (
            activeTab === "friends" ? (
              <EmptyState
                icon={UserRoundSearch}
                title="No friends yet"
                subtitle="Browse rooms and collaborate to make connections. Friends help you solve problems faster!"
              />
            ) : activeTab === "requests" ? (
              <EmptyState
                icon={Inbox}
                title="No pending requests"
                subtitle="When someone sends you a friend request, it will appear here."
              />
            ) : (
              <EmptyState
                icon={Send}
                title="No sent requests"
                subtitle="Visit a user's profile and send them a friend request to get started."
              />
            )
          ) : (
            currentList.map((item) => (
              <PersonCard
                key={item.friendId}
                item={item}
                actions={
                  activeTab === "requests" ? (
                    <>
                      <ActionBtn
                        icon={Check}
                        label="Accept"
                        variant="accept"
                        loading={actionLoading === `accept-${item.friendId}`}
                        onClick={() => handleAccept(item)}
                      />
                      <ActionBtn
                        icon={X}
                        label="Decline"
                        variant="decline"
                        loading={actionLoading === `decline-${item.friendId}`}
                        onClick={() => handleDecline(item)}
                      />
                    </>
                  ) : activeTab === "sent" ? (
                    <ActionBtn
                      icon={Trash2}
                      label="Cancel"
                      variant="remove"
                      loading={actionLoading === `remove-${item.friendId}`}
                      onClick={() => handleRemove(item)}
                    />
                  ) : null
                }
              />
            ))
          )}
        </div>

        {/* Footer tip */}
        {!loading && activeTab === "friends" && friendList.length > 0 && (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground/60 font-medium">
              <span className="text-violet-400">{friendList.length}</span> connection{friendList.length !== 1 ? "s" : ""} — collaborate to solve rooms faster
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
