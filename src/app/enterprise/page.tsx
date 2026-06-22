import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { FraudCheckButton } from "./FraudCheckButton";

export const dynamic = "force-dynamic";

export default async function EnterpriseDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/signin");
  }

  // Get active bounties for the organization (assuming the logged-in user is the org admin)
  const bounties = await prisma.bounty.findMany({
    where: { creatorId: session.user.id },
    include: {
      issue: { include: { repository: true } },
      claims: {
        include: { user: true, pullRequest: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Extract unique users who have claimed these bounties
  const applicantsMap = new Map();
  bounties.forEach(bounty => {
    bounty.claims.forEach(claim => {
      if (!applicantsMap.has(claim.userId)) {
        applicantsMap.set(claim.userId, claim.user);
      }
    });
  });
  const applicants = Array.from(applicantsMap.values());

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Enterprise Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your open source investments, recruit talent, and monitor platform security.
          </p>
        </div>
        <Link href="/bounties/create">
          <Button>Fund New Bounty</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Bounties */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Bounties</CardTitle>
              <CardDescription>Bounties funded by your organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bounties.length > 0 ? (
                bounties.map(bounty => (
                  <div key={bounty.id} className="flex flex-col p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{bounty.issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{bounty.issue.repository.name}</p>
                      </div>
                      <Badge variant={bounty.status === "OPEN" ? "default" : "secondary"}>
                        {bounty.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        Reward: ${bounty.amount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {bounty.claims.length} Applicants
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground mb-4">You haven't funded any bounties yet.</p>
                  <Link href="/bounties/create">
                    <Button variant="outline">Fund a Bounty</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Applicants & Risk */}
        <div className="space-y-6">
          <Card className="border-red-500/20 bg-red-50/20 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                🛡️ AI Risk Monitor
              </CardTitle>
              <CardDescription>AI-driven fraud detection for your talent pool.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {applicants.length > 0 ? (
                applicants.map(user => (
                  <div key={user.id} className="flex flex-col p-3 bg-background rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{user.githubId}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {user.fraudScore ? (
                        <Badge variant={user.fraudScore > 80 ? "destructive" : (user.fraudScore > 40 ? "secondary" : "default")}>
                          Risk Score: {user.fraudScore}/100
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Not Audited</Badge>
                      )}
                      
                      <FraudCheckButton userId={user.id} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-4">No applicants to monitor.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}
