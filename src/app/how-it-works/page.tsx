import { PageShell } from "@/components/PageShell";
import { HowItWorksContent } from "@/components/HowItWorksContent";

export const metadata = {
  title: "How MasrJobs.org works",
  description:
    "Who can post listings, how review works, verified employers, and how applications flow on MasrJobs.org.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <HowItWorksContent />
      </PageShell>
    </div>
  );
}
