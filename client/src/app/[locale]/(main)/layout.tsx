import Footer from "@/src/widgets/footer/Footer";
import Header from "@/src/widgets/header/Header";
import { Box } from "@mui/material";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Box component="main">{children}</Box>
      <Footer />
    </>
  );
}
