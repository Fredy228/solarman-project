import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Script from "next/script";
import { Montserrat, Poppins } from "next/font/google";
import "./[locale]/globals.css";

import envConfig from "@/src/configs/env.config";
import MetaPixelPageView from "@/src/shared/analytics/MetaPixelPageView";
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
          buildUrl(normalizeLocale(locale), "/products/solar-panels") +
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
        {envConfig.META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${envConfig.META_PIXEL_ID}');
            `}
          </Script>
        )}
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
        {envConfig.META_PIXEL_ID && <MetaPixelPageView />}
        {envConfig.META_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${envConfig.META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
