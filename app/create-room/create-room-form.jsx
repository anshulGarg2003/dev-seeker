"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CreateRoomAction } from "./actions";
import { useCallContext } from "@/context/CallContext";
import toast from "react-hot-toast";
import { Zap, Clock, Bug, ArrowRight } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Room name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  language: z.string().min(2, {
    message: "Please enter a language for better matching.",
  }),
  githubrepo: z.string().min(2, {
    message: "Please enter a GitHub repository.",
  }),
  difficulty: z.enum(["easy", "medium", "hard"]),
  estimatedTime: z.enum(["quick", "30min", "1hour", "2hours+"]),
  category: z.enum(["bug-fix", "feature-help", "code-review", "architecture", "learning"]),
});

const difficultyOptions = [
  { value: "easy", label: "Easy", color: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10" },
  { value: "medium", label: "Medium", color: "text-amber-500 border-amber-500/30 bg-amber-500/10" },
  { value: "hard", label: "Hard", color: "text-rose-500 border-rose-500/30 bg-rose-500/10" },
];

const timeOptions = [
  { value: "quick", label: "< 15 min" },
  { value: "30min", label: "~30 min" },
  { value: "1hour", label: "~1 hour" },
  { value: "2hours+", label: "2+ hours" },
];

const categoryOptions = [
  { value: "bug-fix", label: "Bug Fix", icon: "🐛" },
  { value: "feature-help", label: "Feature Help", icon: "🚀" },
  { value: "code-review", label: "Code Review", icon: "🔍" },
  { value: "architecture", label: "Architecture", icon: "🏗️" },
  { value: "learning", label: "Learning", icon: "📚" },
];

export function ProfileForm() {
  const router = useRouter();
  const { setHeaderRefresh } = useCallContext();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      language: "",
      githubrepo: "",
      difficulty: "medium",
      estimatedTime: "30min",
      category: "bug-fix",
    },
  });

  async function onSubmit(values) {
    try {
      await CreateRoomAction(values);
      setHeaderRefresh((prev) => !prev);
      toast.success("Room created successfully!");
      router.push("/browse");
    } catch (error) {
      toast.error(error.message || "Failed to create room");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Room Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Room Name</FormLabel>
              <FormControl>
                <Input {...field} maxLength={25} placeholder="e.g. React useEffect infinite loop" className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500" />
              </FormControl>
              <FormDescription className="text-xs">A concise title for your problem.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Describe your problem — what you've tried, what's happening, what you expect..." className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500 resize-none" />
              </FormControl>
              <FormDescription className="text-xs">Give enough context so helpers know what they&apos;re jumping into.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Bug className="w-3.5 h-3.5 text-violet-500" /> Category</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-mono border transition-all duration-200 ${
                        field.value === opt.value
                          ? "border-violet-500 bg-violet-500/15 text-violet-600 dark:text-violet-300 shadow-sm"
                          : "border-border dark:border-white/10 text-muted-foreground hover:border-violet-400/40"
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Difficulty + Estimated Time (side by side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Difficulty</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {difficultyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-mono font-medium border transition-all duration-200 ${
                          field.value === opt.value
                            ? opt.color + " shadow-sm"
                            : "border-border dark:border-white/10 text-muted-foreground hover:border-violet-400/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-cyan-500" /> Estimated Time</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {timeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-mono border transition-all duration-200 ${
                          field.value === opt.value
                            ? "border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 shadow-sm"
                            : "border-border dark:border-white/10 text-muted-foreground hover:border-cyan-400/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Language */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">Languages / Tech Stack</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. React, TypeScript, Node.js" className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500" />
              </FormControl>
              <FormDescription className="text-xs">Comma-separated tags to help devs find your room.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GitHub Repo */}
        <FormField
          control={form.control}
          name="githubrepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-foreground">GitHub Repo</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://github.com/user/repo" className="rounded-xl bg-background/50 dark:bg-white/[0.03] border-border dark:border-white/10 focus:border-violet-500" />
              </FormControl>
              <FormDescription className="text-xs">Link to the repo so helpers can reference the code.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-600/20 border-0 py-3 text-base group">
          Create Room <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}
