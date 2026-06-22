"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  Search, 
  Plus, 
  Play, 
  Pause, 
  XCircle, 
  DollarSign, 
  Clock, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { FundBountyModal } from "@/components/features/FundBountyModal";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface BountyItem {
  id: string;
  title: string;
  repo: string;
  amount: number;
  status: "Open" | "Claimed" | "In Progress" | "Review Pending" | "Completed" | "Cancelled";
  applicants: number;
  createdAt: string;
}

const MOCK_BOUNTIES: BountyItem[] = [
  { id: "1", title: "Memory leak in transition router hooks", repo: "facebook/react", amount: 450, status: "Open", applicants: 3, createdAt: "2 days ago" },
  { id: "2", title: "Refactor dynamic context providers for speed", repo: "facebook/react", amount: 200, status: "In Progress", applicants: 1, createdAt: "3 days ago" },
  { id: "3", title: "Turbopack crash on dynamic route imports in Windows", repo: "vercel/next.js", amount: 850, status: "Review Pending", applicants: 4, createdAt: "1 week ago" },
  { id: "4", title: "Implement Stripe escrow payout release cron job", repo: "Hariom1729/BountyForge", amount: 300, status: "Claimed", applicants: 2, createdAt: "4 days ago" },
  { id: "5", title: "Image component flashes Layout Shift on mobile Chrome", repo: "vercel/next.js", amount: 100, status: "Completed", applicants: 1, createdAt: "2 weeks ago" },
];

export default function BountiesPage() {
  const { data: session } = useSession();
  const [bounties, setBounties] = useState<BountyItem[]>(MOCK_BOUNTIES);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [isBountyModalOpen, setIsBountyModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleUpdateStatus = (id: string, newStatus: BountyItem["status"]) => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setBounties(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleIncreaseReward = (id: string) => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setBounties(prev => prev.map(b => b.id === id ? { ...b, amount: b.amount + 100 } : b));
  };

  const TABS = ["All", "Open", "Claimed", "In Progress", "Review Pending", "Completed", "Cancelled"];

  const filteredBounties = bounties.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.repo.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bounty Management</h1>
          <p className="text-neutral-400 text-sm">Create, monitor, adjust, and release open-source development funds.</p>
        </div>
        <Button 
          onClick={() => setIsBountyModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Bounty
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-3">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${activeTab === tab 
                ? "bg-neutral-900 border border-neutral-800 text-purple-400 font-bold" 
                : "text-neutral-500 hover:text-neutral-300"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
        <Input 
          placeholder="Search active bounties..." 
          className="pl-9 bg-neutral-900 border-neutral-850 text-neutral-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table list */}
      <div className="overflow-x-auto rounded-lg border border-neutral-850 bg-neutral-900/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-850 bg-neutral-950/80 text-neutral-400 font-bold text-[10px] uppercase tracking-wider">
              <th className="p-4">Bounty Title / Repo</th>
              <th className="p-4">Funded Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Applicants</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {filteredBounties.map(b => (
              <tr key={b.id} className="hover:bg-neutral-900/40 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-neutral-200 text-sm">{b.title}</div>
                  <div className="text-[10px] text-neutral-500 mt-1">{b.repo} • created {b.createdAt}</div>
                </td>
                <td className="p-4 font-semibold text-green-400 text-sm">
                  ${b.amount}
                </td>
                <td className="p-4">
                  <Badge 
                    className={`
                      text-[9px] px-2 py-0.5 rounded-full font-semibold
                      ${b.status === "Open" && "bg-green-500/10 text-green-400 border border-green-500/20"}
                      ${b.status === "Claimed" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"}
                      ${b.status === "In Progress" && "bg-purple-500/10 text-purple-400 border border-purple-500/20"}
                      ${b.status === "Review Pending" && "bg-rose-500/10 text-rose-400 border border-rose-500/20"}
                      ${b.status === "Completed" && "bg-neutral-800 text-neutral-400 border border-neutral-700"}
                      ${b.status === "Cancelled" && "bg-neutral-950 text-neutral-600 border border-neutral-900"}
                    `}
                  >
                    {b.status}
                  </Badge>
                </td>
                <td className="p-4 text-neutral-300 font-medium">
                  {b.applicants} claims
                </td>
                <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                  {b.status !== "Completed" && b.status !== "Cancelled" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                        onClick={() => handleIncreaseReward(b.id)}
                      >
                        +$100
                      </Button>
                      
                      {b.status === "In Progress" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-800 text-neutral-400"
                          onClick={() => handleUpdateStatus(b.id, "Open")}
                        >
                          <Pause className="h-3 w-3 mr-1" /> Pause
                        </Button>
                      ) : b.status === "Open" ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-850 text-purple-400"
                          onClick={() => handleUpdateStatus(b.id, "In Progress")}
                        >
                          <Play className="h-3 w-3 mr-1" /> Start
                        </Button>
                      ) : null}

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-[10px] border-rose-900/30 text-rose-400 hover:bg-rose-500/10"
                        onClick={() => handleUpdateStatus(b.id, "Cancelled")}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> Close
                      </Button>
                    </>
                  )}
                  {b.status === "Completed" && (
                    <span className="text-neutral-500 text-[10px] font-medium flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Released
                    </span>
                  )}
                  {b.status === "Cancelled" && (
                    <span className="text-neutral-600 text-[10px] font-medium">Refunded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <FundBountyModal 
        isOpen={isBountyModalOpen}
        onClose={() => setIsBountyModalOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onSuccess={() => {
          setBounties([
            { id: (bounties.length + 1).toString(), title: "New AI Bounty", repo: "BountyForge", amount: 250, status: "Open", applicants: 0, createdAt: "Just now" },
            ...bounties
          ]);
        }}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
