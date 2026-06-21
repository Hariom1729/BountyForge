import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderGit2, Users, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MaintainerBountiesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const bounties = await prisma.bounty.findMany({
    where: { creatorId: session.user.id },
    include: {
      issue: { include: { repository: true } },
      _count: { select: { claims: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Bounties</h1>
          <p className="text-muted-foreground mt-1">Track issues you've funded and monitor contributor progress.</p>
        </div>
        <Link href="/bounties/create">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Fund New Issue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <Card key={bounty.id} className="flex flex-col">
            <CardHeader className="pb-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={bounty.status === "OPEN" ? "default" : bounty.status === "CLAIMED" ? "secondary" : "outline"}>
                  {bounty.status}
                </Badge>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${bounty.amount}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg line-clamp-2">{bounty.issue.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span className="truncate">{bounty.issue.repository.name}</span>
                <span>•</span>
                <span>Issue #{bounty.issue.githubIssueId}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Claims</span>
                </div>
                <span className="font-bold">{bounty._count.claims}</span>
              </div>
              
              {bounty.status === "CLAIMED" && (
                <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 p-3 rounded text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>A contributor is currently working on this. Expect a PR soon!</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-4 border-t flex gap-3 bg-muted/20">
              <Link href={`/bounties/${bounty.id}`} className="flex-1">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {bounties.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <FolderGit2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-medium mb-2">No Bounties Created</h3>
            <p className="mb-6">You haven't funded any issues yet.</p>
            <Link href="/bounties/create">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Create First Bounty</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
