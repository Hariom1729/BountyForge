"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Terminal, 
  Sparkles, 
  Send, 
  Cpu, 
  Coins, 
  ShieldAlert, 
  Heart,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { role: "assistant", content: "Hello! I am your BountyForge Maintainer AI Copilot. I can suggest reward sizes, audit repositories, predict resolution times, and identify suspicious pull requests. Ask me anything!" }
];

export default function CopilotPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      let replyContent = "I have run the analysis model. Based on similar issues in react and next.js, I recommend a reward of $250 - $350. Estimated resolution time is 8 hours with moderate security concerns.";
      
      if (textToSend.toLowerCase().includes("risk") || textToSend.toLowerCase().includes("suspicious")) {
        replyContent = "ALERT: Contributor 'spam_bot_user' has a Trust Score of 12%. Their recent submissions show 85% code overlap with pre-existing repository branches. High plagiarism risk detected.";
      } else if (textToSend.toLowerCase().includes("health") || textToSend.toLowerCase().includes("report")) {
        replyContent = "REPOSITORY HEALTH SUMMARY:\n- facebook/react: 94% (Good, fast reviews)\n- vercel/next.js: 91% (Good, 2 urgent reviews pending)\n- Hariom1729/BountyForge: 98% (Perfect sync)";
      } else if (textToSend.toLowerCase().includes("weekly")) {
        replyContent = "WEEKLY SUMMARY REPORT:\n- Total Escrow Volume Locked: $1,550\n- Payouts Released: $3,400\n- New Issues Imported: 8\n- Resolution speed is up 12% compared to last week.";
      }

      setMessages(prev => [...prev, { role: "assistant", content: replyContent }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 bg-neutral-950 text-neutral-100 flex flex-col h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Terminal className="h-6 w-6 text-purple-400" /> AI Assistant Copilot
        </h1>
        <p className="text-neutral-400 text-sm">Ask your AI Copilot to run security audits, estimate reward sizes, and write weekly code reports.</p>
      </div>

      {/* Suggested Command Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button 
          onClick={() => handleSend("Suggest a reward for memory leak issue")}
          className="p-3 text-left bg-neutral-900 border border-neutral-850 rounded-lg hover:border-purple-500/50 hover:bg-neutral-900/60 transition-all text-xs"
        >
          <Coins className="h-4.5 w-4.5 text-purple-400 mb-1" />
          <span className="font-bold text-white block">Suggest Rewards</span>
          <span className="text-[10px] text-neutral-500">Estimate market rate of issue</span>
        </button>

        <button 
          onClick={() => handleSend("Predict completion time for Turbopack crash")}
          className="p-3 text-left bg-neutral-900 border border-neutral-850 rounded-lg hover:border-purple-500/50 hover:bg-neutral-900/60 transition-all text-xs"
        >
          <Clock className="h-4.5 w-4.5 text-purple-400 mb-1" />
          <span className="font-bold text-white block">Predict Speed Time</span>
          <span className="text-[10px] text-neutral-500">Calculate resolution ETA</span>
        </button>

        <button 
          onClick={() => handleSend("Analyze repository health scores")}
          className="p-3 text-left bg-neutral-900 border border-neutral-850 rounded-lg hover:border-purple-500/50 hover:bg-neutral-900/60 transition-all text-xs"
        >
          <Heart className="h-4.5 w-4.5 text-purple-400 mb-1" />
          <span className="font-bold text-white block">Repository Health</span>
          <span className="text-[10px] text-neutral-500">Audit code quality scores</span>
        </button>

        <button 
          onClick={() => handleSend("Create weekly summary report")}
          className="p-3 text-left bg-neutral-900 border border-neutral-850 rounded-lg hover:border-purple-500/50 hover:bg-neutral-900/60 transition-all text-xs"
        >
          <FileText className="h-4.5 w-4.5 text-purple-400 mb-1" />
          <span className="font-bold text-white block">Weekly Summary</span>
          <span className="text-[10px] text-neutral-500">Write summary of activities</span>
        </button>
      </div>

      {/* Chat Terminal Frame */}
      <Card className="flex-1 bg-neutral-900 border-neutral-800 text-neutral-100 flex flex-col justify-between overflow-hidden min-h-[350px]">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[480px]">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-3 text-xs leading-relaxed max-w-2xl
                ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}
              `}
            >
              <Avatar className="h-8 w-8 shrink-0 border border-neutral-800">
                <AvatarFallback className={msg.role === "assistant" ? "bg-purple-500/10 text-purple-400 font-bold" : "bg-neutral-800 text-neutral-400 font-bold"}>
                  {msg.role === "assistant" ? "AI" : "M"}
                </AvatarFallback>
              </Avatar>
              <div className={`p-3 rounded-lg border
                ${msg.role === "user" 
                  ? "bg-purple-600/10 border-purple-500/20 text-neutral-100" 
                  : "bg-neutral-950 border-neutral-850 text-neutral-300"}
              `}>
                <span className="whitespace-pre-line">{msg.content}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 text-xs text-neutral-500 items-center">
              <Cpu className="h-4 w-4 animate-spin text-purple-400" />
              <span>Copilot is running analysis model calculations...</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-neutral-850 bg-neutral-900/60 flex gap-2">
          <Input 
            placeholder="Ask Copilot: 'Suggest a reward for react issue #29013'..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 bg-neutral-950 border-neutral-850 text-neutral-200 text-xs focus-visible:ring-purple-500"
          />
          <Button 
            onClick={() => handleSend(input)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
