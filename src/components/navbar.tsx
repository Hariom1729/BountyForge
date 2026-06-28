"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isDashboard = 
    pathname.startsWith("/maintainer") || 
    pathname.startsWith("/contributor") || 
    pathname.startsWith("/guest") || 
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding");

  if (isDashboard) return null;

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-2 bg-gradient-to-b from-background via-background/80 to-transparent">
      <nav className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-background/60 dark:bg-black/40 backdrop-blur-lg shadow-xl shadow-purple-500/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              BountyForge
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/bounties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-purple-500 after:transition-all">
                Explore Bounties
              </Link>
              <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-purple-500 after:transition-all">
                Jobs
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[2px] after:absolute after:bottom-0 after:left-0 after:bg-purple-500 after:transition-all">
                Leaderboard
              </Link>
              {session ? (
                <Link 
                  href={session.user.role === "MAINTAINER" || session.user.role === "ENTERPRISE" ? "/maintainer/dashboard" : "/contributor/dashboard"} 
                  className="text-sm font-medium text-foreground hover:text-purple-600 transition-colors"
                >
                  Dashboard
                </Link>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline-block font-medium">
                  {session.user?.name}
                </span>
                <Button variant="outline" size="sm" className="rounded-xl border-purple-500/20 hover:bg-purple-500/10 hover:text-purple-400" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-xl")}>
                  Sign In
                </Link>
                <Link href="/signin" className={cn(buttonVariants({ size: "sm" }), "rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/10")}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
