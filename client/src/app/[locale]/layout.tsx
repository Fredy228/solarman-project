import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Montserrat } from "next/font/google";
import { Suspense, use } from "react";
import "./globals.css";

import { routing } from "@/src/i18n/routing";
import MuiProvider from "@/src/providers/mui-provider";
import { UtmCaptureProvider } from "@/src/providers/utm-capture-provider";
import { OG_IMAGE_DEFAULT, SITE_NAME, SITE_URL } from "@/src/shared/utils/seo";
import { notFound } from "next/navigation";

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

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${montserrat.variable} antialiased`}>
        <NextIntlClientProvider>
          <MuiProvider locale={locale}>
            <Suspense fallback={null}>
              <UtmCaptureProvider />
            </Suspense>
            {children}
          </MuiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
