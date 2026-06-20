import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Code, Coins, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/50">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
          Phase 6 Launch
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 text-foreground">
          Fund and build the future of <span className="text-green-600">Open Source</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          BountyForge connects maintainers with talented developers. Post bounties, write code, and get paid automatically when your pull request is merged.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="gap-2 text-base h-12 px-8">
            <Link href="/bounties">
              Explore Bounties <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 text-base h-12 px-8">
            <Link href="/api/auth/signin">
              <Github className="w-5 h-5" /> Sign in with GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background border-t">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">GitHub Integrated</h3>
              <p className="text-muted-foreground">
                Work seamlessly with your existing workflow. Bounties are paid out automatically when pull requests are merged.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                <Coins className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground">
                Funds are held in secure escrow powered by Razorpay until the work is verified and approved by the maintainer.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fair Resolution</h3>
              <p className="text-muted-foreground">
                Transparent claim system ensures developers are compensated fairly for their contributions to open source projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
