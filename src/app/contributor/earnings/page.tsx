import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
        <p className="text-muted-foreground mt-1">Track your income, view transaction history, and withdraw funds.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-green-700 dark:text-green-400">Total Earnings</CardDescription>
            <CardTitle className="text-4xl text-green-600">$0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600/80">Lifetime payouts from merged PRs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available to Withdraw</CardDescription>
            <CardTitle className="text-4xl">$0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mt-2" disabled={!session.user.githubConnected}>Withdraw Funds</Button>
            {!session.user.githubConnected && <p className="text-xs text-red-500 text-center mt-2">Connect GitHub to withdraw</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Escrow</CardDescription>
            <CardTitle className="text-4xl text-muted-foreground">$0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Waiting for PR review and approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowDownLeft className="w-5 h-5 text-green-500"/> Incoming Transactions</CardTitle>
            <CardDescription>Rewards deposited into your wallet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/10">
              <Wallet className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No incoming transactions yet.</p>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowUpRight className="w-5 h-5 text-blue-500"/> Withdrawal History</CardTitle>
            <CardDescription>Funds transferred out of your wallet.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 border border-dashed rounded-lg bg-muted/10">
              <Clock className="w-10 h-10 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No withdrawals yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
