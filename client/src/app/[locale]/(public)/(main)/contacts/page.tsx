import { getContacts } from "@/src/features/global-params/api/get-contacts.api";
import type { ELocale } from "@/src/i18n/routing";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import { buildMetadata } from "@/src/shared/utils/seo";
import ContactsInfo from "@/src/widgets/contacts-info/ContactsInfo";
import IntroContacts from "@/src/widgets/intro-contacts/IntroContacts";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/contacts",
    titles: {
      uk: "Контакти",
      ru: "Контакты",
    },
    descriptions: {
      uk: "Зв'яжіться з нами для безкоштовної консультації щодо встановлення сонячної електростанції в Одесі. Телефон, адреса та графік роботи SolarMan.",
      ru: "Свяжитесь с нами для бесплатной консультации по установке солнечной электростанции в Одессе. Телефон, адрес и график работы SolarMan.",
    },
  });
}

export default async function ContactsPage({ params }: Props) {
  const contacts = await getContacts();

  return (
    <>
      <IntroContacts />
      <ContactsInfo contactsData={contacts?.value || null} />
      <ConsultSection />
    </>
  );
}
