"use client";

import { SessionProvider } from "next-auth/react";
import { AuthGuardProvider } from "./auth-guard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuardProvider>
        {children}
      </AuthGuardProvider>
    </SessionProvider>
  );
}
