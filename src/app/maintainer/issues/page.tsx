import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function IssuesPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        <p className="text-muted-foreground mt-1">Manage your open GitHub issues.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Open Issues</CardTitle>
          <CardDescription>Select an issue to fund it as a bounty.</CardDescription>
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
