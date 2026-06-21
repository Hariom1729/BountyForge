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
    <main className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Discover top open source bounties. Solve issues, earn rewards, and build your reputation.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6 flex-shrink-0">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Filter className="w-4 h-4"/> Filters</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search issues..." className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Technology</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="All Tech" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="rust">Rust</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Any Difficulty" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reward Range</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Any Amount" /></SelectTrigger>
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
          <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg border">
            <div className="text-sm text-muted-foreground px-2">Showing {bounties.length} bounties</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px] h-8"><SelectValue /></SelectTrigger>
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
              <Card key={bounty.id} className="flex flex-col hover:border-blue-500/50 hover:shadow-lg transition-all group">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={bounty.issue.difficulty === "HARD" || bounty.issue.difficulty === "EXPERT" ? "destructive" : "secondary"}>
                      {bounty.issue.difficulty}
                    </Badge>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${bounty.amount}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {bounty.issue.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1"><Code2 className="w-3 h-3"/> {bounty.issue.repository.name}</span>
                    {bounty.issue.repository.organization && (
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {bounty.issue.repository.organization.name}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  {/* AI Match Score Mockup */}
                  <div className="bg-purple-500/10 text-purple-700 dark:text-purple-300 rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold">AI Match Score</span>
                    </div>
                    <span className="font-bold">{Math.floor(Math.random() * 30 + 70)}% Match</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bounty.issue.issueSkills.slice(0,3).map(is => (
                      <Badge key={is.skillId} variant="outline" className="bg-background">{is.skill.name}</Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t flex gap-3">
                  <Link href={`/bounties/${bounty.id}`} className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Claim Bounty</Button>
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
