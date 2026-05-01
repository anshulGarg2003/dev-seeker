"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./toggleButton";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Coins,
  LogIn,
  LogOutIcon,
  User,
  Edit3,
  LayoutGrid,
  Users,
  Bell as BellIcon,
  Menu,
  X,
  Search,
  BookOpen,
  Info,
  Sparkles,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useCallContext } from "@/context/CallContext";

const navLinks = [
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/blog", label: "Blogs", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
];

const Header = () => {
  const session = useSession();
  const pathname = usePathname();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { headerRefresh } = useCallContext();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      if (!session?.data?.user?.id) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/user/${session.data.user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) setUserDetails(data);
        }
      } catch {
        // silent
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUserDetails();
    return () => {
      isMounted = false;
    };
  }, [session?.data?.user?.id, headerRefresh]);

  const notifCount = userDetails?.notification?.length || 0;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-2xl shadow-lg shadow-black/[0.03] dark:shadow-black/20 border-b border-border/50 dark:border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/browse"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="relative">
                <Image
                  src="/icon.png"
                  alt="logo"
                  width={34}
                  height={34}
                  className="group-hover:rotate-12 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-violet-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gradient hidden sm:inline">
                Dev-Seeker
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? "text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-500/[0.08]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-violet-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {session.data ? (
                <>
                  {/* Coins */}
                  {!loading && (
                    <div className="hidden sm:flex items-center gap-0 rounded-xl overflow-hidden border border-violet-500/15 dark:border-violet-500/10 bg-gradient-to-r from-violet-500/[0.06] to-fuchsia-500/[0.04]">
                      <div className="px-2.5 py-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div className="px-3 py-1.5 font-mono font-bold text-sm tabular-nums">
                        {userDetails.totalcoins ?? 0}
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  <Link
                    href="/user/notification"
                    className="relative p-2 rounded-xl hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <BellIcon className="w-5 h-5 text-muted-foreground" />
                    {notifCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 ring-2 ring-white dark:ring-[#0a0a14] animate-pulse">
                        {notifCount > 9 ? "9+" : notifCount}
                      </span>
                    )}
                  </Link>

                  {/* Create room button */}
                  <Link
                    href="/create-room"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Create
                  </Link>

                  {/* Profile dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors outline-none">
                        <Avatar className="w-8 h-8 ring-2 ring-violet-500/20">
                          <AvatarImage src={session.data.user.image ?? ""} />
                          <AvatarFallback className="bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
                            {session.data.user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
                          {session.data.user.name}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 p-1.5 rounded-xl border border-border/50 dark:border-white/[0.08] bg-white/95 dark:bg-[#111122]/95 backdrop-blur-xl shadow-xl"
                    >
                      {/* User info header */}
                      <div className="px-3 py-2.5 mb-1">
                        <p className="text-sm font-semibold truncate">{session.data.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.data.user.email}</p>
                        {/* Mobile coins */}
                        {!loading && (
                          <div className="flex sm:hidden items-center gap-1.5 mt-2 text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                            <Coins className="w-3.5 h-3.5" />
                            {userDetails.totalcoins ?? 0} coins
                          </div>
                        )}
                      </div>
                      <DropdownMenuSeparator className="bg-border/50 dark:bg-white/[0.06]" />
                      <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer gap-3 focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400">
                        <Link href={`/user/${session.data.user.id}`}>
                          <User className="w-4 h-4" />
                          Your Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer gap-3 focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400">
                        <Link href="/user/edit">
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer gap-3 focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400">
                        <Link href="/user/room">
                          <LayoutGrid className="w-4 h-4" />
                          Your Rooms
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer gap-3 focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400">
                        <Link href="/user/friends">
                          <Users className="w-4 h-4" />
                          Friends
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50 dark:bg-white/[0.06]" />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="rounded-lg px-3 py-2 cursor-pointer gap-3 text-red-500 focus:bg-red-500/10 focus:text-red-500"
                      >
                        <LogOutIcon className="w-4 h-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <ModeToggle />

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 border-t border-border/50 dark:border-white/[0.06]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 space-y-1 bg-white/90 dark:bg-[#0a0a14]/90 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-violet-600 dark:text-violet-400 bg-violet-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
            {session.data && (
              <Link
                href="/create-room"
                className="flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold sm:hidden"
              >
                <Sparkles className="w-4 h-4" />
                Create Room
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to offset fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;
