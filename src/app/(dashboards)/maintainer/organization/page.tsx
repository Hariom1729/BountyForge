"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building, 
  UserPlus, 
  Settings, 
  ShieldCheck, 
  Users, 
  Key, 
  Plus,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { UpgradeModal } from "@/components/features/UpgradeModal";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "REVIEWER" | "MEMBER";
  teams: string[];
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "1", name: "Maintainer Boss", email: "boss@acme.com", role: "OWNER", teams: ["Core Reviewers", "Engineering"] },
  { id: "2", name: "Hariom1729", email: "hariom@acme.com", role: "REVIEWER", teams: ["Core Reviewers", "Performance Team"] },
  { id: "3", name: "Alex Admin", email: "alex@acme.com", role: "ADMIN", teams: ["Billing", "Management"] },
  { id: "4", name: "Developer Dev", email: "dev@acme.com", role: "MEMBER", teams: ["Engineering"] },
];

export default function OrganizationPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("MEMBER");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGuest = session?.user?.role === "GUEST";

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const newMember: TeamMember = {
      id: (members.length + 1).toString(),
      name: inviteEmail.split("@")[0] || "Invited Member",
      email: inviteEmail,
      role: inviteRole,
      teams: ["Engineering"]
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
  };

  const handleRemove = (id: string) => {
    if (isGuest) {
      setIsUpgradeModalOpen(true);
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-neutral-950 text-neutral-100">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Building className="h-6 w-6 text-purple-400" /> Organization Workspace
        </h1>
        <p className="text-neutral-400 text-sm">Configure roles, permissions, invite teammates, and designate code reviewers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left side: invite member and team rosters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Members Table */}
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader className="border-b border-neutral-850 pb-4">
              <CardTitle className="text-md">Workspace Roster</CardTitle>
              <CardDescription className="text-xs text-neutral-500">Teammates with active dashboard access.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-850 bg-neutral-950/40 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Name / Contact</th>
                      <th className="p-4">Role Permission</th>
                      <th className="p-4">Teams</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 border border-neutral-850">
                              <AvatarFallback className="bg-neutral-850 text-[10px] font-bold text-neutral-350">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-neutral-200">{member.name}</div>
                              <div className="text-[10px] text-neutral-550">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`
                            text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                            ${member.role === "OWNER" && "bg-purple-500/10 text-purple-400 border border-purple-500/20"}
                            ${member.role === "ADMIN" && "bg-blue-500/10 text-blue-400 border border-blue-500/20"}
                            ${member.role === "REVIEWER" && "bg-green-500/10 text-green-400 border border-green-500/20"}
                            ${member.role === "MEMBER" && "bg-neutral-800 text-neutral-400 border border-neutral-700"}
                          `}>
                            {member.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {member.teams.map(t => (
                              <span key={t} className="px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-850 text-[9px] text-neutral-400">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {member.role !== "OWNER" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemove(member.id)}
                              className="h-7 w-7 text-neutral-500 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side: Invite panel */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border-neutral-800 text-neutral-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
                <UserPlus className="h-4 w-4 text-purple-400" /> Add Team Member
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">Send an invitation link to grant access.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Email Address</span>
                  <Input 
                    type="email" 
                    placeholder="teammate@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-neutral-950 border-neutral-850 text-xs focus-visible:ring-purple-500 text-neutral-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-neutral-400 block font-bold uppercase tracking-wider">Workspace Role</span>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                    className="w-full h-9 px-3 rounded-md bg-neutral-950 border border-neutral-850 text-xs text-neutral-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="MEMBER">MEMBER (View & Sync only)</option>
                    <option value="REVIEWER">REVIEWER (Review PRs & suggest rewards)</option>
                    <option value="ADMIN">ADMIN (Full configurations)</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs h-9">
                  Send Invite Link
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

    </div>
  );
}
