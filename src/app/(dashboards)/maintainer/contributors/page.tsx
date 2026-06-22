"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Sparkles, 
  UserPlus, 
  Ban, 
  Star, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  Crown
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface ContributorItem {
  id: string;
  name: string;
  avatar: string;
  reputation: number;
  rank: string;
  successRate: number;
  completionTime: string;
  skills: string[];
  leaderboardPos: number;
  status: "Active" | "Shortlisted" | "Blocked" | "Available";
}

const INITIAL_CONTRIBUTORS: ContributorItem[] = [
  { id: "1", name: "Hariom1729", avatar: "", reputation: 2450, rank: "Gold Developer", successRate: 98, completionTime: "1.2 days", skills: ["React", "TypeScript", "Performance Tuning"], leaderboardPos: 1, status: "Shortlisted" },
  { id: "2", name: "alex_coder", avatar: "", reputation: 1820, rank: "Silver Developer", successRate: 94, completionTime: "2.4 days", skills: ["Next.js", "Node.js", "PostgreSQL"], leaderboardPos: 5, status: "Active" },
  { id: "3", name: "sarah_eng", avatar: "", reputation: 1540, rank: "Silver Developer", successRate: 91, completionTime: "3.1 days", skills: ["Rust", "Wasm", "React"], leaderboardPos: 12, status: "Available" },
  { id: "4", name: "spam_bot_user", avatar: "", reputation: 45, rank: "Bronze Developer", successRate: 10, completionTime: "8.5 days", skills: ["HTML", "CSS"], leaderboardPos: 320, status: "Blocked" },
];

export default function ContributorsPage() {
  const { data: session } = useSession();
  const [contributors, setContributors] = useState<ContributorItem[]>(INITIAL_CONTRIBUTORS);
  const [search, setSearch] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleUpdateStatus = (id: string, newStatus: ContributorItem["status"]) => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setContributors(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contributor Workspace</h1>
          <p className="text-neutral-400 text-sm font-normal">Manage, recruit, and block global talent working on your codebases.</p>
        </div>
        <Button 
          onClick={() => {
            if (isGuest) setIsUpgradeModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" /> Invite Contributor
        </Button>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
        <Input 
          placeholder="Search contributors by name or skill..." 
          className="pl-9 bg-neutral-900 border-neutral-850 text-neutral-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contributors.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))).map(item => (
          <Card key={item.id} className="bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col justify-between">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-neutral-800">
                    <AvatarFallback className="bg-neutral-850 text-xs font-bold text-neutral-300">
                      {item.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                      {item.name}
                      {item.leaderboardPos <= 5 && <Crown className="h-3.5 w-3.5 text-amber-400 fill-amber-400/20" />}
                    </CardTitle>
                    <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-1.5">
                      <span>{item.rank}</span>
                      <span>•</span>
                      <span>Rank #{item.leaderboardPos}</span>
                    </div>
                  </div>
                </div>

                <Badge 
                  className={`
                    text-[9px] px-2 py-0.5 rounded-full font-semibold
                    ${item.status === "Shortlisted" && "bg-purple-500/10 text-purple-400 border border-purple-500/20"}
                    ${item.status === "Active" && "bg-green-500/10 text-green-400 border border-green-500/20"}
                    ${item.status === "Blocked" && "bg-red-500/10 text-red-400 border border-red-500/20"}
                    ${item.status === "Available" && "bg-neutral-800 text-neutral-400 border border-neutral-700"}
                  `}
                >
                  {item.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              
              {/* Trust/Reputation Stats */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-2.5 rounded-lg border border-neutral-855 text-center">
                <div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Reputation</div>
                  <div className="text-xs font-extrabold text-purple-400 mt-0.5 flex items-center justify-center gap-0.5">
                    <Star className="h-3.5 w-3.5 fill-purple-400/20" /> {item.reputation}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Success Rate</div>
                  <div className="text-xs font-extrabold text-green-400 mt-0.5 flex items-center justify-center gap-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {item.successRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Avg Speed</div>
                  <div className="text-xs font-extrabold text-white mt-0.5 flex items-center justify-center gap-0.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" /> {item.completionTime}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map(s => (
                    <Badge key={s} className="bg-neutral-950 hover:bg-neutral-950 border-neutral-850 text-[10px] text-neutral-300">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-3 border-t border-neutral-850 flex justify-end gap-2">
                {item.status !== "Blocked" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(item.id, "Blocked")}
                    className="h-7 text-[10px] border-red-950 text-red-400 hover:bg-red-500/10"
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" /> Block
                  </Button>
                )}
                {item.status === "Blocked" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(item.id, "Available")}
                    className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                  >
                    Unblock
                  </Button>
                )}
                {item.status !== "Shortlisted" && item.status !== "Blocked" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(item.id, "Shortlisted")}
                    className="h-7 text-[10px] border-purple-900/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Shortlist
                  </Button>
                )}
                {item.status === "Shortlisted" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleUpdateStatus(item.id, "Active")}
                    className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-800 text-neutral-300"
                  >
                    Active
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
