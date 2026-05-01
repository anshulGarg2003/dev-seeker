"use client";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Heart, Terminal, ExternalLink } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Browse Rooms", href: "/browse" },
    { label: "Create Room", href: "/create-room" },
    { label: "Blogs", href: "/blog" },
    { label: "About", href: "/about" },
  ],
  Account: [
    { label: "Your Profile", href: "/user/edit" },
    { label: "Your Rooms", href: "/user/room" },
    { label: "Friends", href: "/user/friends" },
    { label: "Notifications", href: "/user/notification" },
  ],
  Community: [
    { label: "Feedback", href: "/feedback" },
    { label: "GitHub", href: "https://github.com", external: true },
    { label: "Twitter", href: "https://twitter.com", external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 dark:border-white/[0.04] bg-white/50 dark:bg-[#08080f]/80 backdrop-blur-xl">
      {/* Glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/browse" className="inline-flex items-center gap-2.5 group">
              <Image
                src="/icon.png"
                alt="Dev-Seeker"
                width={28}
                height={28}
                className="group-hover:rotate-12 transition-transform duration-500"
              />
              <span className="text-lg font-bold tracking-tight text-gradient">
                Dev-Seeker
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Debug together, grow faster. Join live rooms, pair-program with developers, and earn coins while solving bugs.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/5 text-muted-foreground hover:text-violet-500 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border/50 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/5 text-muted-foreground hover:text-cyan-500 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-violet-400" />
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border/30 dark:border-white/[0.04]">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dev-Seeker. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by developers, for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
