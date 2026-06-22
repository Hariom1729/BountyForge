"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Trash2, 
  Users, 
  Flame, 
  Terminal,
  Activity
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface AlertItem {
  id: string;
  type: "Spam PR" | "Plagiarism" | "Duplicate Claim" | "Multi-account";
  severity: "CRITICAL" | "WARNING" | "LOW";
  details: string;
  contributor: string;
  time: string;
  status: "Active" | "Dismissed" | "Blocked";
}

const INITIAL_ALERTS: AlertItem[] = [
  { id: "1", type: "Spam PR", severity: "CRITICAL", details: "Fake PR detected on facebook/react PR #29068. Content is 85% generated boilerplates.", contributor: "bot_coder30", time: "2 hours ago", status: "Active" },
  { id: "2", type: "Plagiarism", severity: "WARNING", details: "Significant similarity (92%) detected on next.js issue fix. Code resembles existing blog tutorial.", contributor: "suspicious_dev", time: "1 day ago", status: "Active" },
  { id: "3", type: "Duplicate Claim", severity: "LOW", details: "User claimed two related bounties concurrently, increasing abandonment risk.", contributor: "eager_dev", time: "2 days ago", status: "Active" },
];

export default function SecurityPage() {
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleAlertAction = (id: string, action: "Dismissed" | "Blocked") => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-purple-400" /> Risk & Security Center
        </h1>
        <p className="text-neutral-400 text-sm">Automated vulnerability shield, duplicate code verification, and plagiarism controls.</p>
      </div>

      {/* Security overall index */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardDescription className="text-xs text-neutral-400">Total Security Alerts</CardDescription>
              <CardTitle className="text-2xl font-bold text-rose-400 mt-1">{alerts.filter(a => a.status === "Active").length}</CardTitle>
            </div>
            <AlertTriangle className="h-8 w-8 text-rose-500/20" />
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardDescription className="text-xs text-neutral-400">Active Spam PR Monitor</CardDescription>
              <CardTitle className="text-2xl font-bold text-green-400 mt-1">Enabled</CardTitle>
            </div>
            <ShieldCheck className="h-8 w-8 text-green-500/20" />
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardDescription className="text-xs text-neutral-400">Duplicate Work Detector</CardDescription>
              <CardTitle className="text-2xl font-bold text-purple-400 mt-1">Real-time</CardTitle>
            </div>
            <Activity className="h-8 w-8 text-purple-500/20" />
          </CardHeader>
        </Card>

      </div>

      {/* Split section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Security warnings */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Active Security Alerts</span>
          
          <div className="space-y-3">
            {alerts.filter(a => a.status === "Active").map(alert => (
              <Card key={alert.id} className="bg-neutral-900 border-neutral-800 text-neutral-100">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`
                            text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                            ${alert.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : ""}
                            ${alert.severity === "WARNING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : ""}
                            ${alert.severity === "LOW" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : ""}
                          `}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-[10px] text-neutral-500">{alert.time}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-2">{alert.type}: @{alert.contributor}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">{alert.details}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-850 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAlertAction(alert.id, "Dismissed")}
                      className="h-7 text-[10px] border-neutral-800 hover:bg-neutral-800 text-neutral-350"
                    >
                      Dismiss Alert
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAlertAction(alert.id, "Blocked")}
                      className="h-7 text-[10px] border-red-950 text-red-400 hover:bg-red-500/10"
                    >
                      Audit & Block User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {alerts.filter(a => a.status === "Active").length === 0 && (
              <div className="text-center py-8 border border-dashed border-neutral-800 rounded-lg">
                <p className="text-xs text-neutral-500">All clear! No pending risk alerts detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Audit guidelines */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white">Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-neutral-400">
              <p>
                1. <span className="text-white font-semibold">Enable Plagiarism Blocker:</span> Ensure new PR claims verify source similarities against public StackOverflow/GitHub scrapers.
              </p>
              <p>
                2. <span className="text-white font-semibold">Multi-account correlation:</span> Identify contributors using multiple accounts to claim issues concurrently.
              </p>
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
