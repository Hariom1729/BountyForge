import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function BountiesPage() {
  const bounties = await prisma.bounty.findMany({
    where: { status: { in: ["OPEN", "CLAIMED"] } },
    include: {
      issue: {
        include: { repository: true },
      },
      creator: { select: { name: true, image: true } },
      _count: { select: { claims: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Active Bounties</h1>
          <p className="text-muted-foreground mt-2">
            Browse and claim open source bounties to earn rewards and reputation.
          </p>
        </div>
        <Button>Create Bounty</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bounties.map((bounty) => (
          <Card key={bounty.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={bounty.status === "OPEN" ? "default" : "secondary"}>
                  {bounty.status}
                </Badge>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${bounty.amount}
                </span>
              </div>
              <CardTitle className="mt-4 text-xl line-clamp-2">
                {bounty.issue.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span className="truncate">{bounty.issue.repository.name}</span>
                <span>•</span>
                <span>Issue #{bounty.issue.githubIssueId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{bounty.issue.difficulty}</Badge>
                <Badge variant="outline">{bounty._count.claims} claims</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bounty.creator.image || undefined} />
                  <AvatarFallback>{bounty.creator.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  By {bounty.creator.name}
                </span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
        {bounties.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No active bounties found. Be the first to create one!
          </div>
        )}
      </div>
    </main>
  );
}
