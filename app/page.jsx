"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import FeedbackCarousel from "@/components/FeedbackCarousel";
import {
  Coins,
  MonitorPlay,
  Search,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  Terminal,
  Code2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function Example() {
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await fetch("/api/testimonals", { signal });
        if (response.ok) {
          const data = await response.json();
          setFeedback(data);
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

  return (
    <div className="overflow-hidden">
      {/* ========== HERO ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated grid bg */}
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

        {/* Neon orbs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-violet-600/20 dark:bg-violet-600/10 blur-[150px] animate-pulse-slow" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-fuchsia-600/15 dark:bg-fuchsia-600/8 blur-[130px] animate-pulse-slow" style={{ animationDelay: "4s" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 lg:py-32 text-center">
          {/* Status chip */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/30 dark:border-violet-500/20 bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm px-5 py-2 text-sm font-mono text-violet-700 dark:text-violet-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Code2 className="w-3.5 h-3.5" />
            devs online — join the hive
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.9]">
            <span className="text-foreground">Debug </span>
            <span className="text-gradient">together.</span>
            <br />
            <span className="text-foreground">Ship </span>
            <span className="text-gradient-neon">faster.</span>
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-muted-foreground font-light">
            Post your bug. A dev who's solved it before jumps in on a{" "}
            <span className="text-cyan-500 dark:text-cyan-400 font-medium">live video call</span>.
            Fix it together. Earn{" "}
            <span className="text-violet-500 dark:text-violet-400 font-medium">Seeker Coins</span>{" "}
            by helping others.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="group relative rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-600/25 hover:shadow-violet-600/40 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Browse Rooms
              </span>
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            </Link>
            <Link
              href="/about"
              className="group flex items-center gap-2 rounded-2xl border border-border dark:border-white/10 bg-card/50 dark:bg-white/5 backdrop-blur-sm px-10 py-4 text-base font-semibold text-foreground hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-500"
            >
              How it works
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-3 gap-6 sm:gap-10 max-w-xl mx-auto">
            {[
              { value: "100", label: "Free coins on signup" },
              { value: "Live", label: "Video & screen share" },
              { value: "24/7", label: "Community available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-gradient tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="relative py-28 px-6 lg:px-8">
        {/* Dot pattern bg */}
        <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              Simple Process
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
              How it <span className="text-gradient">works</span>
            </h2>
          </div>

          {/* Steps — 3D cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                step: "01",
                title: "Create a Room",
                desc: "Describe your bug. Costs a few Seeker Coins.",
                gradient: "from-violet-600 to-violet-400",
                iconBg: "bg-violet-500/10 dark:bg-violet-500/10",
                iconColor: "text-violet-500",
              },
              {
                icon: Users,
                step: "02",
                title: "A Dev Joins",
                desc: "Someone who knows the fix finds your room.",
                gradient: "from-fuchsia-600 to-fuchsia-400",
                iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/10",
                iconColor: "text-fuchsia-500",
              },
              {
                icon: MonitorPlay,
                step: "03",
                title: "Collaborate Live",
                desc: "Video call + screen share. Debug together.",
                gradient: "from-cyan-600 to-cyan-400",
                iconBg: "bg-cyan-500/10 dark:bg-cyan-500/10",
                iconColor: "text-cyan-500",
              },
              {
                icon: Coins,
                step: "04",
                title: "Earn Coins",
                desc: "Helpers earn coins based on time spent.",
                gradient: "from-emerald-600 to-emerald-400",
                iconBg: "bg-emerald-500/10 dark:bg-emerald-500/10",
                iconColor: "text-emerald-500",
              },
            ].map(({ icon: Icon, step, title, desc, gradient, iconBg, iconColor }) => (
              <div
                key={step}
                className="card-3d group relative rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-7 overflow-hidden border-glow"
              >
                {/* Step number watermark */}
                <span className="absolute -top-4 -right-2 text-7xl font-black text-muted-foreground/5 select-none">
                  {step}
                </span>

                {/* Hover glow */}
                <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />

                <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY DEV-SEEKER ========== */}
      <section className="relative py-28 px-6 lg:px-8">
        {/* Neon divider line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-4">
              <Zap className="w-4 h-4" />
              Why choose us
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
              Why <span className="text-gradient">Dev-Seeker</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant Help",
                desc: "No waiting for forum replies. Real-time help from devs who've been there.",
                iconColor: "text-amber-500",
                glowColor: "bg-amber-500",
              },
              {
                icon: Shield,
                title: "Fair Coin Economy",
                desc: "100 coins on signup. Spend to ask, earn by helping. Everyone wins.",
                iconColor: "text-violet-500",
                glowColor: "bg-violet-500",
              },
              {
                icon: Heart,
                title: "Build Connections",
                desc: "Add friends, track contributions, build your dev tribe.",
                iconColor: "text-rose-500",
                glowColor: "bg-rose-500",
              },
            ].map(({ icon: Icon, title, desc, iconColor, glowColor }) => (
              <div
                key={title}
                className="card-3d group relative rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8 overflow-hidden border-glow"
              >
                {/* Corner glow */}
                <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full ${glowColor}/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <Icon className={`w-10 h-10 ${iconColor} mb-5 group-hover:scale-110 transition-transform duration-500`} />
                <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-violet-500 dark:text-violet-400 font-semibold hover:text-violet-400 transition-colors text-lg"
            >
              Learn more about Dev-Seeker
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="relative py-28 px-6 lg:px-8 overflow-hidden">
        {/* Neon divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              Testimonials
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              What devs <span className="text-gradient-neon">say</span>
            </h2>
          </div>

          <div className="rounded-3xl border border-border dark:border-white/5 bg-card/50 dark:bg-white/[0.02] backdrop-blur-sm p-8 sm:p-12">
            {loading ? (
              <div className="py-10 flex justify-center items-center text-lg text-muted-foreground font-mono">
                Loading testimonials<span className="animate-pulse">...</span>
              </div>
            ) : (
              <FeedbackCarousel feedbackData={feedback} />
            )}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative overflow-hidden">
        {/* Mesh gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 animate-gradient-x bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-mono">
            <Terminal className="w-3.5 h-3.5" />
            Ready to deploy?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Solve your next bug.
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto font-light">
            Join the community. Get 100 free Seeker Coins. Start collaborating with developers worldwide.
          </p>
          <Link
            href="/browse"
            className="group relative inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-500"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
