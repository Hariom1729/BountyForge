import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Coins, ShieldCheck, Bot, Briefcase, Zap, TerminalSquare, Search, Award, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DottedSurface } from "@/components/ui/dotted-surface";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background overflow-hidden relative">
      {/* 3D Wave Interactive Background */}
      <DottedSurface />

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden z-10">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 -z-10 h-full w-full pointer-events-none">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[600px] w-[600px] -translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(139,92,246,0.18)] opacity-40 blur-[120px]"></div>
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[600px] w-[600px] translate-x-[20%] translate-y-[10%] rounded-full bg-[rgba(59,130,246,0.18)] opacity-40 blur-[120px]"></div>
        </div>

        <div className="inline-flex items-center rounded-full border border-purple-500/20 px-4 py-1.5 text-sm font-medium transition-all bg-purple-500/10 text-purple-400 dark:text-purple-300 mb-8 backdrop-blur-md shadow-lg shadow-purple-500/5 animate-pulse">
          <Bot className="w-4 h-4 mr-2" />
          Powered by DeepMind AI & GPT-4o
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight max-w-5xl mb-6 text-foreground leading-[1.05]">
          The ultimate <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI-Powered</span> Talent Economy.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-normal">
          BountyForge isn't just a bounty platform. We combine GitHub, Upwork, and AI into one unified ecosystem. Automate code reviews, detect fraud, and build a world-class engineering reputation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10 justify-center">
          <Link href="/bounties" className={cn(buttonVariants({ size: "lg" }), "gap-2 text-lg h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/35 border-0 transition-transform hover:scale-102 duration-200")}>
            Explore Open Bounties <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/signin" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 text-lg h-14 px-8 bg-background/40 hover:bg-background/80 backdrop-blur-md border-white/10 rounded-2xl transition-transform hover:scale-102 duration-200")}>
            <GitBranch className="w-5 h-5 text-purple-400" /> Sign In
          </Link>
        </div>

        {/* Mock Stats / Social Proof */}
        <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full text-center">
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">10k+</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">Developers</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">$2M+</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">Bounties Paid</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">15k+</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">AI Code Reviews</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <div className="text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">500+</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">Companies Hiring</div>
          </div>
        </div>
      </section>

      {/* AI Superpowers Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-muted/20 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Your Open Source <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI Copilot</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We've integrated autonomous AI agents across the entire platform to completely eliminate the friction of open-source contribution.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass-card border-purple-500/10 hover:border-purple-500/30 shadow-xl glow-hover rounded-2xl p-4">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">AI Issue Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Paste a GitHub Issue URL and our AI instantly estimates complexity, calculates hours required, and suggests a fair market bounty price.
              </CardContent>
            </Card>

            <Card className="glass-card border-pink-500/10 hover:border-pink-500/30 shadow-xl glow-hover rounded-2xl p-4">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/25">
                  <TerminalSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Automated Review</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Senior Security AI agents review every single Pull Request. They catch vulnerabilities, grade code quality, and provide instant feedback to contributors.
              </CardContent>
            </Card>

            <Card className="glass-card border-blue-500/10 hover:border-blue-500/30 shadow-xl glow-hover rounded-2xl p-4">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Enterprise Fraud Engine</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-base">
                Enterprise sponsors are protected by an intelligent AI Fraud Detector that monitors developer behavior for sybil attacks and spam submissions.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two-Sided Marketplace Section */}
      <section className="py-28 relative z-10 bg-transparent">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: For Developers */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-sm font-semibold text-blue-400">
                For Developers
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Level up your career with verifiable Reputation.</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-green-500/20 p-2 rounded-xl"><Award className="w-5 h-5 text-green-400" /></div>
                  <p className="text-muted-foreground text-lg"><strong className="text-foreground font-semibold">Earn XP & Ranks:</strong> Complete bounties to level up from Bronze to Diamond tiers.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-green-500/20 p-2 rounded-xl"><Coins className="w-5 h-5 text-green-400" /></div>
                  <p className="text-muted-foreground text-lg"><strong className="text-foreground font-semibold">Get Paid Instantly:</strong> Funds are locked in smart escrow and released the moment your PR merges.</p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-green-500/20 p-2 rounded-xl"><Briefcase className="w-5 h-5 text-green-400" /></div>
                  <p className="text-muted-foreground text-lg"><strong className="text-foreground font-semibold">Get Hired:</strong> Top tier tech companies recruit directly from our hiring marketplace based on your verified code history.</p>
                </li>
              </ul>
              <Link href="/copilot" className={cn(buttonVariants({ variant: "default" }), "mt-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10")}>
                View Your AI Copilot Dashboard
              </Link>
            </div>

            {/* Right Side: Visual Mockup */}
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl rounded-[2.5rem] pointer-events-none"></div>
              <div className="relative glass-card border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400">AG</div>
                    <div>
                      <div className="h-4 w-28 bg-white/10 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1 rounded-full text-xs">Diamond Rank</Badge>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-32 bg-white/10 rounded"></div>
                      <div className="text-xs font-bold text-green-400">920 XP</div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full mt-4"><div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div></div>
                  </div>
                  <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-48 bg-white/10 rounded"></div>
                      <div className="text-xs font-bold text-purple-400">Top 1% Contributor</div>
                    </div>
                    <div className="h-3 w-3/4 bg-white/5 rounded mt-4"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-28 bg-gradient-to-b from-transparent to-black text-white relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-sm font-semibold text-white mb-6">
            For Enterprise Sponsors
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Scale your Open Source engineering.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Don't waste time managing contributors. Fund the issue, let our AI handle the pricing, code review, and fraud detection. Hire the best performers directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/enterprise" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "gap-2 h-14 px-8 rounded-2xl bg-white hover:bg-gray-100 text-black shadow-lg")}>
              Go to Enterprise Dashboard
            </Link>
            <Link href="/jobs/create" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 h-14 px-8 bg-transparent border-gray-700 text-white hover:bg-gray-900 rounded-2xl")}>
              Post a Job Opening
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
}
