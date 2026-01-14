import { getContacts } from "@/src/features/global-params/api/get-contacts.api";
import Footer from "@/src/widgets/footer/Footer";
import Header from "@/src/widgets/header/Header";
import { Box } from "@mui/material";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contacts = await getContacts();
  return (
    <>
      <Header contactsData={contacts?.value || null} />
      <Box component="main">{children}</Box>
      <Footer />
    </>
  );
}
