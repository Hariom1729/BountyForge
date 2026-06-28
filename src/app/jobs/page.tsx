import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <main className="container mx-auto py-10 px-4 max-w-6xl relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Hiring Marketplace</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Top open source companies hiring contributors directly based on their reputation.
          </p>
        </div>
        <Link href="/jobs/create" className={cn(buttonVariants(), "h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/10 transition-transform duration-200 hover:scale-[1.02]")}>Post a Job</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col glass-card border border-white/10 rounded-2xl shadow-xl glow-hover transition-all overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs font-semibold">{job.type.replace("_", " ")}</Badge>
                {job.salaryMin && job.salaryMax && (
                  <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </span>
                )}
              </div>
              <CardTitle className="text-xl font-bold line-clamp-2 mt-2 group-hover:text-purple-400 transition-colors">{job.title}</CardTitle>
              <p className="text-sm font-semibold text-muted-foreground mt-1">
                {job.organization.name}
              </p>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {job.description}
              </p>
              {job.location && (
                <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground">
                  📍 {job.location}
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4 border-t border-white/5">
              <Button className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md border-0 transition-transform duration-200 hover:scale-[1.01]">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
        
        {jobs.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed rounded-2xl bg-white/5 border-white/10">
            <h3 className="text-xl font-bold mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground mb-6 text-base">Be the first to hire top open source talent.</p>
            <Link href="/jobs/create" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl border-purple-500/20 hover:bg-purple-500/10 text-purple-400")}>Post a Job</Link>
          </div>
        )}
      </div>
    </main>
  );
}
