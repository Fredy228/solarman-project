import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Montserrat, Poppins } from "next/font/google";
import "./[locale]/globals.css";

import envConfig from "@/src/configs/env.config";
import {
  OG_IMAGE_DEFAULT,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  buildUrl,
} from "@/src/shared/utils/seo";
import { normalizeLocale } from "@/src/shared/utils/localized-path";
import { buildOrganizationSchema } from "@/src/shared/utils/structured-data";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "optional",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  display: "optional",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Будуємо сонячні електростанції в Одесі та Одеській області. Окупність від 3 років, гарантія 15 років, кредит 0%.",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: OG_IMAGE_DEFAULT, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [OG_IMAGE_DEFAULT],
  },
  ...(envConfig.GSC_VERIFICATION && {
    verification: { google: envConfig.GSC_VERIFICATION },
  }),
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          buildUrl(normalizeLocale(locale), "/products") +
          "?title_like={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  const organizationSchema = buildOrganizationSchema();

  return (
    <html lang={locale}>
      {envConfig.GTM_ID && <GoogleTagManager gtmId={envConfig.GTM_ID} />}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]),
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${poppins.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
