"use client";

import { SessionProvider } from "next-auth/react";
import { MasrJobsProvider } from "@/context/MasrJobsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <MasrJobsProvider>{children}</MasrJobsProvider>
    </SessionProvider>
  );
}
