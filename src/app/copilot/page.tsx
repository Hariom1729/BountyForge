import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BrainCircuit, Target, Code, TrendingUp, Zap } from "lucide-react";
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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center">
          <BrainCircuit className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">AI Career Copilot</h1>
          <p className="text-muted-foreground mt-1">Your personal mentor analyzing your code to help you grow and earn more.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500"/> Recommended Growth Path</CardTitle>
            <CardDescription>Based on your recent PRs, our AI suggests focusing on these areas to increase your earning potential.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 items-start p-4 bg-background rounded-lg border">
              <Code className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg">Master Rust Concurrency</h4>
                <p className="text-muted-foreground mt-1 mb-3">You've been claiming Python backend tasks. Rust bounties currently pay 40% more on average. Your background in concurrent systems makes this a smooth transition.</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">View Learning Path</Button>
                  <Button size="sm" variant="outline">Find Beginner Rust Bounties</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start p-4 bg-background rounded-lg border">
              <Zap className="w-8 h-8 text-yellow-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg">Improve Test Coverage</h4>
                <p className="text-muted-foreground mt-1 mb-3">Your last 3 PRs lacked unit tests, reducing your Reliability Score. Writing tests will boost your Reputation Rank from Bronze to Silver.</p>
                <Button size="sm" variant="outline">Review Testing Best Practices</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-500"/> Next Goal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 mx-auto border-4 border-muted rounded-full flex items-center justify-center mb-4 relative">
                <span className="font-bold text-xl">Silver</span>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-blue-500" strokeDasharray="289" strokeDashoffset="144" />
                </svg>
              </div>
              <p className="text-sm font-medium">50 Reputation Points to Silver Rank</p>
              <p className="text-xs text-muted-foreground mt-2">Unlocks higher-paying exclusive bounties.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500"/> Skill Market Trends</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Smart Contracts</span>
                <span className="text-green-500 font-bold">+120%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">React Native</span>
                <span className="text-green-500 font-bold">+45%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Data Engineering</span>
                <span className="text-green-500 font-bold">+20%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
