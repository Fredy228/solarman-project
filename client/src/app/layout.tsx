import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Montserrat } from "next/font/google";
import "./[locale]/globals.css";

import { OG_IMAGE_DEFAULT, SITE_NAME, SITE_URL } from "@/src/shared/utils/seo";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Будуємо сонячні електростанції в Одесі та Одеській області. Окупність від 3 років, гарантія 15 років, кредит 0%.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE_DEFAULT, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE_DEFAULT],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let locale = "uk";
  try {
    locale = await getLocale();
  } catch {
    // outside intl context (e.g. root not-found) — use default
  }

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
