"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Activity, 
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  Percent
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface Transaction {
  id: string;
  type: "deposit" | "release" | "refund";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  developer: string;
  repo: string;
  date: string;
  referenceId: string;
  fee: number;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "tx1", type: "deposit", amount: 472.5, status: "Completed", developer: "Acme Org (Escrow lock)", repo: "facebook/react", date: "2 days ago", referenceId: "ch_stripe_8f91as", fee: 22.5 },
  { id: "tx2", type: "release", amount: 150.0, status: "Completed", developer: "Hariom1729", repo: "Hariom1729/BountyForge", date: "4 days ago", referenceId: "ch_stripe_9s21ad", fee: 7.5 },
  { id: "tx3", type: "refund", amount: 200.0, status: "Completed", developer: "Acme Org (Refund)", repo: "vercel/next.js", date: "1 week ago", referenceId: "ch_stripe_1m38sa", fee: 0 },
  { id: "tx4", type: "release", amount: 850.0, status: "Pending", developer: "alex_coder", repo: "vercel/next.js", date: "Just now", referenceId: "ch_stripe_2f00da", fee: 42.5 },
];

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-purple-400" /> Payment Center
          </h1>
          <p className="text-neutral-400 text-sm">Monitor escrow balances, refund requests, transactions, and platform fees.</p>
        </div>
        <Button 
          variant="outline"
          className="border-neutral-850 bg-neutral-900 text-xs text-neutral-300 hover:text-white"
          onClick={() => {
            if (isGuest) setIsUpgradeModalOpen(true);
          }}
        >
          Export Stripe CSV
        </Button>
      </div>

      {/* Stripe-like metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Escrow Net Spend</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-white">$4,950.00</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Pending Escrows</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-white">$1,550.00</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Total Refunded</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-neutral-300">$600.00</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Platform Fees Paid</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-purple-400 flex items-center gap-1">
              <Percent className="h-4 w-4" /> $247.50
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Transaction History Section */}
      <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
        <CardHeader className="border-b border-neutral-850 pb-4">
          <CardTitle className="text-md">Payment History & Escrow Releases</CardTitle>
          <CardDescription className="text-xs text-neutral-500">Full audit log of active bank deposits, code payouts, and refunds.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-850 bg-neutral-950/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Reference ID</th>
                  <th className="p-4">Transaction Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Platform Fee</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-4 font-mono text-[10px] text-neutral-400">
                      <span className="flex items-center gap-1">
                        {tx.referenceId} <ExternalLink className="h-2.5 w-2.5 text-neutral-600" />
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-neutral-250">{tx.developer}</div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{tx.repo}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 font-semibold text-[10px] uppercase
                        ${tx.type === "deposit" && "text-blue-400"}
                        ${tx.type === "release" && "text-green-400"}
                        ${tx.type === "refund" && "text-amber-400"}
                      `}>
                        {tx.type === "deposit" && <ArrowDownLeft className="h-3.5 w-3.5" />}
                        {tx.type === "release" && <ArrowUpRight className="h-3.5 w-3.5" />}
                        {tx.type === "refund" && <ArrowDownLeft className="h-3.5 w-3.5" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400 font-medium">
                      ${tx.fee}
                    </td>
                    <td className="p-4 font-bold text-neutral-200">
                      ${tx.amount}
                    </td>
                    <td className="p-4">
                      <Badge className={`
                        text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                        ${tx.status === "Completed" && "bg-green-500/10 text-green-400 border border-green-500/20"}
                        ${tx.status === "Pending" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"}
                        ${tx.status === "Failed" && "bg-red-500/10 text-red-400 border border-red-500/20"}
                      `}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right text-neutral-500">
                      {tx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
