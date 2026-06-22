"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  GitBranch, 
  Settings, 
  HelpCircle, 
  Bell, 
  Plus, 
  ShieldAlert, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  Search,
  Menu,
  X,
  LayoutDashboard,
  Layers,
  AlertCircle,
  Coins,
  Users,
  Eye,
  CreditCard,
  Lock,
  BarChart3,
  Building,
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FundBountyModal } from "@/components/features/FundBountyModal";
import { UpgradeModal } from "@/components/features/UpgradeModal";
import { DottedSurface } from "@/components/ui/dotted-surface";

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "secondary";
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Dashboard", href: "/maintainer/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/maintainer/repositories", icon: GitBranch },
  { name: "Issues", href: "/maintainer/issues", icon: AlertCircle, badge: "8" },
  { name: "Bounties", href: "/maintainer/bounties", icon: Coins },
  { name: "Contributors", href: "/maintainer/contributors", icon: Users },
  { name: "AI Review Queue", href: "/maintainer/reviews", icon: Eye, badge: "3", badgeVariant: "destructive" },
  { name: "Payments", href: "/maintainer/payments", icon: CreditCard },
  { name: "Escrow", href: "/maintainer/escrow", icon: Lock },
  { name: "Analytics", href: "/maintainer/analytics", icon: BarChart3 },
  { name: "Organization", href: "/maintainer/organization", icon: Building },
  { name: "AI Assistant", href: "/maintainer/copilot", icon: Terminal },
  { name: "Security Center", href: "/maintainer/security", icon: ShieldCheck, badge: "New" },
  { name: "Settings", href: "/maintainer/settings", icon: Settings },
];

export default function MaintainerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBountyModalOpen, setIsBountyModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex relative overflow-hidden">
      <DottedSurface className="opacity-30" />
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-900 bg-neutral-950 transition-all duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Workspace Brand / Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 font-bold text-white shadow-md shadow-purple-600/30">
              BF
            </div>
            <div>
              <span className="font-bold text-sm text-white">BountyForge</span>
              <span className="block text-[10px] text-neutral-500 font-medium">Enterprise Workspace</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-neutral-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Organization switcher */}
        <div className="px-4 py-3 border-b border-neutral-900">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 text-left transition-all">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-5 w-5 rounded bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <span className="font-medium text-xs text-neutral-300 truncate">Acme Inc.</span>
            </div>
            <ChevronDown className="h-3 w-3 text-neutral-500 shrink-0" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto scrollbar-none">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group
                  ${isActive 
                    ? "bg-purple-600/10 border border-purple-500/20 text-purple-400" 
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 border border-transparent"}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-purple-400" : "text-neutral-500 group-hover:text-neutral-300"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badgeVariant || "default"}
                    className={`
                      text-[9px] px-1.5 py-0.5 rounded-full shrink-0 font-normal
                      ${item.badgeVariant === "destructive" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                        : "bg-neutral-800 text-neutral-400 border border-neutral-700"}
                    `}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Card at bottom */}
        <div className="p-4 border-t border-neutral-900 bg-neutral-950">
          {isGuest ? (
            <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 text-center space-y-2 mb-2">
              <div className="text-[10px] text-purple-400 font-semibold flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> Guest Mode Preview
              </div>
              <Button 
                size="sm" 
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full h-7 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                Upgrade Account
              </Button>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <Avatar className="h-8 w-8 border border-neutral-800">
                <AvatarImage src={session?.user?.image || undefined} />
                <AvatarFallback className="bg-neutral-800 text-xs text-neutral-400 font-bold">
                  {session?.user?.name?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <span className="block text-xs font-semibold text-white truncate">{session?.user?.name || "Maintainer"}</span>
                <span className="block text-[10px] text-neutral-500 truncate">{session?.user?.email || "maintainer@bountyforge.com"}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="text-[10px] text-neutral-500 hover:text-red-400 font-medium transition-colors ml-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-neutral-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 font-medium">
              <span>Workspace</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-300">Acme Inc.</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Fund Bounty Button */}
            <Button 
              onClick={() => setIsBountyModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs h-9 px-4 flex items-center gap-2 shadow-lg shadow-purple-900/10"
            >
              <Plus className="h-4 w-4" /> Fund New Bounty
            </Button>

            {/* Notification bell */}
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Shared Feature Modals */}
      <FundBountyModal 
        isOpen={isBountyModalOpen} 
        onClose={() => setIsBountyModalOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onSuccess={() => {
          // Trigger a refresh of the page contents if dashboard or lists
          window.location.reload();
        }}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
