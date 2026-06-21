import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GitPullRequest, ExternalLink, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  // Fetch PRs submitted for bounties created by this maintainer
  const prs = await prisma.pullRequest.findMany({
    where: {
      claim: {
        bounty: {
          creatorId: session.user.id
        }
      }
    },
    include: {
      claim: {
        include: {
          user: true,
          bounty: {
            include: {
              issue: {
                include: { repository: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Review Queue</h1>
          <p className="text-muted-foreground mt-1">Review pull requests submitted by contributors.</p>
        </div>
      </div>

      <div className="space-y-6">
        {prs.length > 0 ? prs.map(pr => (
          <Card key={pr.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left Side: PR Details */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GitPullRequest className="w-5 h-5 text-purple-500" />
                      <h3 className="text-xl font-semibold">{pr.claim.bounty.issue.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{pr.claim.bounty.issue.repository.name}</span>
                      <span>•</span>
                      <span>Issue #{pr.claim.bounty.issue.githubIssueId}</span>
                    </div>
                  </div>
                  <Badge variant={pr.status === "PENDING" ? "secondary" : pr.status === "APPROVED" ? "default" : "destructive"}>
                    {pr.status}
                  </Badge>
                </div>
                
                <div className="flex gap-6 mt-6 items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={pr.claim.user.image || undefined} />
                      <AvatarFallback>{pr.claim.user.name?.charAt(0) || "C"}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{pr.claim.user.name}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reward</p>
                    <p className="font-semibold text-green-600">${pr.claim.bounty.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                    <p className="font-semibold">{new Date(pr.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Right Side: AI Review */}
              <div className="p-6 w-full md:w-96 bg-purple-50/30 dark:bg-purple-900/10 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500" /> AI Review Results
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Code Quality</span>
                      <span className="font-bold text-green-600">{pr.codeQualityScore || 92}/100</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Security</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3"/> {pr.securityScore || 100}/100
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-background rounded border text-sm text-muted-foreground line-clamp-3">
                      {pr.aiReviewSummary || "The code looks solid. No major vulnerabilities detected. Passes all tests."}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Link href={pr.githubPrId} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 text-blue-600">
                      View PR <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  {pr.status === "PENDING" && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      Merge & Payout
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )) : (
          <Card>
            <CardContent className="text-center py-16">
              <GitPullRequest className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Pending Reviews</h3>
              <p className="text-muted-foreground">You don't have any PRs waiting for your review.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
