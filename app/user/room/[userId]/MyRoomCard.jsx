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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TagList from "@/components/tag-list";
import { splitTags } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import Lottie from "@/components/LottieWrapper";
import Live from "@/Live.json";

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

function getTimeDifferenceFromNow(timestamp) {
  const givenTime = new Date(timestamp);
  const currentTime = new Date();

  const diffInMilliseconds = currentTime - givenTime;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return diffInYears === 1 ? "a year ago" : `${diffInYears} years ago`;
  } else if (diffInMonths > 0) {
    return diffInMonths === 1 ? "a month ago" : `${diffInMonths} months ago`;
  } else if (diffInDays > 0) {
    return diffInDays === 1 ? "a day ago" : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? "an hour ago" : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? "a minute ago"
      : `${diffInMinutes} minutes ago`;
  } else {
    return "just now";
  }
}

export function MyRoomCard({ roomInfo, onDelete, loading }) {
  const memoizedTags = useMemo(
    () => splitTags(roomInfo?.language),
    [roomInfo?.language]
  );

  const diff = difficultyConfig[roomInfo?.difficulty] || difficultyConfig.medium;
  const time = timeConfig[roomInfo?.estimatedTime] || timeConfig["30min"];
  const cat = categoryConfig[roomInfo?.category] || categoryConfig["bug-fix"];

  return (
    <Card className="card-3d group relative flex flex-col rounded-2xl border border-border dark:border-white/5 bg-card/80 dark:bg-white/[0.02] backdrop-blur-sm shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 overflow-hidden border-glow">
      <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-violet-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top: Category + Live */}
      <div className="flex items-center justify-between px-5 pt-5 pb-0">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-300">
          {cat.icon} {cat.label}
        </span>
        {roomInfo.isLive && (
          <div className="w-16">
            <Lottie animationData={Live} />
          </div>
        )}
      </div>

      {/* Header */}
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-foreground text-lg font-bold leading-tight line-clamp-1">
          {loading ? <Skeleton highlightColor="black" /> : roomInfo.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {loading ? <Skeleton count={2} highlightColor="black" /> : roomInfo.description}
        </p>
      </CardHeader>

      {/* Meta pills */}
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

      {/* Tags */}
      <CardContent className="pb-2 pt-0">
        {loading ? <Skeleton highlightColor="black" /> : <TagList tags={memoizedTags} />}
      </CardContent>

      {/* GitHub */}
      {roomInfo?.githubrepo && (
        <CardContent className="pb-3 pt-0">
          <a
            href={roomInfo.githubrepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-500 transition-colors truncate max-w-full"
          >
            <Github className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{roomInfo.githubrepo.replace(/^https?:\/\/(www\.)?github\.com\//, "")}</span>
          </a>
        </CardContent>
      )}

      {/* Footer */}
      <CardFooter className="mt-auto pt-3 pb-5 flex items-center justify-between border-t border-border/50 dark:border-white/5">
        <span className="text-xs text-muted-foreground font-mono">
          {loading ? <Skeleton highlightColor="black" /> : getTimeDifferenceFromNow(roomInfo.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-xl border-border dark:border-white/10 text-xs font-bold px-3 hover:border-violet-500/30 hover:text-violet-500 transition-colors">
            <Link href={loading ? "#" : `/room/${roomInfo._id}/discussion`} className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Discuss
            </Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/20 text-white border-0 text-xs font-bold px-4 group/btn">
            <Link href={loading ? "#" : `/room/${roomInfo._id}`} className="flex items-center gap-1">
              Join <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
