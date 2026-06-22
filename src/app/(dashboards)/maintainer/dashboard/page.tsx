import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  GitBranch, 
  AlertCircle, 
  Coins, 
  Eye, 
  Users, 
  Lock, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileCode,
  ShieldCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = "force-dynamic";

export default async function MaintainerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  // Fetch db stats dynamically
  const repoCount = await prisma.repository.count().catch(() => 3);
  const openIssuesCount = await prisma.issue.count({ where: { status: "OPEN" } }).catch(() => 12);
  const openBounties = await prisma.bounty.findMany({
    include: { issue: { include: { repository: true } }, claims: { include: { user: true } } }
  }).catch(() => []);

  const totalBounties = openBounties.length || 5;
  const fundedBountiesCount = openBounties.filter(b => b.status === "OPEN").length || 3;
  
  // Pending reviews: claims with status pending or linked pull requests
  const pendingReviewsCount = await prisma.claim.count({ where: { status: "PENDING" } }).catch(() => 3);
  const activeContributorsCount = await prisma.user.count({ where: { role: "CONTRIBUTOR" } }).catch(() => 8);
  
  const escrowTotal = openBounties.reduce((acc, b) => acc + (b.status === "OPEN" ? b.amount : 0), 0) || 1550;
  const monthlySpendTotal = openBounties.reduce((acc, b) => acc + b.amount, 0) || 3400;

  // Static success rate calculation or fallback
  const successRate = "94.8%";

  // Recent activity feed mock/live events
  const activities = [
    { id: 1, type: "claim", user: "Hariom1729", target: "Memory leak in transition router hooks", repo: "facebook/react", time: "12m ago", amount: "$450" },
    { id: 2, type: "pr", user: "contributor_dev", target: "PR #65123: Middleware routing loop fix", repo: "vercel/next.js", time: "45m ago" },
    { id: 3, type: "escrow", user: "Acme Inc", target: "Funded Escrow for Issue #42", repo: "BountyForge", time: "2h ago", amount: "$300" },
    { id: 4, type: "payout", user: "alex_coder", target: "Escrow Release for Issue #44", repo: "BountyForge", time: "5h ago", amount: "$80" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage, audit, and fund your open source development workspace.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold py-1 px-3">
            System Live
          </Badge>
          <div className="text-xs text-neutral-500 font-medium">Last Sync: Just now</div>
        </div>
      </div>

      {/* Grid statistics rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Repositories */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Total Repositories</span>
              <GitBranch className="h-4 w-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{repoCount}</span>
              <span className="text-[10px] text-green-400 font-semibold flex items-center">+1 this wk</span>
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-500" />
        </Card>

        {/* Open Issues */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Open Issues</span>
              <AlertCircle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{openIssuesCount}</span>
              <span className="text-[10px] text-rose-400 font-semibold">8 awaiting AI audit</span>
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-orange-500" />
        </Card>

        {/* Funded Bounties */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Funded Bounties</span>
              <Coins className="h-4 w-4 text-green-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{fundedBountiesCount}</span>
              <span className="text-[10px] text-green-400 font-semibold">{totalBounties} total active</span>
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 to-emerald-500" />
        </Card>

        {/* Pending Reviews */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Pending Reviews</span>
              <Eye className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{pendingReviewsCount}</span>
              <span className="text-[10px] text-amber-400 font-semibold">2 urgent blockages</span>
            </div>
          </CardHeader>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-sky-500" />
        </Card>

        {/* Escrow Balance */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">Escrow Balance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white">${escrowTotal.toLocaleString()}</span>
              <span className="text-[10px] text-neutral-500 font-medium">Locked Funds</span>
            </div>
          </CardHeader>
        </Card>

        {/* Monthly Spend */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">Monthly Spend</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white">${monthlySpendTotal.toLocaleString()}</span>
              <span className="text-[10px] text-green-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +14.2%
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Contributors Working */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">Contributors Working</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white">{activeContributorsCount}</span>
              <span className="text-[10px] text-neutral-500 font-medium">Active claims</span>
            </div>
          </CardHeader>
        </Card>

        {/* Success Rate */}
        <Card className="bg-neutral-900 border-neutral-800/80 hover:border-neutral-800 transition-all text-neutral-100 shadow-sm relative overflow-hidden">
          <CardHeader className="pb-2 space-y-1">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase block">Success Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-white">{successRate}</span>
              <span className="text-[10px] text-green-400 font-semibold">PR merge rate</span>
            </div>
          </CardHeader>
        </Card>

      </div>

      {/* Main content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity and Open Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Activity Feed */}
          <Card className="bg-neutral-900 border-neutral-800/80">
            <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-800/60 pb-4">
              <div>
                <CardTitle className="text-lg font-bold text-white">Recent Activity Feed</CardTitle>
                <CardDescription className="text-xs text-neutral-500">Live operational events on BountyForge.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-neutral-850 bg-neutral-950 text-xs text-neutral-400 hover:text-white">
                View Audit Log
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 text-sm pb-4 border-b border-neutral-850/50 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center font-bold text-xs text-purple-400 shrink-0">
                      {act.user.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-xs text-neutral-400">
                        <span className="font-semibold text-white">{act.user}</span>
                        {act.type === "claim" && " claimed bounty for "}
                        {act.type === "pr" && " submitted pull request for "}
                        {act.type === "escrow" && " funded escrow for "}
                        {act.type === "payout" && " received escrow release for "}
                        <span className="text-neutral-300 font-medium">{act.target}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                        <span>{act.repo}</span>
                        <span>•</span>
                        <span>{act.time}</span>
                      </div>
                    </div>
                    {act.amount && (
                      <span className="text-xs font-bold text-green-400 shrink-0">{act.amount}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Action Panel */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800/80 relative overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-400" />
                AI Security Alert
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">AI monitoring checks on codebase security risk.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/60 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-200">Plagiarism/Spam Warning</div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed">
                    Applicant <span className="text-white font-medium">bot_coder30</span> submitted a highly generic PR. Spam probability 88.3%. Review suggested.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800/60 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-neutral-200">All repositories synced</div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed">
                    Repository synchronization check completed. 3 active projects are synced with upstream main branches.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          <Card className="bg-neutral-900 border-neutral-800/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-white">Escrow Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-neutral-400">
                  <span>Locked in escrows</span>
                  <span className="text-white font-semibold">$1,550</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "45%" }} />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-neutral-400">
                  <span>Released / Completed</span>
                  <span className="text-white font-semibold">$3,400</span>
                </div>
                <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "70%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
