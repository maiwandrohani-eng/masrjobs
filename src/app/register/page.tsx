import { RegisterForm } from "@/components/RegisterForm";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function RegisterPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Join MasrJobs.org"
          title="Create your account"
          description="Choose whether you are applying for opportunities or posting them on behalf of an organization. Admin accounts are assigned separately in production."
        />
        <RegisterForm />
      </PageShell>
    </div>
  );
}
