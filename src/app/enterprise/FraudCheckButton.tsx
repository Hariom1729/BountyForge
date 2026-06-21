"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FraudCheckButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  const handleFraudCheck = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/simulate-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      // The background worker will run. We'll just reload the page after a slight delay to see the updated score.
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleFraudCheck} disabled={loading}>
      {loading ? "Scanning..." : "Audit"}
    </Button>
  );
}
