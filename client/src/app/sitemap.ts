import { getBlogList } from "@/src/features/blog/api/get-blog-list.api";
import { getGoodsList } from "@/src/features/goods/api/goods-list.api";
import { getPortfolio } from "@/src/features/portfolio/api/get-portfolio.api";
import { ELocale } from "@/src/i18n/routing";
import { SITE_URL } from "@/src/shared/utils/seo";
import type { MetadataRoute } from "next";

const locales: ELocale[] = [ELocale.UK, ELocale.RU];

function buildEntry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale === ELocale.UK ? "uk-UA" : "ru-UA",
          `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
        ]),
      ),
    },
  };
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
  const now = new Date();

  const staticEntries = STATIC_PATHS.map(({ path, changeFreq, priority }) =>
    buildEntry(path, now, changeFreq, priority),
  );

  // Fetch dynamic routes with graceful fallback
  const [blogResult, portfolioResult, goodsResult] = await Promise.allSettled([
    getBlogList({ order: "desc" }),
    getPortfolio({ page: 1 }),
    getGoodsList(),
  ]);

  const blogEntries: MetadataRoute.Sitemap = [];
  if (blogResult.status === "fulfilled" && blogResult.value) {
    const [items] = blogResult.value;
    for (const item of items) {
      blogEntries.push(
        buildEntry(
          `/blog/${item.tag}`,
          new Date(item.updatedAt),
          "weekly",
          0.7,
        ),
      );
    }
  }

  const projectEntries: MetadataRoute.Sitemap = [];
  if (portfolioResult.status === "fulfilled" && portfolioResult.value) {
    const [items] = portfolioResult.value;
    for (const item of items) {
      projectEntries.push(
        buildEntry(
          `/projects/${item.tag}`,
          new Date(item.date),
          "monthly",
          0.6,
        ),
      );
    }
  }

  const productEntries: MetadataRoute.Sitemap = [];
  if (goodsResult.status === "fulfilled" && goodsResult.value) {
    const { items } = goodsResult.value;
    for (const item of items) {
      productEntries.push(
        buildEntry(`/products/${item.tag}`, now, "weekly", 0.7),
      );
    }
  }

  return [
    ...staticEntries,
    ...blogEntries,
    ...projectEntries,
    ...productEntries,
  ];
}
