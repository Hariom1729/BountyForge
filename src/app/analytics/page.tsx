import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [
    totalBounties,
    completedBounties,
    totalRevenue,
    activeContributors
  ] = await Promise.all([
    prisma.bounty.count(),
    prisma.bounty.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.user.count({ where: { role: "CONTRIBUTOR" } })
  ]);

  const leaderboard = await prisma.reputation.findMany({
    orderBy: { score: "desc" },
    take: 10,
    include: {
      user: { select: { name: true, image: true, githubId: true } },
    },
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bounties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBounties}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedBounties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalRevenue._sum.amount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeContributors}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Contributors (Leaderboard)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-muted-foreground w-4">{idx + 1}</span>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.user.image || undefined} />
                      <AvatarFallback>{entry.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{entry.user.name}</p>
                      <p className="text-xs text-muted-foreground">{entry.rank}</p>
                    </div>
                  </div>
                  <div className="font-bold text-green-600 dark:text-green-400">
                    {entry.score} pts
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="text-center text-muted-foreground">No data available yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
