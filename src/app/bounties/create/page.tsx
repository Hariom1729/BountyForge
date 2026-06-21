"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

export default function CreateBountyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<{ id: string; title: string; repository: string; number: number } | null>(null);
  const [error, setError] = useState("");

  const handleFetchIssue = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/github/fetch-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch issue");
      
      setIssue({
        id: data.issueId,
        title: data.title,
        repository: data.repository,
        number: data.number,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFundBounty = async () => {
    if (!issue || !amount) return;
    setLoading(true);
    setError("");

    try {
      // DEMO MODE: Bypass Razorpay for testing purposes and directly create the bounty
      const bountyRes = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), issueId: issue.id }),
      });
      
      const data = await bountyRes.json();
      if (!bountyRes.ok) throw new Error(data.error || "Failed to create bounty record");
      
      // Redirect to dashboard
      router.push("/bounties");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 max-w-2xl">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create a Bounty</CardTitle>
          <CardDescription>
            Fund an open source issue. The funds will be held in escrow until the pull request is merged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="url">GitHub Issue URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://github.com/facebook/react/issues/123"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={!!issue || loading}
              />
              {!issue && (
                <Button onClick={handleFetchIssue} disabled={!url || loading}>
                  {loading ? "Fetching..." : "Verify"}
                </Button>
              )}
            </div>
          </div>

          {issue && (
            <div className="bg-muted p-4 rounded-md border space-y-2">
              <div className="text-sm text-muted-foreground">{issue.repository} • Issue #{issue.number}</div>
              <div className="font-medium text-lg">{issue.title}</div>
              <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setIssue(null)}>
                Change Issue
              </Button>
            </div>
          )}

          {issue && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="amount">Bounty Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="5"
                  step="1"
                  placeholder="100"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">Minimum bounty amount is $5.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button 
            className="w-32" 
            disabled={!issue || !amount || parseFloat(amount) < 5 || loading}
            onClick={handleFundBounty}
          >
            {loading ? "Processing..." : "Fund Bounty"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
