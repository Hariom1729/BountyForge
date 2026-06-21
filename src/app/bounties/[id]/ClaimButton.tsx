"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ClaimButtonProps {
  bountyId: string;
  hasClaimed: boolean;
  status: string;
}

export function ClaimButton({ bountyId, hasClaimed, status }: ClaimButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClaim = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/bounties/${bountyId}/claim`, {
        method: "POST",
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to claim bounty");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "OPEN") {
    return <Button disabled>Bounty is {status}</Button>;
  }

  if (hasClaimed) {
    return <Button disabled variant="outline">Already Claimed</Button>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClaim} disabled={loading} className="w-full sm:w-auto">
        {loading ? "Claiming..." : "Claim Bounty"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
