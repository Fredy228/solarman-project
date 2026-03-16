import { CartAnimationProvider } from "@/src/features/cart/context/CartAnimationContext";
import { getContacts } from "@/src/features/global-params/api/get-contacts.api";
import Footer from "@/src/widgets/footer/Footer";
import Header from "@/src/widgets/header/Header";
import { Box } from "@mui/material";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contacts = await getContacts();
  return (
    <CartAnimationProvider>
      <Box className="flex flex-col min-h-screen">
        <Header contactsData={contacts?.value || null} />
        <Box component="main">{children}</Box>
        <Footer contactsData={contacts?.value || null} />
      </Box>
    </CartAnimationProvider>
  );
}
