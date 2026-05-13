import { ContactForm } from "@/components/ContactForm";
import { ContactSidebar } from "@/components/ContactSidebar";
import { PageIntro, PageShell } from "@/components/PageShell";
import { getContactPublicData } from "@/lib/site-contact";

export default async function ContactPage() {
  const contact = await getContactPublicData();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow="Contact"
          title="We would love to hear from you"
          description="Partnerships, media, employer onboarding, or technical support — send us a note and we will route it to the right team."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <ContactForm />
          <ContactSidebar data={contact} />
        </div>
      </PageShell>
    </div>
  );
}
