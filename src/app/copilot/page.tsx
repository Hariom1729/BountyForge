import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CopilotPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      reputation: true,
      claims: {
        include: { pullRequest: true }
      }
    }
  });

  if (!user) {
    redirect("/");
  }

  // Get some open bounties for recommendations
  const recommendedBounties = await prisma.bounty.findMany({
    where: { status: "OPEN" },
    include: { issue: { include: { repository: true } } },
    take: 3,
  });

  // Get some jobs
  const recommendedJobs = await prisma.jobPost.findMany({
    where: { status: "OPEN" },
    include: { organization: true },
    take: 2,
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            AI Career Copilot
          </h1>
          <p className="text-muted-foreground mt-2">
            Your personalized guide to growing your open source career.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          📄 Generate OSS Resume
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & PR Reviews */}
        <div className="space-y-6">
          <Card className="border-purple-500/30 bg-purple-50/30 dark:bg-purple-900/10">
            <CardHeader>
              <CardTitle>Your Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {user.reputation?.rank || "Bronze Developer"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.reputation?.score || 0} Total XP
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent AI Code Reviews</CardTitle>
              <CardDescription>Automated feedback on your PRs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.claims.filter(c => c.pullRequest).length > 0 ? (
                user.claims.filter(c => c.pullRequest).slice(0, 3).map((claim) => (
                  <div key={claim.id} className="p-3 bg-muted/30 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">PR: {claim.pullRequest?.githubPrId}</span>
                      <Badge variant={claim.pullRequest?.securityScore && claim.pullRequest.securityScore > 80 ? "default" : "destructive"}>
                        Security: {claim.pullRequest?.securityScore || "N/A"}/100
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {claim.pullRequest?.aiReviewSummary || "Pending AI Review..."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No PRs reviewed yet. Submit code to get AI feedback!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Bounties</CardTitle>
              <CardDescription>Hand-picked for your skill level.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedBounties.map(bounty => (
                <div key={bounty.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400">
                      ${bounty.amount} - {bounty.issue.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{bounty.issue.repository.name}</p>
                  </div>
                  <Link href={`/bounties/${bounty.id}`}>
                    <Button size="sm">View Bounty</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Full-Time Roles</CardTitle>
              <CardDescription>Companies looking for your exact OSS experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs.map(job => (
                <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.organization.name}</p>
                  </div>
                  <Link href={`/jobs`}>
                    <Button size="sm" variant="outline">Apply Now</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

      </div>
    </main>
  );
}
