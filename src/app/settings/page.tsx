"use client";

import { useSession, signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your connected accounts and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your current role and basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Platform Role</p>
              <p className="text-sm text-muted-foreground capitalize">{session.user.role.toLowerCase()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Link third-party accounts for enhanced platform features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Github className="w-6 h-6" />
              <div>
                <p className="font-medium flex items-center gap-2">
                  GitHub
                  {session.user.githubConnected ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">Connected</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Required for Contributors to claim bounties and submit PRs.
                </p>
              </div>
            </div>
            
            {!session.user.githubConnected && (
              <Button onClick={() => signIn("github")}>
                Connect GitHub
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
