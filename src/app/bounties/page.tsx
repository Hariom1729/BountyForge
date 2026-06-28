import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sparkles, Filter, Code2, Building2, TrendingUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function BountiesPage() {
  const bounties = await prisma.bounty.findMany({
    where: { status: { in: ["OPEN", "CLAIMED"] } },
    include: {
      issue: {
        include: { repository: { include: { organization: true } }, issueSkills: { include: { skill: true } } },
      },
      creator: { select: { name: true, image: true } },
      _count: { select: { claims: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-7xl relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Marketplace</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover top open source bounties. Solve issues, earn rewards, and build your reputation.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-68 space-y-6 flex-shrink-0 glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <div className="space-y-5">
            <h3 className="font-bold text-lg flex items-center gap-2 text-indigo-400"><Filter className="w-4 h-4"/> Filters</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search issues..." className="pl-9 h-10 rounded-xl bg-white/5 border-white/10 focus-visible:ring-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Technology</label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-white/5 border-white/10"><SelectValue placeholder="All Tech" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Difficulty</label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-white/5 border-white/10"><SelectValue placeholder="Any Difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80">Reward Range</label>
              <Select>
                <SelectTrigger className="h-10 rounded-xl bg-white/5 border-white/10"><SelectValue placeholder="Any Amount" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="50to200">$50 - $200</SelectItem>
                  <SelectItem value="over200">Over $200</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center bg-white/5 dark:bg-black/20 p-3 rounded-2xl border border-white/10">
            <div className="text-sm font-medium text-muted-foreground px-2">Showing {bounties.length} bounties</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] h-9 rounded-xl bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="highest_paying">Highest Paying</SelectItem>
                  <SelectItem value="recommended">Recommended (AI)</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bounties.map((bounty) => (
              <Card key={bounty.id} className="flex flex-col glass-card border border-white/10 rounded-2xl shadow-xl glow-hover transition-all group overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={bounty.issue.difficulty === "HARD" || bounty.issue.difficulty === "EXPERT" ? "destructive" : "secondary"} className="rounded-full px-3 py-1">
                      {bounty.issue.difficulty}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        ${bounty.amount}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-xl font-bold line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {bounty.issue.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm"><Code2 className="w-4 h-4 text-muted-foreground"/> {bounty.issue.repository.name}</span>
                    {bounty.issue.repository.organization && (
                      <span className="flex items-center gap-1.5 text-sm"><Building2 className="w-4 h-4 text-muted-foreground"/> {bounty.issue.repository.organization.name}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  {/* AI Match Score Mockup */}
                  <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl p-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-bold">AI Match Score</span>
                    </div>
                    <span className="font-extrabold text-sm text-purple-300">{Math.floor(Math.random() * 30 + 70)}% Match</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bounty.issue.issueSkills.slice(0,3).map(is => (
                      <Badge key={is.skillId} variant="outline" className="bg-white/5 border-white/10 rounded-full px-2.5 py-0.5 text-xs text-muted-foreground">{is.skill.name}</Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-white/5 flex gap-3">
                  <Link href={`/bounties/${bounty.id}`} className="flex-1">
                    <Button className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/10 border-0 transition-transform duration-200 hover:scale-[1.01]">Claim Bounty</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
            {bounties.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                <Search className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">No bounties found</h3>
                <p>Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
