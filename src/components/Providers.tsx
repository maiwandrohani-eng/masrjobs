"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { MasrJobsProvider } from "@/context/MasrJobsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <LanguageProvider>
        <MasrJobsProvider>{children}</MasrJobsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
