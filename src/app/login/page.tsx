import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Welcome back"
          title="Sign in to MasrJobs.org"
          description="Access your applicant workspace, employer tools, or admin console. Production builds use secure credentials; enable demo auth only for local UX previews."
        />
        <Suspense fallback={<p className="text-sm text-foreground/60">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-foreground/55">
          <Link href="/privacy" className="underline hover:text-brand-navy">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-brand-navy">
            Terms
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
