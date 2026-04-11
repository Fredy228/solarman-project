import { API_LIMITS_ITEMS } from "@/src/configs/api-routes.config";
import { getBlogList } from "@/src/features/blog/api/get-blog-list.api";
import { getGoodsList } from "@/src/features/goods/api/goods-list.api";
import type { TGoodsListItem } from "@/src/features/goods/types/goods.interface";
import { getPortfolio } from "@/src/features/portfolio/api/get-portfolio.api";
import { ELocale } from "@/src/i18n/routing";
import { buildLanguageAlternates, buildUrl } from "@/src/shared/utils/seo";
import type { MetadataRoute } from "next";

const locales: ELocale[] = [ELocale.UK, ELocale.RU];
const MAX_SITEMAP_PAGES = 100;
const MAX_SITEMAP_ITEMS = 5000;
const GOODS_SITEMAP_PAGE_SIZE = 100;

function buildEntry(
  locale: ELocale,
  path: string,
  lastModified: Date | undefined,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: buildUrl(locale, path),
    ...(lastModified && { lastModified }),
    changeFrequency,
    priority,
    alternates: {
      languages: buildLanguageAlternates(path),
    },
  };
}

function toValidDate(
  value: string | Date | null | undefined,
): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function collectPaginatedItems<T>(
  fetchPage: (page: number) => Promise<[T[], number] | null>,
  pageSize: number,
): Promise<T[]> {
  const items: T[] = [];
  let total = Infinity;
  let page = 1;

  while (
    page <= MAX_SITEMAP_PAGES &&
    items.length < total &&
    items.length < MAX_SITEMAP_ITEMS
  ) {
    const result = await fetchPage(page);
    if (!result) break;

    const [pageItems, pageTotal] = result;
    items.push(...pageItems);
    total = pageTotal;

    if (pageItems.length === 0 || pageItems.length < pageSize) break;
    page += 1;
  }

  return items.slice(0, MAX_SITEMAP_ITEMS);
}

async function collectGoodsItems() {
  const items: TGoodsListItem[] = [];
  let total = Infinity;
  let start = 0;

  while (start < total && items.length < MAX_SITEMAP_ITEMS) {
    const result = await getGoodsList({
      _start: start,
      _end: start + GOODS_SITEMAP_PAGE_SIZE,
      _sort: "updatedAt",
      _order: "desc",
    });

    items.push(...result.items);
    total = result.total;

    if (result.items.length === 0) break;
    start += GOODS_SITEMAP_PAGE_SIZE;
  }

  return items.slice(0, MAX_SITEMAP_ITEMS);
}

const STATIC_PATHS = [
  { path: "/", changeFreq: "weekly" as const, priority: 1.0 },
  { path: "/about", changeFreq: "monthly" as const, priority: 0.7 },
  { path: "/contacts", changeFreq: "monthly" as const, priority: 0.7 },
  { path: "/blog", changeFreq: "daily" as const, priority: 0.9 },
  { path: "/products", changeFreq: "daily" as const, priority: 0.9 },
  { path: "/projects", changeFreq: "weekly" as const, priority: 0.8 },
  { path: "/services/home", changeFreq: "monthly" as const, priority: 0.8 },
  {
    path: "/services/enterprise",
    changeFreq: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/services/backup-power",
    changeFreq: "monthly" as const,
    priority: 0.8,
  },
  {
    path: "/services/crediting",
    changeFreq: "monthly" as const,
    priority: 0.8,
  },
  { path: "/services/income", changeFreq: "monthly" as const, priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.flatMap(({ path, changeFreq, priority }) =>
    locales.map((locale) =>
      buildEntry(locale, path, undefined, changeFreq, priority),
    ),
  );

  // Fetch dynamic routes with graceful fallback
  const [blogResult, portfolioResult, goodsResult] = await Promise.allSettled([
    collectPaginatedItems(
      (page) => getBlogList({ page, order: "desc" }),
      API_LIMITS_ITEMS.blog,
    ),
    collectPaginatedItems(
      (page) => getPortfolio({ page }),
      API_LIMITS_ITEMS.portfolio,
    ),
    collectGoodsItems(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = [];
  if (blogResult.status === "fulfilled" && blogResult.value) {
    for (const item of blogResult.value) {
      for (const locale of locales) {
        blogEntries.push(
          buildEntry(
            locale,
            `/blog/${item.tag}`,
            toValidDate(item.updatedAt),
            "weekly",
            0.7,
          ),
        );
      }
    }
  }

  const projectEntries: MetadataRoute.Sitemap = [];
  if (portfolioResult.status === "fulfilled" && portfolioResult.value) {
    for (const item of portfolioResult.value) {
      for (const locale of locales) {
        projectEntries.push(
          buildEntry(
            locale,
            `/projects/${item.tag}`,
            toValidDate(item.updatedAt ?? item.date),
            "monthly",
            0.6,
          ),
        );
      }
    }
  }

  const productEntries: MetadataRoute.Sitemap = [];
  if (goodsResult.status === "fulfilled" && goodsResult.value) {
    for (const item of goodsResult.value) {
      for (const locale of locales) {
        productEntries.push(
          buildEntry(
            locale,
            `/products/${item.tag}`,
            toValidDate(item.updatedAt),
            "weekly",
            0.7,
          ),
        );
      }
    }
  }

  return [
    ...staticEntries,
    ...blogEntries,
    ...projectEntries,
    ...productEntries,
  ];
}
