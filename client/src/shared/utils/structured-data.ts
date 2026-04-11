import { ELocale } from "@/src/i18n/routing";
import { absoluteUrl, buildUrl, SITE_NAME, SITE_URL } from "./seo";

type JsonLd = Record<string, unknown>;

const LABELS = {
  [ELocale.UK]: {
    home: "Головна",
    products: "Каталог",
    blog: "Блог",
    projects: "Проєкти",
  },
  [ELocale.RU]: {
    home: "Главная",
    products: "Каталог",
    blog: "Блог",
    projects: "Проекты",
  },
};

export function withoutEmptyValues<T extends JsonLd>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === undefined || item === null || item === "") return false;
      if (Array.isArray(item)) return item.length > 0;
      return true;
    }),
  ) as T;
}

export function buildBreadcrumbSchema(
  locale: ELocale,
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildUrl(locale, item.path),
    })),
  };
}

export function buildProductBreadcrumbSchema(
  locale: ELocale,
  productName: string,
  productPath: string,
): JsonLd {
  const labels = LABELS[locale];
  return buildBreadcrumbSchema(locale, [
    { name: labels.home, path: "/" },
    { name: labels.products, path: "/products" },
    { name: productName, path: productPath },
  ]);
}

export function buildBlogBreadcrumbSchema(
  locale: ELocale,
  articleTitle: string,
  articlePath: string,
): JsonLd {
  const labels = LABELS[locale];
  return buildBreadcrumbSchema(locale, [
    { name: labels.home, path: "/" },
    { name: labels.blog, path: "/blog" },
    { name: articleTitle, path: articlePath },
  ]);
}

export function buildProjectBreadcrumbSchema(
  locale: ELocale,
  projectTitle: string,
  projectPath: string,
): JsonLd {
  const labels = LABELS[locale];
  return buildBreadcrumbSchema(locale, [
    { name: labels.home, path: "/" },
    { name: labels.projects, path: "/projects" },
    { name: projectTitle, path: projectPath },
  ]);
}

export function buildOrganizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/og-default.jpg"),
  };
}
