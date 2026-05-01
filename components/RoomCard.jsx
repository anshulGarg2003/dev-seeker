"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github, Clock, Zap, ArrowRight, MessageSquare } from "lucide-react";
import TagList from "@/components/tag-list";
import { splitTags } from "@/lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const difficultyConfig = {
  easy: { label: "Easy", class: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  medium: { label: "Medium", class: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  hard: { label: "Hard", class: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
};

const timeConfig = {
  quick: "< 15 min",
  "30min": "~30 min",
  "1hour": "~1 hour",
  "2hours+": "2+ hours",
};

const categoryConfig = {
  "bug-fix": { label: "Bug Fix", icon: "🐛" },
  "feature-help": { label: "Feature Help", icon: "🚀" },
  "code-review": { label: "Code Review", icon: "🔍" },
  architecture: { label: "Architecture", icon: "🏗️" },
  learning: { label: "Learning", icon: "📚" },
};

export function RoomCard({ roomInfo, isLive }) {
  const diff = difficultyConfig[roomInfo.difficulty] || difficultyConfig.medium;
  const time = timeConfig[roomInfo.estimatedTime] || timeConfig["30min"];
  const cat = categoryConfig[roomInfo.category] || categoryConfig["bug-fix"];
  const live = isLive !== undefined ? isLive : roomInfo.isLive;

  return (
    <Card className="card-3d group relative flex flex-col rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 overflow-hidden border-glow">
      {/* Hover glow blob */}
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* ── Top: Category + Live badge row ── */}
      <div className="flex items-center justify-between px-5 pt-5 pb-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300">
          {cat.icon} {cat.label}
        </span>
        {live && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>

      {/* ── Header: Title + Description ── */}
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-foreground text-lg font-bold leading-tight line-clamp-1">
          {roomInfo.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {roomInfo.description}
        </p>
      </CardHeader>

      {/* ── Meta pills: Difficulty + Time ── */}
      <CardContent className="pb-2 pt-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium border ${diff.class}`}>
            <Zap className="w-3 h-3" />
            {diff.label}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        </div>
      </CardContent>

      {/* ── Tags ── */}
      <CardContent className="pb-2 pt-0">
        <TagList tags={splitTags(roomInfo?.language)} />
      </CardContent>

      {/* ── GitHub link ── */}
      {roomInfo.githubrepo && (
        <CardContent className="pb-3 pt-0">
          <Link
            href={roomInfo.githubrepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-500 dark:hover:text-violet-400 transition-colors truncate max-w-full"
          >
            <Github className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{roomInfo.githubrepo.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
          </Link>
        </CardContent>
      )}

      {/* ── Footer: User + Join ── */}
      <CardFooter className="mt-auto pt-3 pb-5 flex items-center justify-between border-t border-border/50 dark:border-white/5">
        <Link href={`/user/${roomInfo.userId}`} className="flex items-center gap-2 group/user">
          <Avatar className="w-7 h-7 ring-2 ring-violet-500/20">
            <AvatarImage src={roomInfo.userProfile || ""} />
            <AvatarFallback className="text-xs">
              {roomInfo.userName?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground group-hover/user:text-violet-500 transition-colors truncate max-w-[120px]">
            {roomInfo.userName}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-3 hover:border-violet-500/30 hover:text-violet-500 transition-colors group/disc">
            <Link href={`/room/${roomInfo._id}/discussion`} className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Discuss
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/20 text-white border-0 text-xs font-bold px-4 group/btn">
            <Link href={`/room/${roomInfo._id}`} className="flex items-center gap-1">
              Join <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
