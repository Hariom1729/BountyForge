"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Search, 
  Sparkles, 
  Cpu, 
  DollarSign, 
  ShieldAlert, 
  Users, 
  ChevronRight, 
  Folder,
  Tag
} from "lucide-react";
import { useSession } from "next-auth/react";
import { FundBountyModal } from "@/components/features/FundBountyModal";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface IssueItem {
  id: string;
  title: string;
  number: number;
  repo: string;
  status: "Open" | "Bounty Active" | "Closed";
  comments: number;
  priority: "High" | "Medium" | "Low";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  aiSuggestedReward: number;
  aiSuggestedHours: number;
  aiSuggestedSkills: string[];
  body: string;
}

const MOCK_ISSUES: IssueItem[] = [
  { 
    id: "1", 
    title: "Memory leak in transition router hooks", 
    number: 29013, 
    repo: "facebook/react", 
    status: "Open", 
    comments: 14, 
    priority: "High", 
    difficulty: "HARD", 
    aiSuggestedReward: 450, 
    aiSuggestedHours: 12, 
    aiSuggestedSkills: ["React Hooks", "V8 Engine Profiling", "RSC"],
    body: "When navigating repeatedly between dynamic layouts using useTransition, heap allocation increases continuously. The heap snapshot shows multiple detached fibers retaining layout contexts..."
  },
  { 
    id: "2", 
    title: "Refactor dynamic context providers for speed", 
    number: 29024, 
    repo: "facebook/react", 
    status: "Bounty Active", 
    comments: 3, 
    priority: "Medium", 
    difficulty: "MEDIUM", 
    aiSuggestedReward: 200, 
    aiSuggestedHours: 5, 
    aiSuggestedSkills: ["React Context", "State Splitting"],
    body: "Currently the AppContext triggers full tree rerenders when only partial keys are updated. We need to split the provider or introduce state selector abstractions."
  },
  { 
    id: "3", 
    title: "Turbopack crash on dynamic route imports in Windows", 
    number: 65112, 
    repo: "vercel/next.js", 
    status: "Open", 
    comments: 28, 
    priority: "High", 
    difficulty: "EXPERT", 
    aiSuggestedReward: 850, 
    aiSuggestedHours: 24, 
    aiSuggestedSkills: ["Rust", "Next.js Turbopack compiler", "Windows FS Watcher"],
    body: "Compiling nested pages with dynamic routes causes absolute workspace path lengths to exceed Windows limits, causing the compiler process to panic with path-resolution issues."
  },
  { 
    id: "4", 
    title: "Fix duplicate key constraint on anonymous guest session signup", 
    number: 44, 
    repo: "Hariom1729/BountyForge", 
    status: "Open", 
    comments: 1, 
    priority: "Low", 
    difficulty: "EASY", 
    aiSuggestedReward: 80, 
    aiSuggestedHours: 2, 
    aiSuggestedSkills: ["Prisma Schema", "Unique Constraints"],
    body: "Prisma throws a unique constraint failure when creating guest accounts concurrently. We need to catch this error or use atomic counter seeds."
  }
];

export default function IssuesPage() {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<IssueItem[]>(MOCK_ISSUES);
  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(MOCK_ISSUES[0]);
  const [isBountyModalOpen, setIsBountyModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Issue Management</h1>
        <p className="text-neutral-400 text-sm">Convert open repository issues into funded bounties instantly with AI suggestions.</p>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: List of Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
            <Input 
              placeholder="Search issues by title or repo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-850 text-neutral-200"
            />
          </div>

          <div className="space-y-3">
            {issues.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.repo.toLowerCase().includes(search.toLowerCase())).map((issue) => (
              <button
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className={`
                  w-full flex items-start justify-between p-4 rounded-lg border text-left transition-all
                  ${selectedIssue?.id === issue.id 
                    ? "bg-neutral-900 border-purple-500/50 shadow-md shadow-purple-900/5" 
                    : "bg-neutral-900/60 border-neutral-850 hover:bg-neutral-900 hover:border-neutral-800"}
                `}
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <span className="font-semibold text-neutral-400">{issue.repo}</span>
                    <span>•</span>
                    <span>#{issue.number}</span>
                  </div>
                  <div className="font-semibold text-white text-sm">{issue.title}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={issue.status === "Bounty Active" ? "default" : "secondary"} className="text-[9px] px-1.5 py-0.5 rounded-full font-normal">
                      {issue.status}
                    </Badge>
                    <Badge className="text-[9px] px-1.5 py-0.5 rounded-full font-normal bg-neutral-800 border-neutral-700 text-neutral-400">
                      Priority: {issue.priority}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-500 self-center" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: AI Detail Sidepanel */}
        <div className="space-y-6">
          {selectedIssue ? (
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col justify-between min-h-[480px]">
              <CardHeader className="pb-4 border-b border-neutral-850">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Folder className="h-3.5 w-3.5" />
                  <span>{selectedIssue.repo}</span>
                  <span>•</span>
                  <span>Issue #{selectedIssue.number}</span>
                </div>
                <CardTitle className="text-md font-bold text-white mt-2 leading-snug">
                  {selectedIssue.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="destructive" className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                    Priority: {selectedIssue.priority}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="py-4 space-y-5 flex-1">
                {/* Description snippet */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Description</div>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-4">
                    {selectedIssue.body}
                  </p>
                </div>

                {/* AI Suggestions Box */}
                <div className="p-4 rounded-lg bg-purple-950/10 border border-purple-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Sparkles className="h-4 w-4" /> AI Difficulty & Reward Audit
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-neutral-500 block">Suggested Reward</span>
                      <span className="font-bold text-green-400 text-sm">${selectedIssue.aiSuggestedReward}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Suggested Difficulty</span>
                      <span className="font-bold text-purple-300 text-sm">{selectedIssue.difficulty}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Est. Resolution Time</span>
                      <span className="font-bold text-white text-sm">{selectedIssue.aiSuggestedHours} hours</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 block font-bold mb-1.5">AI SKILL RECOMMENDATIONS</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedIssue.aiSuggestedSkills.map(skill => (
                        <Badge key={skill} className="bg-neutral-800 border-neutral-700 hover:bg-neutral-850 text-[9px] text-neutral-300 font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 border-t border-neutral-850 bg-neutral-900/60">
                {selectedIssue.status === "Bounty Active" ? (
                  <Button className="w-full bg-neutral-800 text-neutral-400 font-semibold" disabled>
                    Bounty Already Active
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2"
                    onClick={() => {
                      if (isGuest) {
                        setIsUpgradeModalOpen(true);
                      } else {
                        setIsBountyModalOpen(true);
                      }
                    }}
                  >
                    <Cpu className="h-4 w-4" /> Create Bounty from Issue
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="text-center text-xs text-neutral-500 py-12">
              Select an issue from the list to analyze.
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      <FundBountyModal 
        isOpen={isBountyModalOpen}
        onClose={() => setIsBountyModalOpen(false)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        onSuccess={() => {
          // Update issue status to active
          if (selectedIssue) {
            setIssues(prev => prev.map(i => i.id === selectedIssue.id ? { ...i, status: "Bounty Active" } : i));
            setSelectedIssue(prev => prev ? { ...prev, status: "Bounty Active" } : null);
          }
        }}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
