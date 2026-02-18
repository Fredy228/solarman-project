import SendRequestModal from "@/src/widgets/send-request/SendRequestModal";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <SendRequestModal />
    </>
  );
}
