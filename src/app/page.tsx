import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Coins, ShieldCheck, Bot, Briefcase, Zap, TerminalSquare, Search, Award, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -z-10 h-full w-full bg-white dark:bg-background">
          <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[10%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.15)] opacity-50 blur-[80px]"></div>
          <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] translate-x-[10%] translate-y-[20%] rounded-full bg-[rgba(59,130,246,0.15)] opacity-50 blur-[80px]"></div>
        </div>

        <div className="inline-flex items-center rounded-full border border-purple-500/30 px-3 py-1 text-sm font-medium transition-colors bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-8 backdrop-blur-sm shadow-sm">
          <Bot className="w-4 h-4 mr-2" />
          Powered by DeepMind AI & GPT-4o
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mb-6 text-foreground leading-[1.1]">
          The ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">AI-Powered</span> Talent Economy for Open Source.
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed">
          BountyForge isn't just a bounty platform. We combine GitHub, Upwork, and AI into one unified ecosystem. Automate code reviews, detect fraud, and build a world-class engineering reputation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-10">
          <Link href="/bounties" className={cn(buttonVariants({ size: "lg" }), "gap-2 text-lg h-14 px-8 shadow-lg shadow-purple-500/20")}>
            Explore Open Bounties <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/signin" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 text-lg h-14 px-8 bg-background/50 backdrop-blur-sm")}>
            <GitBranch className="w-5 h-5" /> Sign In
          </Link>
        </div>

        {/* Mock Stats / Social Proof */}
        <div className="mt-20 pt-10 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full text-center">
          <div>
            <div className="text-4xl font-bold text-foreground">10k+</div>
            <div className="text-sm text-muted-foreground mt-1">Developers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-foreground">$2M+</div>
            <div className="text-sm text-muted-foreground mt-1">Bounties Paid</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-foreground">15k+</div>
            <div className="text-sm text-muted-foreground mt-1">AI Code Reviews</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground mt-1">Enterprises Hiring</div>
          </div>
        </div>
      </section>

      {/* AI Superpowers Section */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Your Open Source <span className="text-purple-600 dark:text-purple-400">AI Copilot</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We've integrated autonomous AI agents across the entire platform to completely eliminate the friction of open-source contribution.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/60 backdrop-blur-sm border-purple-500/20 shadow-xl shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">AI Issue Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Paste a GitHub Issue URL and our AI instantly estimates complexity, calculates hours required, and suggests a fair market bounty price.
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-pink-500/20 shadow-xl shadow-pink-500/5 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4">
                  <TerminalSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Automated Code Review</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Senior Security AI agents review every single Pull Request. They catch vulnerabilities, grade code quality, and provide instant feedback to contributors.
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border-blue-500/20 shadow-xl shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Enterprise Fraud Engine</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Enterprise sponsors are protected by an intelligent AI Fraud Detector that monitors developer behavior for sybil attacks and spam submissions.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two-Sided Marketplace Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: For Developers */}
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                For Developers
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Level up your career with verifiable Reputation.</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-500/20 p-1 rounded-full"><Award className="w-4 h-4 text-green-600" /></div>
                  <p className="text-muted-foreground"><strong className="text-foreground">Earn XP & Ranks:</strong> Complete bounties to level up from Bronze to Diamond tiers.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-500/20 p-1 rounded-full"><Coins className="w-4 h-4 text-green-600" /></div>
                  <p className="text-muted-foreground"><strong className="text-foreground">Get Paid Instantly:</strong> Funds are locked in smart escrow and released the moment your PR merges.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-green-500/20 p-1 rounded-full"><Briefcase className="w-4 h-4 text-green-600" /></div>
                  <p className="text-muted-foreground"><strong className="text-foreground">Get Hired:</strong> Top tier tech companies recruit directly from our hiring marketplace based on your verified code history.</p>
                </li>
              </ul>
              <Link href="/copilot" className={cn(buttonVariants({ variant: "default" }), "mt-4")}>
                View Your AI Copilot Dashboard
              </Link>
            </div>

            {/* Right Side: Visual Mockup (Abstract representation) */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl rounded-[2rem]"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                      <div className="h-3 w-16 bg-muted/60 rounded"></div>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Diamond Rank</Badge>
                </div>
                <div className="space-y-4">
                  <div className="h-20 bg-muted/30 rounded-lg border border-border/50 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-4 w-12 bg-green-500/20 rounded"></div>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full mt-4"><div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div></div>
                  </div>
                  <div className="h-20 bg-muted/30 rounded-lg border border-border/50 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-48 bg-muted rounded"></div>
                      <div className="h-4 w-16 bg-purple-500/20 rounded"></div>
                    </div>
                    <div className="h-3 w-3/4 bg-muted/60 rounded mt-4"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white mb-6">
            For Enterprise Sponsors
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Scale your Open Source engineering.</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Don't waste time managing contributors. Fund the issue, let our AI handle the pricing, code review, and fraud detection. Hire the best performers directly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/enterprise" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "gap-2 h-12 px-8")}>
              Go to Enterprise Dashboard
            </Link>
            <Link href="/jobs/create" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 h-12 px-8 bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white")}>
              Post a Job Opening
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

// A simple Badge component mock since we can't import it at the top without causing issues if it doesn't exist, though it likely does in Shadcn.
function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
}
