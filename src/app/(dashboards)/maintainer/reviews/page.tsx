"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Sparkles, 
  ExternalLink, 
  Check, 
  X, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle,
  FileCode,
  Flame,
  AlertTriangle
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface ReviewPR {
  id: string;
  contributor: string;
  issue: string;
  repo: string;
  prNumber: number;
  prLink: string;
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  aiScore: number;
  securityScore: number;
  performanceScore: number;
  qualityScore: number;
  complexityScore: number;
  fraudScore: number;
  recommendation: "APPROVE" | "REQUEST CHANGES" | "REJECT";
  diffSnippet: string;
  status: "Pending" | "Approved" | "Changes Requested" | "Rejected";
}

const MOCK_PRS: ReviewPR[] = [
  {
    id: "1",
    contributor: "Hariom1729",
    issue: "Memory leak in transition router hooks",
    repo: "facebook/react",
    prNumber: 29045,
    prLink: "https://github.com/facebook/react/pull/29045",
    filesChanged: 3,
    linesAdded: 142,
    linesRemoved: 28,
    aiScore: 92,
    securityScore: 98,
    performanceScore: 94,
    qualityScore: 92,
    complexityScore: 45,
    fraudScore: 8,
    recommendation: "APPROVE",
    diffSnippet: `diff --git a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js b/packages/react-reconciler/src/ReactFiberWorkLoop.new.js
index f3025ba1e4..c3b28b7e0e 100644
--- a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js
+++ b/packages/react-reconciler/src/ReactFiberWorkLoop.new.js
@@ -342,6 +342,10 @@ function resetRenderTimer() {
+  // Fix: release detached fiber layout root context pointer
+  if (workInProgressRootExitStatus === RootCompleted) {
+    releaseDetachedFiberContext(workInProgressRoot);
+  }
   workInProgressRootExitStatus = RootInProgress;`,
    status: "Pending"
  },
  {
    id: "2",
    contributor: "bot_coder30",
    issue: "Refactor dynamic context providers for speed",
    repo: "facebook/react",
    prNumber: 29068,
    prLink: "https://github.com/facebook/react/pull/29068",
    filesChanged: 12,
    linesAdded: 820,
    linesRemoved: 410,
    aiScore: 34,
    securityScore: 40,
    performanceScore: 28,
    qualityScore: 35,
    complexityScore: 85,
    fraudScore: 88,
    recommendation: "REJECT",
    diffSnippet: `diff --git a/packages/react/src/ReactContext.js b/packages/react/src/ReactContext.js
index c823b12..d398ea3 100644
--- a/packages/react/src/ReactContext.js
+++ b/packages/react/src/ReactContext.js
@@ -12,25 +12,185 @@
+// Redundant code block copied from third-party forum.
+function processContextValues(ctx, val) {
+  // AI-generated boilerplate
+  const cache = new Map();
+  if (cache.has(ctx)) return cache.get(ctx);
+  ...
+}`,
    status: "Pending"
  }
];

export default function AIReviewQueuePage() {
  const { data: session } = useSession();
  const [prs, setPrs] = useState<ReviewPR[]>(MOCK_PRS);
  const [selectedPr, setSelectedPr] = useState<ReviewPR | null>(MOCK_PRS[0]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleAction = (id: string, actionStatus: ReviewPR["status"]) => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setPrs(prev => prev.map(pr => pr.id === id ? { ...pr, status: actionStatus } : pr));
    setSelectedPr(prev => prev && prev.id === id ? { ...prev, status: actionStatus } : prev);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="text-purple-400 h-6 w-6" /> AI Review Queue
        </h1>
        <p className="text-neutral-400 text-sm">Automated analysis of incoming pull requests assessing security, quality, complexity, and plagiarism risk.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: List of pending PRs */}
        <div className="space-y-4">
          <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Pull Requests Queue</span>
          
          <div className="space-y-3">
            {prs.map(pr => (
              <button
                key={pr.id}
                onClick={() => setSelectedPr(pr)}
                className={`
                  w-full text-left p-4 rounded-lg border flex flex-col justify-between transition-all
                  ${selectedPr?.id === pr.id 
                    ? "bg-neutral-900 border-purple-500/50" 
                    : "bg-neutral-900/60 border-neutral-850 hover:bg-neutral-900 hover:border-neutral-800"}
                `}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500">
                    <span>{pr.repo} • PR #{pr.prNumber}</span>
                    <Badge variant={pr.status === "Pending" ? "outline" : "secondary"} className="text-[9px] px-1 py-0 px-1.5 rounded-full font-normal">
                      {pr.status}
                    </Badge>
                  </div>
                  <div className="font-semibold text-white text-sm line-clamp-1">{pr.issue}</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Submitted by @{pr.contributor}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-850 mt-3">
                  <div className="flex gap-2 text-[10px] font-semibold">
                    <span className="text-green-400">+{pr.linesAdded}</span>
                    <span className="text-red-400">-{pr.linesRemoved}</span>
                  </div>
                  <Badge 
                    className={`
                      text-[9px] px-1.5 py-0.5 rounded-full font-semibold border
                      ${pr.recommendation === "APPROVE" ? "bg-green-500/10 text-green-400 border-green-500/20" : ""}
                      ${pr.recommendation === "REJECT" ? "bg-red-500/10 text-red-400 border-red-500/20" : ""}
                    `}
                  >
                    AI Recommendation: {pr.recommendation}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Split side-by-side details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPr ? (
            <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
              <CardHeader className="pb-4 border-b border-neutral-850">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Avatar className="h-6 w-6 border border-neutral-800">
                      <AvatarFallback className="bg-neutral-800 text-[10px] font-bold text-neutral-400">
                        {selectedPr.contributor.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>@{selectedPr.contributor}</span>
                  </div>
                  <a 
                    href={selectedPr.prLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-0.5"
                  >
                    PR Link <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <CardTitle className="text-md font-bold text-white mt-3 leading-snug">
                  PR #{selectedPr.prNumber}: {selectedPr.issue}
                </CardTitle>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Files Changed: <span className="text-neutral-300 font-semibold">{selectedPr.filesChanged}</span> • Lines: <span className="text-green-400 font-semibold">+{selectedPr.linesAdded}</span>, <span className="text-red-400 font-semibold">-{selectedPr.linesRemoved}</span>
                </div>
              </CardHeader>

              <CardContent className="py-5 space-y-6">
                
                {/* AI Review stats grid */}
                <div className="space-y-4">
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">AI Metrics Audit</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Performance */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">Performance Score</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm font-bold text-white">{selectedPr.performanceScore}%</span>
                        <div className="h-2 w-12 bg-neutral-900 rounded-full overflow-hidden">
                          <div className={`h-full ${selectedPr.performanceScore > 80 ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${selectedPr.performanceScore}%` }} />
                        </div>
                      </div>
                    </div>
                    {/* Security */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">Security Audit</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm font-bold text-white">{selectedPr.securityScore}%</span>
                        <div className="h-2 w-12 bg-neutral-900 rounded-full overflow-hidden">
                          <div className={`h-full ${selectedPr.securityScore > 80 ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${selectedPr.securityScore}%` }} />
                        </div>
                      </div>
                    </div>
                    {/* Code Quality */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">Code Quality</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm font-bold text-white">{selectedPr.qualityScore}%</span>
                        <div className="h-2 w-12 bg-neutral-900 rounded-full overflow-hidden">
                          <div className={`h-full ${selectedPr.qualityScore > 80 ? "bg-green-500" : "bg-amber-500"}`} style={{ width: `${selectedPr.qualityScore}%` }} />
                        </div>
                      </div>
                    </div>
                    {/* Complexity */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">Code Complexity</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm font-bold text-white">{selectedPr.complexityScore}/100</span>
                        <div className="text-[9px] text-neutral-500 font-semibold">Cyclomatic</div>
                      </div>
                    </div>
                    {/* Fraud Score */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">AI Fraud Risk Score</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className={`text-sm font-bold ${selectedPr.fraudScore > 50 ? "text-rose-400" : "text-green-400"}`}>
                          {selectedPr.fraudScore}%
                        </span>
                        <div className="text-[9px] text-neutral-500 font-semibold">Copy-paste check</div>
                      </div>
                    </div>
                    {/* Total AI Score */}
                    <div className="space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-855">
                      <span className="text-[10px] text-neutral-400 block font-medium">Overall AI Score</span>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-sm font-bold text-purple-400">{selectedPr.aiScore}/100</span>
                        <div className="text-[9px] text-purple-400 font-semibold">High confidence</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diff View */}
                <div className="space-y-2">
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase tracking-wider">Git Diff Preview</span>
                  <div className="rounded-lg bg-neutral-950 border border-neutral-850 p-4 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed text-neutral-300">
                    {selectedPr.diffSnippet}
                  </div>
                </div>

              </CardContent>

              {/* Action Buttons Panel */}
              <div className="p-4 border-t border-neutral-850 bg-neutral-900/60 flex items-center justify-between">
                <div>
                  {selectedPr.status !== "Pending" && (
                    <span className="text-neutral-500 text-xs font-semibold">
                      Action Taken: {selectedPr.status}
                    </span>
                  )}
                </div>
                {selectedPr.status === "Pending" ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction(selectedPr.id, "Rejected")}
                      className="border-red-900/30 text-red-400 hover:bg-red-500/10 text-xs h-9"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAction(selectedPr.id, "Changes Requested")}
                      className="border-neutral-800 text-neutral-300 hover:bg-neutral-800 text-xs h-9"
                    >
                      Request Changes
                    </Button>
                    <Button 
                      onClick={() => handleAction(selectedPr.id, "Approved")}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9"
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve & Merge
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="link" 
                    onClick={() => handleAction(selectedPr.id, "Pending")}
                    className="text-xs text-neutral-500 hover:text-neutral-300"
                  >
                    Reset Review Decision
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="text-center text-xs text-neutral-500 py-12">
              Select a pull request from the queue to start.
            </div>
          )}
        </div>

      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
