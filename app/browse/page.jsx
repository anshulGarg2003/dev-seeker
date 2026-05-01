"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";
import { RoomCard } from "@/components/RoomCard";
import Lottie from "@/components/LottieWrapper";
import Loading from "@/Loading.json";
import Image from "next/image";
import Link from "next/link";
import { Plus, Terminal, Layers, Wifi, Search, Filter, X, Zap, Clock, Signal } from "lucide-react";
import toast from "react-hot-toast";
import { useLiveRooms } from "@/hooks/useLiveRooms";
import Footer from "@/components/Footer";

export default function Home({ searchParams }) {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: null,
    category: null,
    liveOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const liveRoomIds = useLiveRooms();

  useEffect(() => {
    const fetchRooms = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch("/api/room", { signal });
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
          setLoading(false);
        } else {
          console.error("Failed to fetch rooms");
          setLoading(false);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching rooms:", error);
          setLoading(false);
        }
      }

      return () => {
        controller.abort();
      };
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    let result = [...rooms];

    // Text search filter
    if (searchParams?.search) {
      const search = searchParams.search.toLowerCase();
      result = result.filter((room) => {
        if (!room.language) return false;
        const languages = room.language
          .split(",")
          .map((lang) => lang.trim().toLowerCase());
        return languages.includes(search);
      });
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter((r) => r.difficulty === filters.difficulty);
    }

    // Category filter
    if (filters.category) {
      result = result.filter((r) => r.category === filters.category);
    }

    // Live only filter
    if (filters.liveOnly) {
      result = result.filter((r) => liveRoomIds.has(r._id) || r.isLive);
    }

    setFilteredRooms(result);
  }, [searchParams, rooms, filters, liveRoomIds]);

  const liveCount = liveRoomIds.size || rooms.filter((r) => r.isLive).length;

  const handleCreateClick = (e) => {
    if (!session) {
      e.preventDefault();
      toast.error("Login First");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ── Hero Banner ── */}
      <section className="relative py-16 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-violet-600/15 dark:bg-violet-600/8 blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/8 blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Title & Stats */}
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-widest">
                <Terminal className="w-3.5 h-3.5" />
                active rooms
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
                Browse <span className="text-gradient">Rooms</span>
              </h1>
              <p className="mt-3 text-lg text-muted-foreground max-w-lg font-light">
                Find a bug room that matches your stack. Jump in, debug together, earn coins.
              </p>

              {/* Quick Stats */}
              {!loading && (
                <div className="flex gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span className="font-mono font-bold text-foreground">{rooms.length}</span> rooms
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <span className="font-mono font-bold text-emerald-500">{liveCount}</span> live now
                  </div>
                  {searchParams?.search && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Search className="w-4 h-4 text-cyan-500" />
                      <span className="font-mono font-bold text-foreground">{filteredRooms.length}</span> results
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: CTA */}
            <div className="flex-shrink-0">
              {session ? (
                <Link
                  href="/create-room"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] animate-gradient-x text-white font-bold shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-500"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Room
                </Link>
              ) : (
                <button
                  onClick={handleCreateClick}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_100%] animate-gradient-x text-white font-bold shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-500"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Room
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-10 p-5 rounded-2xl bg-card/60 dark:bg-white/[0.02] backdrop-blur-md border border-border dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBar />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  showFilters || filters.difficulty || filters.category || filters.liveOnly
                    ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400"
                    : "border-border/50 dark:border-white/[0.08] text-muted-foreground hover:text-foreground hover:border-violet-500/20"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filters.difficulty || filters.category || filters.liveOnly) && (
                  <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {[filters.difficulty, filters.category, filters.liveOnly].filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-60 mt-4 pt-4 border-t border-border/30 dark:border-white/[0.04]" : "max-h-0"}`}>
              <div className="space-y-4">
                {/* Difficulty */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Signal className="w-3 h-3" /> Difficulty
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "easy", label: "Easy", color: "emerald" },
                      { value: "medium", label: "Medium", color: "amber" },
                      { value: "hard", label: "Hard", color: "red" },
                    ].map((d) => (
                      <button
                        key={d.value}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            difficulty: f.difficulty === d.value ? null : d.value,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          filters.difficulty === d.value
                            ? `bg-${d.color}-500/15 border-${d.color}-500/30 text-${d.color}-600 dark:text-${d.color}-400`
                            : "border-border/50 dark:border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "bug-fix", label: "Bug Fix" },
                      { value: "feature-help", label: "Feature Help" },
                      { value: "code-review", label: "Code Review" },
                      { value: "architecture", label: "Architecture" },
                      { value: "learning", label: "Learning" },
                    ].map((c) => (
                      <button
                        key={c.value}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            category: f.category === c.value ? null : c.value,
                          }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          filters.category === c.value
                            ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400"
                            : "border-border/50 dark:border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-border"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live + Clear row */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      setFilters((f) => ({ ...f, liveOnly: !f.liveOnly }))
                    }
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      filters.liveOnly
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "border-border/50 dark:border-white/[0.06] text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    <Wifi className="w-3 h-3" />
                    Live Only
                  </button>

                  {(filters.difficulty || filters.category || filters.liveOnly) && (
                    <button
                      onClick={() =>
                        setFilters({ difficulty: null, category: null, liveOnly: false })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Room Grid ── */}
      <section className="relative px-6 lg:px-8 pb-20">
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Lottie loop={true} animationData={Loading} />
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-20">
              <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-12 text-center">
                <Image
                  src="/done.svg"
                  alt="all rooms are completed"
                  width={280}
                  height={280}
                  className="mx-auto mb-6 opacity-80"
                />
                <p className="text-xl font-bold text-foreground mb-2">All clear!</p>
                <p className="text-muted-foreground font-light">
                  {searchParams?.search
                    ? `No rooms found for "${searchParams.search}". Try a different tag.`
                    : "No active rooms right now. Be the first to create one!"}
                </p>
                {!searchParams?.search && session && (
                  <Link
                    href="/create-room"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-lg shadow-violet-600/20 hover:scale-[1.02] transition-transform"
                  >
                    <Plus className="w-4 h-4" /> Create a Room
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  roomInfo={room}
                  isLive={liveRoomIds.has(room._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
