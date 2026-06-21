import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contributor Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and payout preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your email and connected accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
            This module is under construction.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
