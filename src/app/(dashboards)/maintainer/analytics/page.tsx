"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  DollarSign, 
  GitBranch, 
  ArrowUpRight,
  Zap,
  Activity,
  CheckCircle2
} from "lucide-react";

export default function AnalyticsPage() {
  const [selectedTimeline, setSelectedTimeline] = useState("30D");

  // Custom premium SVG charts mock points
  // 30D spend points: 1000 -> 1200 -> 2400 -> 1800 -> 3400
  const spendChartPoints = "10,90 90,80 170,40 250,60 330,10";
  const spendChartArea = "10,90 90,80 170,40 250,60 330,10 330,100 10,100";

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-400" /> Analytics Center
          </h1>
          <p className="text-neutral-400 text-sm">Visualize operational performance, ROI, contributor speeds, and code spend.</p>
        </div>
        <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
          {["7D", "30D", "90D", "1Y"].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTimeline(t)}
              className={`px-2.5 py-1 rounded ${selectedTimeline === t ? "bg-purple-600 text-white font-bold" : "text-neutral-500 hover:text-neutral-300"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ROI & Key stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Monthly Code Spend</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-white">$3,400.00</CardTitle>
            <div className="text-[10px] text-green-400 font-semibold flex items-center mt-1">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +14.2% from last month
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Avg Issue Resolution Time</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-white">2.3 Days</CardTitle>
            <div className="text-[10px] text-green-400 font-semibold flex items-center mt-1">
              <Zap className="h-3.5 w-3.5 mr-0.5" /> -0.8 days faster development
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Bounty Completion Rate</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-white">96.4%</CardTitle>
            <div className="text-[10px] text-neutral-400 font-semibold mt-1">
              82 of 85 bounties successfully merged
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-neutral-400">Avg ROI Developer Value</CardDescription>
            <CardTitle className="text-xl font-bold mt-1 text-purple-400 flex items-center">
              3.8x <span className="text-[10px] text-neutral-500 font-normal ml-1">v. fulltime hires</span>
            </CardTitle>
            <div className="text-[10px] text-purple-400 font-semibold mt-1">
              AI-audited developer productivity efficiency
            </div>
          </CardHeader>
        </Card>

      </div>

      {/* SVG Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SVG Area Chart: Monthly spend */}
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-md">Escrow Monthly Spend Trend</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Continuous billing visualization across the selected {selectedTimeline} range.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-end">
            <div className="relative w-full h-full pt-6">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                <div className="border-t border-white w-full" />
                <div className="border-t border-white w-full" />
                <div className="border-t border-white w-full" />
                <div className="border-t border-white w-full" />
              </div>

              {/* Sparkline area */}
              <svg viewBox="0 0 340 100" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0"/>
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <polygon points={spendChartArea} fill="url(#spendGrad)" />
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  points={spendChartPoints}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Hover dots */}
                <circle cx="10" cy="90" r="3.5" fill="#a855f7" stroke="#000" strokeWidth="1" />
                <circle cx="90" cy="80" r="3.5" fill="#a855f7" stroke="#000" strokeWidth="1" />
                <circle cx="170" cy="40" r="3.5" fill="#a855f7" stroke="#000" strokeWidth="1" />
                <circle cx="250" cy="60" r="3.5" fill="#a855f7" stroke="#000" strokeWidth="1" />
                <circle cx="330" cy="10" r="4.5" fill="#c084fc" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Resolution Bar charts */}
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-md">Completion Speed Rates</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Average resolution speeds by issue difficulty class.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-around">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>EASY (Avg 2.5 hours)</span>
                <span className="font-semibold text-white">99% merged</span>
              </div>
              <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "99%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>MEDIUM (Avg 12.8 hours)</span>
                <span className="font-semibold text-white">92% merged</span>
              </div>
              <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "92%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>HARD (Avg 1.8 days)</span>
                <span className="font-semibold text-white">88% merged</span>
              </div>
              <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "88%" }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>EXPERT (Avg 4.1 days)</span>
                <span className="font-semibold text-white">76% merged</span>
              </div>
              <div className="h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: "76%" }} />
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Top Contributors lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">Top Active Contributors</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Developers with the highest resolution rates & code quality scores.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">H</div>
                <span className="font-semibold text-neutral-200">Hariom1729</span>
              </div>
              <span className="text-neutral-400">12 claims resolved • $2,450 earned</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-neutral-850 text-neutral-400 font-bold flex items-center justify-center text-[10px]">A</div>
                <span className="font-semibold text-neutral-200">alex_coder</span>
              </div>
              <span className="text-neutral-400">8 claims resolved • $1,820 earned</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-white">Top Funded Repositories</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Repository locations holding the highest volume of escrows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-400" />
                <span className="font-semibold text-neutral-200">facebook/react</span>
              </div>
              <span className="text-neutral-400">6 active bounties • $2,850 locked</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-400" />
                <span className="font-semibold text-neutral-200">vercel/next.js</span>
              </div>
              <span className="text-neutral-400">4 active bounties • $1,450 locked</span>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
