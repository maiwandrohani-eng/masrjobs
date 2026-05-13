import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <div className="min-h-[50vh] bg-background">
      <PageShell>
        <PageIntro
          title="Page not found"
          description="We could not find that page. It may have moved or the link may be incorrect."
        />
        <Link
          href="/"
          className="inline-block rounded-xl bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
        >
          Back to home
        </Link>
      </PageShell>
    </div>
  );
}
