import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, ShieldCheck, Code2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReputationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const rep = await prisma.reputation.findUnique({
    where: { userId: session.user.id }
  });

  const score = rep?.score || 0;
  const rank = rep?.rank || "Unranked";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">On-Chain Reputation</h1>
        <p className="text-muted-foreground mt-1">Your verifiable developer identity based on actual code contributions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
          <CardHeader className="text-center pb-2">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="text-5xl font-extrabold text-yellow-600 dark:text-yellow-500">{score}</CardTitle>
            <CardDescription className="text-lg font-medium text-yellow-700 dark:text-yellow-400 mt-2">Reputation Score</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 font-semibold text-sm">
              Current Rank: {rank}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Top 15% of Contributors</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>How your AI-verified score is calculated based on your PRs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium"><Code2 className="w-4 h-4 text-blue-500"/> Code Quality</span>
                <span className="text-sm text-muted-foreground">0 / 100</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium"><ShieldCheck className="w-4 h-4 text-green-500"/> Security Practices</span>
                <span className="text-sm text-muted-foreground">0 / 100</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2 font-medium"><Clock className="w-4 h-4 text-purple-500"/> Reliability & Speed</span>
                <span className="text-sm text-muted-foreground">0 / 100</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500"/> Recent Endorsements</CardTitle>
          <CardDescription>Badges and endorsements earned from Maintainers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 border border-dashed rounded-lg bg-muted/10">
            <p className="text-muted-foreground">No endorsements yet. Complete bounties to earn them.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
