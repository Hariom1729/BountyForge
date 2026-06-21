import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      reputation: true,
      claims: {
        where: { status: "ACCEPTED" },
        include: {
          bounty: {
            include: { issue: { include: { repository: true } } },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const score = user.reputation?.score || 0;
  const rank = user.reputation?.rank || "Bronze Developer";
  const badges = user.reputation?.badges || [];
  
  // Calculate progress to next rank (Rough estimate)
  const nextRankThreshold = score < 100 ? 100 : score < 500 ? 500 : score < 1000 ? 1000 : score < 5000 ? 5000 : 10000;
  const progressPercent = Math.min((score / nextRankThreshold) * 100, 100);

  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Sidebar - Profile Overview */}
        <div className="space-y-6">
          <Card className="text-center overflow-hidden border-t-4 border-t-purple-500">
            <CardContent className="pt-8 pb-8">
              <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-background shadow-xl">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-4xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.githubId}</p>
              
              <div className="mt-6 flex flex-col items-center">
                <Badge variant="secondary" className="px-4 py-1 text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  {rank}
                </Badge>
                
                <div className="w-full mt-6 space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total XP</span>
                    <span className="font-bold">{score} XP</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{nextRankThreshold - score} XP to next rank</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Badges ({badges.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {badges.map(badge => (
                    <Badge key={badge} variant="outline" className="px-3 py-1 bg-amber-100/50 border-amber-300 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700">
                      🏆 {badge}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No badges earned yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Activity */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Bounties ({user.claims.length})</CardTitle>
              <CardDescription>Bounties successfully completed and merged.</CardDescription>
            </CardHeader>
            <CardContent>
              {user.claims.length > 0 ? (
                <div className="space-y-4">
                  {user.claims.map(claim => (
                    <div key={claim.id} className="flex justify-between items-center p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium line-clamp-1">{claim.bounty.issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{claim.bounty.issue.repository.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 dark:text-green-400 font-bold">+${claim.bounty.amount}</span>
                        <p className="text-xs text-muted-foreground">{new Date(claim.claimedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">This developer hasn't completed any bounties yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  );
}
