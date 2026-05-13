import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

export default function ResetPasswordPage() {
  const demo = isDemoAuthEnabled();
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Account"
          title="Set a new password"
          description="Choose a strong password you have not used elsewhere."
        />
        {demo ? (
          <div className="rounded-2xl border border-brand-border bg-white p-6 text-sm text-foreground/70 shadow-sm">
            Password reset is disabled while demo auth is on.
            <p className="mt-4">
              <Link href="/login" className="font-semibold text-brand-gold underline">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <Suspense fallback={<p className="text-sm text-foreground/60">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
        )}
      </PageShell>
    </div>
  );
}
