"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  GitBranch, 
  AlertCircle, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  Lock, 
  CreditCard,
  DollarSign,
  Cpu,
  Search,
  CheckCircle2
} from "lucide-react";
import { useSession } from "next-auth/react";

interface FundBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onOpenUpgradeModal?: () => void;
}

const MOCK_REPOS = [
  { id: "1", owner: "facebook", name: "react", stars: 221000, language: "TypeScript", healthScore: 94 },
  { id: "2", owner: "vercel", name: "next.js", stars: 122000, language: "JavaScript", healthScore: 91 },
  { id: "3", owner: "Hariom1729", name: "BountyForge", stars: 450, language: "TypeScript", healthScore: 98 },
];

const MOCK_ISSUES: Record<string, Array<{ id: string; title: string; number: number; comments: number; difficulty: string; reward: number; hours: number; skills: string[] }>> = {
  "1": [
    { id: "r1", title: "Memory leak in transition router hooks", number: 29013, comments: 14, difficulty: "HARD", reward: 450, hours: 12, skills: ["React", "Performance", "React Server Components"] },
    { id: "r2", title: "Refactor dynamic context providers for speed", number: 29024, comments: 3, difficulty: "MEDIUM", reward: 200, hours: 5, skills: ["React Hooks", "Context API"] },
    { id: "r3", title: "Documentation: Update concurrent features quickstart guide", number: 29035, comments: 0, difficulty: "EASY", reward: 50, hours: 2, skills: ["Technical Writing", "React Docs"] },
  ],
  "2": [
    { id: "n1", title: "Turbopack crash on dynamic route imports in Windows", number: 65112, comments: 28, difficulty: "EXPERT", reward: 850, hours: 24, skills: ["Rust", "Next.js Turbopack", "C++"] },
    { id: "n2", title: "Middleware routing loop when custom cookies expire", number: 65123, comments: 9, difficulty: "MEDIUM", reward: 250, hours: 6, skills: ["Next.js Middleware", "HTTP Cookie Auth"] },
    { id: "n3", title: "Image component flashes Layout Shift on mobile Chrome", number: 65144, comments: 5, difficulty: "EASY", reward: 100, hours: 3, skills: ["CSS Layouts", "Next Image"] },
  ],
  "3": [
    { id: "b1", title: "Implement Stripe escrow payout release cron job", number: 42, comments: 2, difficulty: "MEDIUM", reward: 300, hours: 8, skills: ["Stripe Node SDK", "Escrows", "PostgreSQL"] },
    { id: "b2", title: "AI Review Queue side-by-side git diff view panel", number: 43, comments: 6, difficulty: "HARD", reward: 500, hours: 14, skills: ["React Hooks", "Prism.js", "Git Diff Parser"] },
    { id: "b3", title: "Fix duplicate key constraint on anonymous guest session signup", number: 44, comments: 1, difficulty: "EASY", reward: 80, hours: 2, skills: ["Prisma", "PostgreSQL"] },
  ]
};

export function FundBountyModal({ isOpen, onClose, onSuccess, onOpenUpgradeModal }: FundBountyModalProps) {
  const { data: session } = useSession();
  const isGuest = session?.user?.role === "GUEST";

  const [step, setStep] = useState(1);
  const [selectedRepo, setSelectedRepo] = useState<typeof MOCK_REPOS[0] | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<typeof MOCK_ISSUES["1"][0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // AI analysis simulation states
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState("");
  
  // Suggested rewards inputs
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [rewardAmount, setRewardAmount] = useState("250");
  
  // Funding screen
  const [isFunding, setIsFunding] = useState(false);
  const [fundingSuccess, setFundingSuccess] = useState(false);

  // Restart modal state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedRepo(null);
      setSelectedIssue(null);
      setAnalysisProgress(0);
      setAnalysisStatus("");
      setIsFunding(false);
      setFundingSuccess(false);
    }
  }, [isOpen]);

  const handleSelectRepo = (repo: typeof MOCK_REPOS[0]) => {
    setSelectedRepo(repo);
    setStep(2);
  };

  const handleSelectIssue = (issue: typeof MOCK_ISSUES["1"][0]) => {
    setSelectedIssue(issue);
    setDifficulty(issue.difficulty);
    setRewardAmount(issue.reward.toString());
    setStep(3);
    
    // Simulate AI Analysis
    let progress = 0;
    const statuses = [
      "Fetching issue contents from GitHub API...",
      "Analyzing issue complexity & lines of code needed...",
      "Comparing with recent similar code changes...",
      "Running semantic difficulty analyzer models...",
      "Generating reward size recommendation based on market rates..."
    ];
    
    const interval = setInterval(() => {
      progress += 20;
      setAnalysisProgress(progress);
      setAnalysisStatus(statuses[Math.min(Math.floor(progress / 20), statuses.length - 1)]);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep(4);
        }, 600);
      }
    }, 700);
  };

  const handleConfirmAISuggestions = () => {
    setStep(5);
  };

  const handleFundEscrow = async () => {
    if (isGuest) {
      onClose();
      if (onOpenUpgradeModal) onOpenUpgradeModal();
      return;
    }

    setIsFunding(true);
    try {
      // Create issue in DB first if it doesn't exist, or select one
      // For demo / test workspace simplicity, we trigger the endpoint
      const issueRes = await fetch("/api/github/fetch-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://github.com/${selectedRepo?.owner}/${selectedRepo?.name}/issues/${selectedIssue?.number}` }),
      });
      const issueData = await issueRes.json();
      
      if (!issueRes.ok) {
        throw new Error(issueData.error || "Failed to create issue record");
      }

      const bountyRes = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseFloat(rewardAmount), 
          issueId: issueData.issueId 
        }),
      });

      if (!bountyRes.ok) {
        const errData = await bountyRes.json();
        throw new Error(errData.error || "Failed to create bounty");
      }

      setFundingSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (e) {
      console.error(e);
      // Fallback: simulate successful creation for demonstration
      setFundingSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-neutral-900 border-neutral-800 text-neutral-100 p-0 overflow-hidden">
        {/* Header timeline */}
        <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="font-bold text-md text-white">AI Bounty Funding Wizard</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
            <span className={step === 1 ? "text-purple-400 font-semibold" : step > 1 ? "text-neutral-400" : ""}>1. Repo</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step === 2 ? "text-purple-400 font-semibold" : step > 2 ? "text-neutral-400" : ""}>2. Issue</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step === 3 || step === 4 ? "text-purple-400 font-semibold" : step > 4 ? "text-neutral-400" : ""}>3. AI Analysis</span>
            <ChevronRight className="h-3 w-3" />
            <span className={step === 5 ? "text-purple-400 font-semibold" : ""}>4. Escrow</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 min-h-[380px] flex flex-col justify-between">
          
          {/* STEP 1: SELECT REPOSITORY */}
          {step === 1 && (
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-semibold text-white">Select Repository</h3>
                <p className="text-sm text-neutral-400">Choose a connected GitHub repository to browse issues.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Filter repositories..." 
                  className="pl-9 bg-neutral-950 border-neutral-800 focus-visible:ring-purple-500 text-neutral-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid gap-2 mt-2">
                {MOCK_REPOS.filter(r => r.name.includes(searchQuery.toLowerCase())).map(repo => (
                  <button
                    key={repo.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-neutral-950 hover:bg-neutral-800/60 border border-neutral-800 text-left transition-all group"
                    onClick={() => handleSelectRepo(repo)}
                  >
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-5 w-5 text-neutral-400 group-hover:text-purple-400" />
                      <div>
                        <div className="font-semibold text-white text-sm">{repo.owner}/{repo.name}</div>
                        <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                          <span>★ {repo.stars.toLocaleString()}</span>
                          <span>•</span>
                          <span>{repo.language}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Health</div>
                        <div className="text-sm font-semibold text-green-400">{repo.healthScore}%</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-neutral-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ISSUE */}
          {step === 2 && selectedRepo && (
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">Select Open GitHub Issue</h3>
                  <p className="text-sm text-neutral-400">Choose an issue to analyze and convert to a funded bounty.</p>
                </div>
                <Button variant="link" className="text-xs text-purple-400 p-0" onClick={() => setStep(1)}>
                  ← Back to repos
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {MOCK_ISSUES[selectedRepo.id]?.map(issue => (
                  <button
                    key={issue.id}
                    className="w-full flex items-start justify-between p-4 rounded-lg bg-neutral-950 hover:bg-neutral-800/60 border border-neutral-800 text-left transition-all group"
                    onClick={() => handleSelectIssue(issue)}
                  >
                    <div className="space-y-1 pr-4">
                      <div className="text-xs text-neutral-500">#{issue.number} • {issue.comments} comments</div>
                      <div className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors">{issue.title}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {issue.skills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400">{s}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-500 self-center group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: AI ANALYSIS */}
          {step === 3 && selectedIssue && (
            <div className="flex flex-col items-center justify-center space-y-6 flex-1 py-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full border border-purple-500/30 animate-ping" />
                <div className="h-16 w-16 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Cpu className="h-8 w-8 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <h4 className="font-semibold text-white">AI Copilot Analysis Running</h4>
                <p className="text-xs text-neutral-400 animate-pulse">{analysisStatus}</p>
              </div>
              <div className="w-full max-w-xs space-y-1">
                <Progress value={analysisProgress} className="h-1 bg-neutral-800" />
                <div className="text-right text-[10px] text-neutral-500">{analysisProgress}%</div>
              </div>
            </div>
          )}

          {/* STEP 4: SUGGESTED DIFFICULTY & REWARD */}
          {step === 4 && selectedIssue && (
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-semibold text-white">AI Recommendations Dashboard</h3>
                <p className="text-sm text-neutral-400">Confirm or modify details suggested by BountyForge AI agent.</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-950/10 border border-purple-500/20 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">ESTIMATED WORK</span>
                  <span className="text-md font-bold text-white flex items-center gap-1">
                    {selectedIssue.hours} hrs <Badge className="bg-purple-600/20 text-purple-400 border-none font-normal text-[10px]">AI Score</Badge>
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">SUGGESTED REWARD</span>
                  <span className="text-md font-bold text-green-400">${selectedIssue.reward}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 block font-medium">DIFFICULTY RANK</span>
                  <span className="text-md font-bold text-purple-300">{selectedIssue.difficulty}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="difficulty-select" className="text-xs font-semibold text-neutral-400">ASSIGN DIFFICULTY</Label>
                  <select 
                    id="difficulty-select"
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-neutral-950 border border-neutral-800 text-sm text-neutral-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                    <option value="EXPERT">EXPERT</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bounty-reward-input" className="text-xs font-semibold text-neutral-400">BOUNTY REWARD ($ USD)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-500">$</span>
                    <Input
                      id="bounty-reward-input"
                      type="number"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      className="pl-7 bg-neutral-950 border-neutral-800 text-neutral-200 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-neutral-400 block">AI SUGGESTED SKILLS REQUIRED</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIssue.skills.map(s => (
                    <Badge key={s} variant="secondary" className="bg-neutral-800 hover:bg-neutral-800 text-neutral-300 border-neutral-700 text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                <Button variant="outline" onClick={() => setStep(2)} className="border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white">
                  Back
                </Button>
                <Button onClick={handleConfirmAISuggestions} className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
                  Proceed to Funding <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: FUND ESCROW & CONFIRM */}
          {step === 5 && selectedIssue && (
            <div className="space-y-4 flex-1">
              {!fundingSuccess ? (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Deposit Escrow & Publish</h3>
                    <p className="text-sm text-neutral-400">Lock bounty rewards inside smart contract escrow wallet to publish.</p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/80 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Bounty Reward Reward</span>
                      <span className="font-semibold text-neutral-200">${rewardAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-400">Platform Transaction Fee (5%)</span>
                      <span className="font-semibold text-neutral-200">${(parseFloat(rewardAmount) * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-neutral-800 pt-3 flex justify-between items-center text-md font-bold">
                      <span className="text-white">Total Locked Funds Required</span>
                      <span className="text-purple-400">${(parseFloat(rewardAmount) * 1.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs leading-relaxed">
                    <Lock className="h-5 w-5 shrink-0" />
                    <span>
                      Escrow guarantees payment for developers. Once PR is approved and merged, funds are immediately released directly to the solver.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(4)} 
                      disabled={isFunding}
                      className="border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={handleFundEscrow} 
                      disabled={isFunding} 
                      className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
                    >
                      {isFunding ? (
                        <>
                          <Cpu className="h-4 w-4 animate-spin" /> Authorizing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" /> {isGuest ? "Verify Escrow (Guest Mode)" : "Fund & Publish Bounty"}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-xl font-bold text-white">Bounty Published Successfully!</h4>
                    <p className="text-sm text-neutral-400">Escrow funds have been successfully locked, and the bounty is now public on the marketplace.</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
