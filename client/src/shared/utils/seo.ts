import envConfig from "@/src/configs/env.config";
import { ELocale } from "@/src/i18n/routing";
import type { Metadata } from "next";

export const SITE_URL = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}`;

export const SITE_NAME = "SolarMan";

export const OG_IMAGE_DEFAULT = `${SITE_URL}/og-default.jpg`;

/** Build a full URL for a given pathname respecting locale prefix. */
export function buildUrl(locale: ELocale, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Returns localized metadata for a page.
 * Handles: title (with "| SolarMan" suffix), description, canonical, Open Graph,
 * Twitter Cards, and hreflang alternates.
 */
export function buildMetadata({
  locale,
  path,
  titles,
  descriptions,
  keywords,
  noIndex = false,
}: {
  locale: ELocale;
  /** Pathname without locale prefix, e.g. "/" or "/about" */
  path: string;
  titles: Record<ELocale, string>;
  descriptions: Record<ELocale, string>;
  keywords?: Record<ELocale, string[]>;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${titles[locale]} | ${SITE_NAME}`;
  const description = descriptions[locale];
  const canonicalUrl = buildUrl(locale, path);

  const metadata: Metadata = {
    title: { absolute: fullTitle },
    description,
    keywords: keywords?.[locale],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "uk-UA": buildUrl(ELocale.UK, path),
        "ru-UA": buildUrl(ELocale.RU, path),
      },
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      locale: locale === ELocale.UK ? "uk_UA" : "ru_UA",
      alternateLocale: locale === ELocale.UK ? "ru_UA" : "uk_UA",
      images: [
        {
          url: OG_IMAGE_DEFAULT,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE_DEFAULT],
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    };
  }

  return metadata;
}
