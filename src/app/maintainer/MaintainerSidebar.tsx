"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderGit2, AlertCircle, Coins, CheckSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MaintainerSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/maintainer/dashboard", icon: LayoutDashboard },
    { name: "Repositories", href: "/maintainer/repositories", icon: FolderGit2 },
    { name: "Issues", href: "/maintainer/issues", icon: AlertCircle },
    { name: "Active Bounties", href: "/maintainer/bounties", icon: Coins },
    { name: "AI Review Queue", href: "/maintainer/reviews", icon: CheckSquare },
  ];

  return (
    <aside className="w-64 border-r bg-muted/20 flex-col hidden md:flex min-h-full">
      <div className="p-4 py-6 border-b">
        <h2 className="font-semibold text-lg font-sans">Maintainer View</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
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
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
              : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
