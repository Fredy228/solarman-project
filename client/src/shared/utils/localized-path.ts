import { ELocale } from "@/src/i18n/routing";

const normalizePath = (path: string): string => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export function normalizeLocale(locale?: string | null): ELocale {
  return locale === ELocale.RU ? ELocale.RU : ELocale.UK;
}

export function getStoredLocale(): ELocale {
  if (typeof document === "undefined") {
    return ELocale.UK;
  }

  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  return normalizeLocale(match ? decodeURIComponent(match[1]) : null);
}

export function buildLocalizedPath(
  locale: ELocale | string,
  path: string,
): string {
  const resolvedLocale = normalizeLocale(locale);
  const normalizedPath = normalizePath(path);

  if (resolvedLocale === ELocale.UK) {
    return normalizedPath;
  }

  return normalizedPath === "/"
    ? `/${resolvedLocale}`
    : `/${resolvedLocale}${normalizedPath}`;
}

export function buildLocalizedUrl(
  baseUrl: string,
  locale: ELocale | string,
  path: string,
): string {
  return `${baseUrl}${buildLocalizedPath(locale, path)}`;
}
