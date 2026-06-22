"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  RefreshCw, 
  Plus, 
  Heart, 
  ShieldAlert, 
  Users, 
  FileText,
  Search,
  ExternalLink,
  Activity
} from "lucide-react";
import { useSession } from "next-auth/react";

interface RepoItem {
  id: string;
  name: string;
  owner: string;
  healthScore: number;
  riskScore: number;
  openIssues: number;
  contributorsCount: number;
  stars: number;
  forks: number;
  lastSynced: string;
  status: "Synced" | "Syncing" | "Error";
}

const INITIAL_REPOS: RepoItem[] = [
  { id: "1", name: "react", owner: "facebook", healthScore: 94, riskScore: 12, openIssues: 320, contributorsCount: 142, stars: 221000, forks: 45000, lastSynced: "10 mins ago", status: "Synced" },
  { id: "2", name: "next.js", owner: "vercel", healthScore: 91, riskScore: 18, openIssues: 180, contributorsCount: 92, stars: 122000, forks: 24000, lastSynced: "1 hour ago", status: "Synced" },
  { id: "3", name: "BountyForge", owner: "Hariom1729", healthScore: 98, riskScore: 5, openIssues: 3, contributorsCount: 8, stars: 450, forks: 12, lastSynced: "Just now", status: "Synced" },
];

export default function RepositoriesPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [search, setSearch] = useState("");
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [newRepoUrl, setNewRepoUrl] = useState("");

  const isGuest = session?.user?.role === "GUEST";

  const handleSync = (id: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
      setRepos(prev => prev.map(r => r.id === id ? { ...r, lastSynced: "Just now" } : r));
    }, 1500);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoUrl) return;
    
    // Parse name from url
    let parts = newRepoUrl.replace("https://github.com/", "").split("/");
    const owner = parts[0] || "custom";
    const name = parts[1] || "imported-repo";

    const newRepo: RepoItem = {
      id: (repos.length + 1).toString(),
      name,
      owner,
      healthScore: 95,
      riskScore: 8,
      openIssues: 12,
      contributorsCount: 1,
      stars: 12,
      forks: 2,
      lastSynced: "Just now",
      status: "Synced"
    };

    setRepos([newRepo, ...repos]);
    setNewRepoUrl("");
    setImportOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Repository Management</h1>
          <p className="text-neutral-400 text-sm">Sync your open source codebases and audit their development health.</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          onClick={() => setImportOpen(!importOpen)}
        >
          <Plus className="h-4 w-4" /> Import GitHub Repository
        </Button>
      </div>

      {/* Import panel overlay */}
      {importOpen && (
        <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <CardHeader>
            <CardTitle className="text-md">Import GitHub Repository</CardTitle>
            <CardDescription className="text-xs text-neutral-500">Provide the repository path or full URL to import into BountyForge.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="flex gap-2">
              <Input 
                placeholder="https://github.com/owner/repository" 
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                className="bg-neutral-950 border-neutral-800 focus-visible:ring-purple-500 text-neutral-200"
              />
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white shrink-0">
                {isGuest ? "Import Demo Repo" : "Import & Sync"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
        <Input 
          placeholder="Search repositories..." 
          className="pl-9 bg-neutral-900 border-neutral-850 focus-visible:ring-purple-500 text-neutral-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Repository List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((repo) => (
          <Card key={repo.id} className="bg-neutral-900 border-neutral-800 hover:border-neutral-800 transition-all text-neutral-100 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-purple-400" />
                  <div>
                    <CardTitle className="text-sm font-bold text-white leading-none">
                      {repo.owner}/{repo.name}
                    </CardTitle>
                    <a 
                      href={`https://github.com/${repo.owner}/${repo.name}`}
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-neutral-500 hover:text-purple-400 mt-1 inline-flex items-center gap-0.5"
                    >
                      View on GitHub <ExternalLink className="h-2 w-2" />
                    </a>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-neutral-950 border-neutral-800 text-neutral-400">
                  {repo.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              
              {/* Health Score Indicators */}
              <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                <div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Health Score</div>
                  <div className="text-lg font-bold text-green-400 mt-0.5 flex items-center gap-1">
                    <Heart className="h-4 w-4 fill-green-500/20" /> {repo.healthScore}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Risk Score</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                    <ShieldAlert className="h-4 w-4" /> {repo.riskScore}/100
                  </div>
                </div>
              </div>

              {/* Stats lists */}
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex justify-between text-neutral-400 pr-2">
                  <span>Open Issues:</span>
                  <span className="font-semibold text-white">{repo.openIssues}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                  <span>Contributors:</span>
                  <span className="font-semibold text-white">{repo.contributorsCount}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pr-2">
                  <span>Stars:</span>
                  <span className="font-semibold text-white">{repo.stars.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400 pl-2 border-l border-neutral-800">
                  <span>Forks:</span>
                  <span className="font-semibold text-white">{repo.forks.toLocaleString()}</span>
                </div>
              </div>

              {/* Operations row */}
              <div className="pt-3 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500">
                <span>Last synced: {repo.lastSynced}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSync(repo.id)}
                  disabled={isSyncing === repo.id}
                  className="h-7 text-[10px] text-neutral-400 hover:text-white"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing === repo.id ? "animate-spin" : ""}`} /> Sync
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
