"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Coins,
  Clock,
  LayoutGrid,
  Medal,
  Crown,
  ArrowUpRight,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/Footer";

const tabs = [
  { key: "coins", label: "Top Earners", icon: Coins, color: "text-amber-400" },
  { key: "time", label: "Most Active", icon: Clock, color: "text-cyan-400" },
  { key: "rooms", label: "Most Rooms", icon: LayoutGrid, color: "text-fuchsia-400" },
];

const rankBadge = (index) => {
  if (index === 0)
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
        <Crown className="w-4.5 h-4.5 text-white" />
      </div>
    );
  if (index === 1)
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-lg shadow-slate-400/20">
        <Medal className="w-4.5 h-4.5 text-white" />
      </div>
    );
  if (index === 2)
    return (
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-700/20">
        <Medal className="w-4.5 h-4.5 text-white" />
      </div>
    );
  return (
    <div className="w-9 h-9 rounded-xl bg-muted/50 dark:bg-white/[0.04] border border-border/50 dark:border-white/[0.06] flex items-center justify-center">
      <span className="text-xs font-bold font-mono text-muted-foreground">
        {index + 1}
      </span>
    </div>
  );
};

const formatTime = (minutes) => {
  if (!minutes) return "0m";
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("coins");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${activeTab}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  const getStatValue = (user) => {
    if (activeTab === "coins") return `${user.totalcoins?.toLocaleString() || 0}`;
    if (activeTab === "time") return formatTime(user.totaltime);
    return `${user.roomCount || 0}`;
  };

  const getStatLabel = () => {
    if (activeTab === "coins") return "coins";
    if (activeTab === "time") return "contributed";
    return "rooms";
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" />
            leaderboard
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            Top <span className="text-gradient">Developers</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-md mx-auto font-light">
            The most active contributors in the Dev-Seeker community
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-6 lg:px-8 -mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/30 dark:bg-white/[0.02] border border-border/50 dark:border-white/[0.06] w-fit mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-white/[0.08] shadow-sm border border-border/50 dark:border-white/[0.08] text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? tab.color : ""}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-8 py-10 pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading rankings...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No data yet. Be the first to contribute!
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[1, 0, 2].map((podiumIdx) => {
                  const user = top3[podiumIdx];
                  if (!user) return <div key={podiumIdx} />;
                  const isFirst = podiumIdx === 0;
                  return (
                    <Link
                      key={user._id}
                      href={`/user/${user._id}`}
                      className={`group relative rounded-2xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isFirst
                          ? "bg-gradient-to-b from-amber-500/[0.08] to-transparent border-amber-500/20 shadow-lg shadow-amber-500/5 sm:order-2 sm:-mt-4"
                          : podiumIdx === 1
                            ? "border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] sm:order-1"
                            : "border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] sm:order-3"
                      }`}
                    >
                      {isFirst && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                            Champion
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-3">
                        <div className={`relative ${isFirst ? "w-20 h-20" : "w-16 h-16"}`}>
                          <Image
                            src={user.image || "/icon.png"}
                            alt={user.name}
                            fill
                            className="rounded-2xl object-cover ring-2 ring-offset-2 ring-offset-background ring-border/50"
                          />
                          <div className="absolute -bottom-2 -right-2">
                            {rankBadge(podiumIdx)}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-sm truncate max-w-[140px]">
                            {user.name}
                          </p>
                          {user.country && (
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {user.country}
                            </p>
                          )}
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-muted/50 dark:bg-white/[0.04] border border-border/30 dark:border-white/[0.04]">
                          <p className={`text-xl font-bold font-mono ${isFirst ? "text-amber-500" : ""}`}>
                            {getStatValue(user)}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {getStatLabel()}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                    </Link>
                  );
                })}
              </div>

              {/* Rest of the list */}
              {rest.length > 0 && (
                <div className="rounded-2xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-border/30 dark:border-white/[0.04] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Rankings
                    </span>
                  </div>
                  <div className="divide-y divide-border/30 dark:divide-white/[0.04]">
                    {rest.map((user, i) => (
                      <Link
                        key={user._id}
                        href={`/user/${user._id}`}
                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        {rankBadge(i + 3)}
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-border/50">
                          <Image
                            src={user.image || "/icon.png"}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-violet-500 transition-colors">
                            {user.name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {user.country && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {user.country}
                              </span>
                            )}
                            {user.role && <span>{user.role}</span>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold font-mono">
                            {getStatValue(user)}
                          </p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {getStatLabel()}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground shrink-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
