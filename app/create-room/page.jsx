import { ProfileForm } from "./create-room-form.jsx";
import { Terminal } from "lucide-react";

export default function CreateRoomPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-violet-600/10 dark:bg-violet-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[350px] h-[350px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto flex flex-col gap-8 max-w-2xl px-6 py-14">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/5 backdrop-blur-sm border border-violet-400/20 dark:border-violet-500/10 text-violet-600 dark:text-violet-300 text-xs font-mono uppercase tracking-widest">
            <Terminal className="w-3.5 h-3.5" />
            new session
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-foreground">
            Create a <span className="text-gradient">Room</span>
          </h1>
          <p className="mt-3 text-muted-foreground font-light">
            Describe your problem so other devs can find and help you.
          </p>
        </div>

        <div className="card-3d border-glow rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm p-8">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
