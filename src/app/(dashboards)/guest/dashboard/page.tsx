"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthGuard } from "@/components/auth-guard";
import { ShieldAlert, Telescope, Zap, Trophy, Briefcase } from "lucide-react";
import Link from "next/link";

export default function GuestDashboardPage() {
  const { requireAuth } = useAuthGuard();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest Explorer Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            You are currently viewing BountyForge in Guest Mode. Explore the platform's capabilities before signing up.
          </p>
        </div>
        <Button onClick={() => requireAuth(() => {})} className="gap-2" variant="default">
          <ShieldAlert className="w-4 h-4" />
          Upgrade to Full Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bounties Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150+</div>
            <p className="text-xs text-muted-foreground mt-1">Available to claim</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$125,000+</div>
            <p className="text-xs text-muted-foreground mt-1">To contributors globally</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Jobs Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,000+</div>
            <p className="text-xs text-muted-foreground mt-1">Building reputation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-500/20 shadow-lg shadow-blue-500/5">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <Telescope className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle>Explore the Marketplace</CardTitle>
            <CardDescription>
              Browse real bounties, issues, and repositories. You have full read access to see what's available to work on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/marketplace">
              <Button variant="secondary" className="w-full">Go to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 shadow-lg shadow-purple-500/5">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <CardTitle>See How Actions Work</CardTitle>
            <CardDescription>
              Try clicking "Claim Bounty" or "Apply for Job" anywhere on the platform to see the Action Guard in effect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => requireAuth(() => {})}>
              Test Action Guard Modal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
