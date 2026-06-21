import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GitPullRequest, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClaimsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const claims = await prisma.claim.findMany({
    where: { userId: session.user.id },
    include: {
      bounty: { include: { issue: { include: { repository: true } } } },
      pullRequest: true
    },
    orderBy: { claimedAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Claims</h1>
        <p className="text-muted-foreground mt-1">Track the bounties you are currently working on and submit PRs for review.</p>
      </div>

      <div className="space-y-6">
        {claims.length > 0 ? claims.map(claim => (
          <Card key={claim.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Info */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{claim.bounty.issue.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{claim.bounty.issue.repository.name}</span>
                      <span>•</span>
                      <span>Issue #{claim.bounty.issue.githubIssueId}</span>
                    </div>
                  </div>
                  <Badge variant={claim.status === "PENDING" ? "secondary" : "default"}>{claim.status}</Badge>
                </div>
                
                <div className="flex gap-6 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reward</p>
                    <p className="font-semibold text-green-600">${claim.bounty.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Claimed On</p>
                    <p className="font-semibold">{new Date(claim.claimedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Days Remaining</p>
                    <p className="font-semibold text-amber-600">3 Days</p>
                  </div>
                </div>
              </div>

              {/* Right Side: PR Action */}
              <div className="p-6 w-full md:w-96 bg-muted/20 flex flex-col justify-center">
                {claim.pullRequest ? (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-full">
                      {claim.pullRequest.status === "APPROVED" ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">PR Submitted</h4>
                      <p className="text-sm text-muted-foreground mt-1">Status: {claim.pullRequest.status}</p>
                    </div>
                    <Link href={claim.pullRequest.githubPrId} target="_blank" className="text-blue-600 text-sm flex items-center justify-center gap-1 hover:underline">
                      View PR on GitHub <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <GitPullRequest className="w-4 h-4" /> Submit Work
                      </h4>
                      <p className="text-sm text-muted-foreground">Paste your Pull Request URL below to trigger an AI review.</p>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="https://github.com/..." className="flex-1" disabled={!session.user.githubConnected} />
                      <Button disabled={!session.user.githubConnected}>Submit</Button>
                    </div>
                    {!session.user.githubConnected && (
                      <p className="text-xs text-red-500">You must connect GitHub in Settings to submit PRs.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )) : (
          <Card>
            <CardContent className="text-center py-16">
              <GitPullRequest className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Claims</h3>
              <p className="text-muted-foreground mb-6">You haven't claimed any bounties yet. Head over to the Marketplace to find work.</p>
              <Link href="/bounties">
                <Button>Browse Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
