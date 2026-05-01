"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { UpdateUser } from "./actions";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Github,
  MapPin,
  GraduationCap,
  Briefcase,
  Tag,
  FileText,
  Save,
  ArrowLeft,
  Camera,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  github: z.string().min(2, { message: "Please enter your GitHub URL." }),
  bio: z.string().min(2, { message: "Tell us about yourself." }),
  tags: z.string().min(2, { message: "Add your skills and interests." }),
  country: z.string().min(2, { message: "Enter your country." }),
  role: z.string().min(2, { message: "Select your role." }),
  institute: z.string().min(2, { message: "Enter your organization." }),
});

export function EditProfile({ profileInfo }) {
  const router = useRouter();
  const session = useSession();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profileInfo?.name || "",
      email: profileInfo?.email || "",
      github: profileInfo?.github || "",
      bio: profileInfo?.bio || "",
      tags: profileInfo?.tags || "",
      country: profileInfo?.country || "",
      role: profileInfo?.role || "",
      institute: profileInfo?.institute || "",
    },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      await UpdateUser(values);
      toast.success("Profile updated successfully!");
      router.push(`/user/${session.data.user.id}`);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Edit <span className="text-gradient">Profile</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Update your personal information and preferences
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 rounded-2xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-sm">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-violet-500/20 ring-offset-2 ring-offset-background">
                  <Image
                    src={profileInfo?.image || "/icon.png"}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                        <User className="w-3.5 h-3.5" />
                        Display Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-lg font-semibold border-0 border-b border-border/50 dark:border-white/[0.08] rounded-none px-0 bg-transparent focus-visible:ring-0 focus-visible:border-violet-500 transition-colors sm:text-left text-center"
                          placeholder="Your name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  This is how others will see you on the platform
                </p>
              </div>
            </div>

            {/* Contact section */}
            <div className="space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Contact & Social
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                          placeholder="you@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" />
                        GitHub
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                          placeholder="https://github.com/username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* About section */}
            <div className="space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                About You
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground">
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all resize-none"
                          placeholder="Tell the community about yourself, your experience, and what you're passionate about..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Skills & Interests
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                          placeholder="react, node.js, python, machine-learning..."
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Comma-separated tags for better room suggestions</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location & Role section */}
            <div className="space-y-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-fuchsia-400" />
                Location & Role
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                          placeholder="India"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Role
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          {["Student", "Professional"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => field.onChange(opt)}
                              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                                field.value === opt
                                  ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-sm"
                                  : "border-border/50 dark:border-white/[0.08] text-muted-foreground hover:border-violet-500/20 hover:bg-violet-500/5"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {form.watch("role") === "Student" ? "University" : "Company"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl border-border/50 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 transition-all"
                        placeholder={form.watch("role") === "Student" ? "MIT, Stanford..." : "Google, Microsoft..."}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-white/[0.06]">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
              >
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
