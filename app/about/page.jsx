import {
  Coins,
  MonitorPlay,
  Search,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Heart,
  HelpCircle,
  Star,
  Clock,
  UserPlus,
  Trash2,
  Terminal,
  Sparkles,
  Code2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative py-28 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-600/15 dark:bg-violet-600/8 blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/8 blur-[120px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-sm font-mono">
            <Code2 className="w-3.5 h-3.5" />
            about the platform
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-foreground">
            About <span className="text-gradient">Dev-Seeker</span>
          </h1>
          <p className="mt-8 text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto font-light">
            A developer-to-developer platform for real-time help solving bugs through{" "}
            <span className="text-cyan-500 dark:text-cyan-400 font-medium">live video calls</span> and{" "}
            <span className="text-violet-500 dark:text-violet-400 font-medium">screen sharing</span> — powered by a fair coin economy.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-mono text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-4">
                <HelpCircle className="w-4 h-4" />
                The Problem
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-foreground mb-6">
                Stuck on a <span className="text-gradient">bug</span>?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every developer has been stuck for hours — searching Stack Overflow,
                reading docs, still not finding the answer. Forum replies take days.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Dev-Seeker connects you instantly with developers who've faced the
                same issues. No waiting — just real-time problem solving.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-10 text-center">
                <HelpCircle className="w-20 h-20 text-violet-500 mx-auto mb-4 animate-float" />
                <p className="text-muted-foreground text-sm font-mono">
                  {">"} stuck_on_bug = True
                </p>
                <p className="text-violet-500 text-sm font-mono mt-1">
                  {">"} dev_seeker.solve()
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-cyan-500 dark:text-cyan-400 uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              Step by Step
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              How it <span className="text-gradient-neon">works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { icon: Search, step: "01", title: "Create a Room", desc: "Sign in with Google and create a room describing your bug. Add languages, link your GitHub repo. Costs Seeker Coins — ensures genuine requests.", gradient: "from-violet-600 to-violet-400", color: "text-violet-500" },
              { icon: Users, step: "02", title: "Browse & Join", desc: "Devs browse rooms by language or tags. When someone knows the fix, they join. Friends get notified automatically.", gradient: "from-fuchsia-600 to-fuchsia-400", color: "text-fuchsia-500" },
              { icon: MonitorPlay, step: "03", title: "Collaborate Live", desc: "Jump into a live video call with screen sharing. Debug in real-time. The room shows as 'Live' so others know a session is in progress.", gradient: "from-cyan-600 to-cyan-400", color: "text-cyan-500" },
              { icon: Coins, step: "04", title: "Earn & Reward", desc: "Helper earns Seeker Coins based on time spent. Both parties leave feedback and ratings. More help = more coins!", gradient: "from-emerald-600 to-emerald-400", color: "text-emerald-500" },
            ].map(({ icon: Icon, step, title, desc, gradient, color }) => (
              <div key={step} className="group flex flex-col md:flex-row gap-8 items-start card-3d rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8 overflow-hidden border-glow">
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`font-mono text-sm ${color} font-bold`}>{step}</span>
                    <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coin Economy */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent" />
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-fuchsia-500 dark:text-fuchsia-400 uppercase tracking-widest mb-4">
              <Coins className="w-4 h-4" />
              Economy
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              Seeker <span className="text-gradient">Coins</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: UserPlus, title: "Sign Up Bonus", desc: "100 Seeker Coins to get started", iconColor: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Search, title: "Create a Room", desc: "Costs coins — ensures quality requests", iconColor: "text-rose-500", bg: "bg-rose-500/10" },
              { icon: Clock, title: "Help & Earn", desc: "Earn coins per minute spent helping", iconColor: "text-cyan-500", bg: "bg-cyan-500/10" },
              { icon: Trash2, title: "Delete a Room", desc: "Get partial coins back when deleted", iconColor: "text-amber-500", bg: "bg-amber-500/10" },
            ].map(({ icon: Icon, title, desc, iconColor, bg }) => (
              <div key={title} className="card-3d rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-6 flex items-start gap-4 border-glow">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{title}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="inline-flex items-center gap-2 text-sm font-mono text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-4">
              <Terminal className="w-4 h-4" />
              Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
              Platform <span className="text-gradient">features</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Real-Time Video", desc: "High quality video & screen sharing via Stream.", iconColor: "text-amber-500" },
              { icon: Users, title: "Friends System", desc: "Build your network. Get notified when friends need help.", iconColor: "text-violet-500" },
              { icon: Shield, title: "Google Sign-In", desc: "Secure auth with Google. No passwords.", iconColor: "text-blue-500" },
              { icon: Star, title: "Ratings & Feedback", desc: "Rate sessions. Build your reputation.", iconColor: "text-orange-500" },
              { icon: Coins, title: "Transaction Log", desc: "Track all coin earnings and spending.", iconColor: "text-emerald-500" },
              { icon: Heart, title: "Community Driven", desc: "Built by developers, for developers.", iconColor: "text-rose-500" },
            ].map(({ icon: Icon, title, desc, iconColor }) => (
              <div key={title} className="card-3d group rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-6 text-center border-glow">
                <Icon className={`w-10 h-10 ${iconColor} mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`} />
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 animate-gradient-x bg-[length:200%_200%]" />
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-3xl text-center px-6 py-24">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-mono">
            <Terminal className="w-3.5 h-3.5" />
            Ready to deploy?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Start solving bugs today.
          </h2>
          <p className="text-lg text-white/70 mb-10 font-light">
            Get 100 free Seeker Coins and join the community.
          </p>
          <Link
            href="/browse"
            className="group inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-2xl hover:shadow-white/20 hover:scale-[1.02] transition-all duration-500"
          >
            Browse Rooms <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
