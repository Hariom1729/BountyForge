"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Sparkles, Shield, GitBranch, ArrowRight } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  title = "Unlock Full Workspace Access", 
  description = "You are currently viewing BountyForge as a guest. Upgrade your account to manage repositories, fund real bounties, audit code with AI, and release payments." 
}: UpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-neutral-900 border-neutral-800 text-neutral-100">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">{title}</DialogTitle>
            <DialogDescription className="text-neutral-400 text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800/60">
            <div className="mt-0.5 text-purple-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">GitHub Sync</h4>
              <p className="text-xs text-neutral-400">Sync repositories, import issues automatically, and review PRs using our automated AI reviewer.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800/60">
            <div className="mt-0.5 text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-200">Secure Escrow & Fraud Shield</h4>
              <p className="text-xs text-neutral-400">Fund bounties securely via Stripe/Razorpay and protect payouts with real-time AI security audits.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-purple-900/20 transition-all duration-200"
            onClick={() => signIn(undefined, { callbackUrl: "/maintainer/dashboard" })}
          >
            Upgrade to Maintainer <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="w-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
            onClick={onClose}
          >
            Keep Exploring as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
