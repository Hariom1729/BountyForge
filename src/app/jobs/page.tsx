import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.jobPost.findMany({
    where: { status: "OPEN" },
    include: {
      organization: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Hiring Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Top open source companies hiring contributors directly based on their reputation.
          </p>
        </div>
        <Link href="/jobs/create" className={buttonVariants()}>Post a Job</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary">{job.type.replace("_", " ")}</Badge>
                {job.salaryMin && job.salaryMax && (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </span>
                )}
              </div>
              <CardTitle className="text-xl line-clamp-2">{job.title}</CardTitle>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {job.organization.name}
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>
              {job.location && (
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  📍 {job.location}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
        
        {jobs.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-4">Be the first to hire top open source talent.</p>
            <Link href="/jobs/create" className={buttonVariants({ variant: "outline" })}>Post a Job</Link>
          </div>
        )}
      </div>
    </main>
  );
}
