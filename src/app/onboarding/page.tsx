"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Briefcase } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSelectRole = async (role: "MAINTAINER" | "CONTRIBUTOR") => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        await update(); // Force NextAuth to fetch new role
        router.push(role === "MAINTAINER" ? "/maintainer/dashboard" : "/contributor/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Who are you?</h1>
          <p className="text-xl text-muted-foreground">Select your primary role to customize your experience.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="h-full hover:border-purple-500/50 hover:shadow-purple-500/20 hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm bg-background/80" 
              onClick={() => handleSelectRole("MAINTAINER")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-purple-500/10 flex items-center justify-center rounded-2xl mb-6">
                  <Briefcase className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-3xl">Maintainer</CardTitle>
                <CardDescription className="text-lg mt-4 text-muted-foreground">
                  Create bounties, manage repositories, review pull requests, and reward contributors.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-6">
                <Button className="w-full text-lg h-12 bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                  Select Maintainer
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              className="h-full hover:border-blue-500/50 hover:shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer backdrop-blur-sm bg-background/80" 
              onClick={() => handleSelectRole("CONTRIBUTOR")}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-blue-500/10 flex items-center justify-center rounded-2xl mb-6">
                  <Code className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-3xl">Contributor</CardTitle>
                <CardDescription className="text-lg mt-4 text-muted-foreground">
                  Discover bounties, solve issues, earn money, build reputation, and get hired.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-6">
                <Button className="w-full text-lg h-12 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  Select Contributor
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
