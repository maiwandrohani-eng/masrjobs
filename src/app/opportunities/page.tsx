import { Suspense } from "react";
import { OpportunitiesPageClient } from "@/components/OpportunitiesPageClient";

export default function OpportunitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] bg-background px-4 py-10 text-sm text-foreground/60">
          Loading opportunities…
        </div>
      }
    >
      <OpportunitiesPageClient />
    </Suspense>
  );
}
