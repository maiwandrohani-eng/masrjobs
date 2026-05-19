import { ContactContent } from "@/components/ContactContent";
import { getContactPublicData } from "@/lib/site-contact";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getContactPublicData();

  return <ContactContent contact={contact} />;
}
