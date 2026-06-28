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
    <main className="container mx-auto py-10 px-4 max-w-6xl relative">
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-10 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="glass-card border-white/10 rounded-2xl shadow-xl glow-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Bounties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{totalBounties}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 rounded-2xl shadow-xl glow-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{completedBounties}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 rounded-2xl shadow-xl glow-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">${totalRevenue._sum.amount || 0}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 rounded-2xl shadow-xl glow-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Active Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">{activeContributors}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border border-white/10 rounded-2xl shadow-xl col-span-full">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Top Contributors (Leaderboard)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-lg text-muted-foreground w-6 text-center">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                    </span>
                    <Avatar className="h-10 w-10 border border-white/10 shadow-sm">
                      <AvatarImage src={entry.user.image || undefined} />
                      <AvatarFallback className="font-bold bg-purple-500/10 text-purple-400">{entry.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground text-sm md:text-base">{entry.user.name}</p>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{entry.rank}</p>
                    </div>
                  </div>
                  <div className="font-black text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {entry.score} pts
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="text-center text-muted-foreground py-10 font-medium">No data available yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
