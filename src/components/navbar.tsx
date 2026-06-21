"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight text-green-600 dark:text-green-400">
            BountyForge
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/bounties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explore Bounties
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Leaderboard
            </Link>
            <Link href="/enterprise" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Enterprise
            </Link>
            {session && (
              <>
                <Link href="/copilot" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition-colors">
                  AI Copilot
                </Link>
                <Link href="/bounties/create" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Post Bounty
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                {session.user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => signIn("github")}>
              Login with GitHub
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
