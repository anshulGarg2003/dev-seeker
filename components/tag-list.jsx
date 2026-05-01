"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function TagList({ tags }) {
  const router = useRouter();
  return (
    <div className="w-fit flex flex-wrap gap-2">
      {tags.map((lang) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-3 py-1 rounded-lg text-xs font-mono font-medium bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-300 border border-violet-400/20 dark:border-violet-500/10 hover:bg-violet-500/20 dark:hover:bg-violet-500/10 hover:border-violet-400/40 transition-colors"
          onClick={() => {
            router.push(`/browse/?search=${lang.toLowerCase()}`);
          }}
          key={lang}
        >
          {lang}
        </Button>
      ))}
    </div>
  );
}
