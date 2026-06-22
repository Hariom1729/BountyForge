"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Building, 
  Bell, 
  CreditCard, 
  GitBranch, 
  Check, 
  RefreshCw 
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [orgName, setOrgName] = useState("Acme Inc.");
  const [stripeConnected, setStripeConnected] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      setIsUpgradeModalOpen(true);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-purple-400" /> Settings
        </h1>
        <p className="text-neutral-400 text-sm">Configure organization profiles, webhook bindings, and Stripe payout connections.</p>
      </div>

      <div className="space-y-6">
        
        {/* Org profile */}
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
              <Building className="h-4 w-4 text-purple-400" /> Organization Profile
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">Configure your primary organization workspace name details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Organization Name</span>
                <Input 
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-neutral-950 border-neutral-850 text-xs focus-visible:ring-purple-500 text-neutral-200"
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9">
                Save Workspace Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Stripe Billing connection */}
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-purple-400" /> Stripe Payout Integration
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">Connect a Stripe bank account to receive refunds and release escrows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-neutral-950 p-4 rounded-lg border border-neutral-850">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  Stripe Connected <Badge className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-normal">Active</Badge>
                </div>
                <p className="text-[10px] text-neutral-500 leading-normal">Payouts are authorized to bank account ending in **9480.</p>
              </div>
              <Button 
                variant="outline" 
                className="border-neutral-805 hover:bg-neutral-800 text-xs text-neutral-350"
                onClick={() => {
                  if (isGuest) setIsUpgradeModalOpen(true);
                }}
              >
                Configure Stripe
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webhooks integrations */}
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
              <GitBranch className="h-4 w-4 text-purple-400" /> GitHub Sync Webhooks
            </CardTitle>
            <CardDescription className="text-xs text-neutral-500">Enable real-time Webhook callback trigger channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Payload Endpoint URL</span>
              <Input 
                value="https://bountyforge.com/api/webhooks/github"
                disabled
                className="bg-neutral-950 border-neutral-850 text-xs text-neutral-400"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Webhook Signature secret: ********************</span>
              <Button 
                variant="ghost" 
                className="h-7 text-[10px] text-purple-400"
                onClick={() => {
                  if (isGuest) setIsUpgradeModalOpen(true);
                }}
              >
                Regenerate key
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
