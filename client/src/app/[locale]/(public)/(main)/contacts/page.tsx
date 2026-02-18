import { getContacts } from "@/src/features/global-params/api/get-contacts.api";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import ContactsInfo from "@/src/widgets/contacts-info/ContactsInfo";
import IntroContacts from "@/src/widgets/intro-contacts/IntroContacts";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <>
      <IntroContacts />
      <ContactsInfo contactsData={contacts?.value || null} />
      <ConsultSection />
    </>
  );
}
