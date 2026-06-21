"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      location: formData.get("location"),
      salaryMin: formData.get("salaryMin"),
      salaryMax: formData.get("salaryMax"),
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create job post");
      }

      router.push("/jobs");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Post a Job</CardTitle>
          <CardDescription>Hire top open source contributors directly.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 mb-6 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input id="title" name="title" required placeholder="e.g. Senior React Developer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Employment Type</Label>
              <select 
                id="type" 
                name="type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="FREELANCE">Freelance</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Remote, San Francisco, CA" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Min Salary (USD)</Label>
                <Input id="salaryMin" name="salaryMin" type="number" placeholder="100000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Max Salary (USD)</Label>
                <Input id="salaryMax" name="salaryMax" type="number" placeholder="150000" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                required 
                placeholder="Describe the role, responsibilities, and requirements..."
                className="min-h-[200px]"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
