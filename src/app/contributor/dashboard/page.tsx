import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Trophy, Code, Github } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContributorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // Get user claims
  const claims = await prisma.claim.findMany({
    where: { userId: session.user.id },
    include: {
      bounty: { include: { issue: { include: { repository: true } } } },
      pullRequest: true
    },
    orderBy: { claimedAt: "desc" },
    take: 5
  });

  const rep = await prisma.reputation.findUnique({
    where: { userId: session.user.id }
  });

  const activeClaims = claims.filter(c => c.status === "PENDING" || c.status === "ACCEPTED");

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contributor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your bounties, manage PRs, and build your reputation.</p>
        </div>
        <Link href="/bounties">
          <Button className="bg-blue-600 hover:bg-blue-700">Find Bounties</Button>
        </Link>
      </div>

      {!session.user.githubConnected && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Github className="w-8 h-8 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400">GitHub Not Connected</h3>
                <p className="text-red-600/80 dark:text-red-400/80 mt-1">
                  You are browsing as a guest via Google. Connect your GitHub account to participate, claim bounties, and submit PRs.
                </p>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="destructive">Connect GitHub</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Claims</CardDescription>
            <CardTitle className="text-2xl">{activeClaims.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reputation Score</CardDescription>
            <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">{rep?.score || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Rank</CardDescription>
            <CardTitle className="text-xl">{rep?.rank || "Bronze Developer"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            {/* Mock total earnings since we don't have a payout sum setup yet */}
            <CardTitle className="text-2xl text-green-600">$0</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Claims */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {claims.length > 0 ? (
                claims.map(claim => (
                  <div key={claim.id} className="flex flex-col p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{claim.bounty.issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{claim.bounty.issue.repository.name}</p>
                      </div>
                      <Badge variant={
                        claim.status === "PENDING" ? "secondary" : 
                        claim.status === "ACCEPTED" ? "default" : "destructive"
                      }>
                        {claim.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        Reward: ${claim.bounty.amount}
                      </div>
                      <div className="flex gap-2">
                        {claim.pullRequest && (
                          <Badge variant="outline" className="text-purple-600 border-purple-200">
                            PR Submitted
                          </Badge>
                        )}
                        <Link href={`/bounties/${claim.bounty.issueId}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">You haven't claimed any bounties yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Suggestions */}
        <div className="space-y-6">
          <Card className="border-purple-500/20 bg-purple-50/20 dark:bg-purple-900/10">
            <CardHeader>
              <CardTitle className="text-purple-700 dark:text-purple-400 flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">PRs Merged</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Code Quality Avg</span>
                <span className="font-medium text-green-600">N/A</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Security Score</span>
                <span className="font-medium text-green-600">N/A</span>
              </div>
              
              <div className="pt-4 mt-4 border-t border-dashed">
                <Link href="/copilot">
                  <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                    <Code className="w-4 h-4" /> AI Career Copilot
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
