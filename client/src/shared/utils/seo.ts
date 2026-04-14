import envConfig from "@/src/configs/env.config";
import { ELocale } from "@/src/i18n/routing";
import type { Metadata } from "next";
import { buildLocalizedPath, buildLocalizedUrl } from "./localized-path";

export const SITE_URL = `${envConfig.SERVER_PROTOCOL}://${envConfig.SERVER_HOST}`;

export const SITE_NAME = "SolarMan";
export const TWITTER_HANDLE = "@solarman_od";

export const OG_IMAGE_DEFAULT = `${SITE_URL}/og-default.jpg`;

export function stripSiteNameSuffix(title: string): string {
  return title
    .replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`, "i"), "")
    .trim();
}

export function buildSeoTitle(title: string): string {
  const cleanTitle = stripSiteNameSuffix(title);
  if (!cleanTitle || cleanTitle === SITE_NAME) return SITE_NAME;
  return `${cleanTitle} | ${SITE_NAME}`;
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  return {
    "uk-UA": buildUrl(ELocale.UK, path),
    "ru-UA": buildUrl(ELocale.RU, path),
    "x-default": buildUrl(ELocale.UK, path),
  };
}

export function absoluteUrl(url: string | null | undefined): string {
  if (!url) return OG_IMAGE_DEFAULT;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function hasMeaningfulSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  return Object.values(searchParams).some((value) => {
    if (Array.isArray(value)) return value.some((item) => item.length > 0);
    return Boolean(value);
  });
}

/** Build a locale-aware relative pathname. */
export function buildPath(locale: ELocale, path: string): string {
  return buildLocalizedPath(locale, path);
}

/** Build a full URL for a given pathname respecting locale prefix rules. */
export function buildUrl(locale: ELocale, path: string): string {
  return buildLocalizedUrl(SITE_URL, locale, path);
}

/**
 * Returns localized metadata for a page.
 * Handles: title, description, canonical, Open Graph, Twitter Cards, and
 * hreflang alternates. The HTML title is branded by Next metadata template;
 * social titles are branded here because templates do not affect them.
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
  const title = stripSiteNameSuffix(titles[locale]);
  const fullTitle = buildSeoTitle(title);
  const description = descriptions[locale];
  const canonicalUrl = buildUrl(locale, path);

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.[locale],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(path),
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
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
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
