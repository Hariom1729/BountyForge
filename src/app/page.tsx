import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Code, Coins, ShieldCheck } from "lucide-react";

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
          <Link href="/bounties" className={cn(buttonVariants({ size: "lg" }), "gap-2 text-base h-12 px-8")}>
            Explore Bounties <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/api/auth/signin" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 text-base h-12 px-8")}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
            Sign in with GitHub
          </Link>
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
