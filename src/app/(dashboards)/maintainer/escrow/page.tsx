"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Lock, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldAlert, 
  Building, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

export default function EscrowPage() {
  const { data: session } = useSession();
  const [walletBalance, setWalletBalance] = useState(12450.0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setWalletBalance(prev => prev + parseFloat(depositAmount));
    setDepositAmount("");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    if (parseFloat(withdrawAmount) > walletBalance) return;
    setWalletBalance(prev => prev - parseFloat(withdrawAmount));
    setWithdrawAmount("");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Lock className="h-6 w-6 text-purple-400" /> Escrow Ledger
        </h1>
        <p className="text-neutral-400 text-sm">Securely hold developers' rewards in smart wallets. Deposit funds or withdraw platform payouts.</p>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: wallet balance & deposit/withdraw cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Balance card */}
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Coins className="h-40 w-40 text-purple-400" />
            </div>
            <CardHeader className="pb-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Escrow Wallet Balance</span>
              <CardTitle className="text-3xl font-extrabold tracking-tight text-white mt-1">
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-850 text-xs">
              <div>
                <span className="text-neutral-500 block">Locked Funds</span>
                <span className="font-bold text-white mt-0.5 block">$1,550.00</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Released Funds</span>
                <span className="font-bold text-green-400 mt-0.5 block">$3,400.00</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Refunded Funds</span>
                <span className="font-bold text-amber-400 mt-0.5 block">$600.00</span>
              </div>
            </CardContent>
          </Card>

          {/* Deposit and withdraw panels side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Fund wallet */}
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ArrowDownLeft className="h-4 w-4 text-green-400" /> Deposit Wallet Funds
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">Fund your organization's escrow account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeposit} className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-500">$</span>
                    <Input 
                      type="number" 
                      placeholder="500" 
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="pl-7 bg-neutral-950 border-neutral-850 text-xs"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-9">
                    Authorize Stripe Deposit
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Withdraw wallet */}
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ArrowUpRight className="h-4 w-4 text-rose-400" /> Withdraw Wallet Balance
                </CardTitle>
                <CardDescription className="text-[11px] text-neutral-500">Transfer available wallet funds to external accounts.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-500">$</span>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="pl-7 bg-neutral-950 border-neutral-850 text-xs"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full border-neutral-800 hover:bg-neutral-800 text-neutral-350 text-xs h-9">
                    Withdraw to Connected Account
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>

        </div>

        {/* Right column: top spending repositories */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold text-white">Top Spending Repositories</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Breakdown of escrow utilization by codebase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                  <span>facebook/react</span>
                  <span>$2,850.00</span>
                </div>
                <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "65%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                  <span>vercel/next.js</span>
                  <span>$1,450.00</span>
                </div>
                <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "35%" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-neutral-300 font-semibold">
                  <span>Hariom1729/BountyForge</span>
                  <span>$650.00</span>
                </div>
                <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "15%" }} />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
