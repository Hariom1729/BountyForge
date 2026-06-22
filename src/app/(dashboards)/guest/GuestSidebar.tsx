"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  Trophy, 
  Briefcase, 
  FolderGit2, 
  Building2, 
  BarChart3, 
  Bot, 
  UserCircle 
} from "lucide-react";

const guestNavItems = [
  { href: "/guest/dashboard", icon: LayoutDashboard, title: "Dashboard" },
  { href: "/marketplace", icon: Store, title: "Marketplace" },
  { href: "/leaderboard", icon: Trophy, title: "Leaderboard" },
  { href: "/jobs", icon: Briefcase, title: "Jobs" },
  { href: "/repositories", icon: FolderGit2, title: "Repositories" },
  { href: "/organizations", icon: Building2, title: "Organizations" },
  { href: "/analytics", icon: BarChart3, title: "Analytics" },
  { href: "/copilot", icon: Bot, title: "Career Copilot" },
  { href: "/guest/profile", icon: UserCircle, title: "Profile Preview" },
];

export function GuestSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-muted/30 hidden md:block">
      <div className="p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Guest Explorer
        </div>
        <nav className="space-y-1">
          {guestNavItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
