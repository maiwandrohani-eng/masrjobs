import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const demo = isDemoAuthEnabled();
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Account"
          title="Forgot your password?"
          description="Enter your work email. If an account exists and email delivery is configured, you will receive a link to choose a new password."
        />
        {demo ? (
          <div className="rounded-2xl border border-brand-border bg-white p-6 text-sm text-foreground/70 shadow-sm">
            Password reset is disabled while demo auth is on. Use any demo password, or turn off{" "}
            <code className="rounded bg-brand-muted/50 px-1">NEXT_PUBLIC_ENABLE_DEMO_AUTH</code>{" "}
            for real email-based reset.
            <p className="mt-4">
              <Link href="/login" className="font-semibold text-brand-gold underline">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <ForgotPasswordForm />
        )}
      </PageShell>
    </div>
  );
}
