"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, ClipboardCheck, Wallet, Trophy, UserSquare2, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContributorSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/contributor/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/bounties", icon: Store },
    { name: "My Claims", href: "/contributor/claims", icon: ClipboardCheck },
    { name: "Earnings", href: "/contributor/earnings", icon: Wallet },
    { name: "Reputation", href: "/contributor/reputation", icon: Trophy },
    { name: "Portfolio", href: "/contributor/portfolio", icon: UserSquare2 },
    { name: "Career Copilot", href: "/copilot", icon: Sparkles, special: true },
  ];

  return (
    <aside className="w-64 border-r bg-muted/20 flex-col hidden md:flex min-h-full">
      <div className="p-4 py-6 border-b">
        <h2 className="font-semibold text-lg font-sans">Contributor View</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          
          if (link.special) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "text-purple-600 dark:text-purple-400 bg-purple-500/5 hover:bg-purple-500/10"
                )}
              >
                <Icon className="w-4 h-4" /> {link.name}
              </Link>
            )
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-4 h-4" /> {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
            pathname.startsWith("/settings")
              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
