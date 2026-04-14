import { Box, Container, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { API_LIMITS_ITEMS } from "@/src/configs/api-routes.config";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { getGoodsFilters } from "@/src/features/goods/api/goods-filters.api";
import { getGoodsList } from "@/src/features/goods/api/goods-list.api";
import {
  GoodsCardGrid,
  GoodsFiltersSidebar,
  GoodsShopToolbar,
} from "@/src/features/goods/components";
import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { ELocale } from "@/src/i18n/routing";
import PaginationCustom from "@/src/shared/ui/pagination/PaginationCustom";
import { buildUrl, SITE_URL } from "@/src/shared/utils/seo";
import { buildBreadcrumbSchema } from "@/src/shared/utils/structured-data";
import { PRODUCT_CATEGORY_SEO, type ProductsSeoConfig } from "./products-seo";

export type ProductsSearchParams = {
  [key: string]: string | string[] | undefined;
};

type ProductsCatalogProps = {
  locale: ELocale;
  searchParams: ProductsSearchParams;
  seo: ProductsSeoConfig;
  fixedCategory?: EGoodsCategory;
};

const isGoodsCategory = (
  value: string | null | undefined,
): value is EGoodsCategory => {
  if (!value) return false;
  return Object.values(EGoodsCategory).includes(value as EGoodsCategory);
};

const toStringArray = (value: string | string[] | undefined) => {
  if (!value) return undefined;
  return (Array.isArray(value) ? value : [value]).filter((item) => item !== "");
};

const toNumberArray = (value: string | string[] | undefined) => {
  const values = toStringArray(value);
  if (!values) return undefined;

  const numbers = values
    .map((item) => Number(item))
    .filter((item) => !Number.isNaN(item));

  return numbers.length > 0 ? numbers : undefined;
};

const getFirstParamValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const CATEGORY_LABELS: Record<ELocale, Record<EGoodsCategory, string>> = {
  [ELocale.UK]: {
    [EGoodsCategory.PANEL]: "Сонячні панелі",
    [EGoodsCategory.INVERTOR]: "Інвертори",
    [EGoodsCategory.BATTERY]: "Акумулятори",
    [EGoodsCategory.FASTENER]: "Кріплення",
    [EGoodsCategory.COMPONENT]: "Компоненти",
    [EGoodsCategory.CHARGE_STATION]: "Зарядні станції",
    [EGoodsCategory.READY_MADE_SOLUTION]: "Готові комплекти",
  },
  [ELocale.RU]: {
    [EGoodsCategory.PANEL]: "Солнечные панели",
    [EGoodsCategory.INVERTOR]: "Инверторы",
    [EGoodsCategory.BATTERY]: "Аккумуляторы",
    [EGoodsCategory.FASTENER]: "Крепления",
    [EGoodsCategory.COMPONENT]: "Компоненты",
    [EGoodsCategory.CHARGE_STATION]: "Зарядные станции",
    [EGoodsCategory.READY_MADE_SOLUTION]: "Готовые комплекты",
  },
};

const buildCategoryOptions = (locale: ELocale) =>
  Object.entries(PRODUCT_CATEGORY_SEO).map(([, item]) => ({
    value: item.category,
    label: CATEGORY_LABELS[locale][item.category],
    href: item.path,
  }));

export default async function ProductsCatalog({
  locale,
  searchParams,
  seo,
  fixedCategory,
}: ProductsCatalogProps) {
  const t = await getTranslations({ locale, namespace: "refine" });

  const categoryValue = getFirstParamValue(searchParams.category);
  const category =
    fixedCategory ??
    (isGoodsCategory(categoryValue) ? categoryValue : EGoodsCategory.PANEL);

  const pageValue = getFirstParamValue(searchParams.page);
  const page = pageValue ? Math.max(1, Number.parseInt(pageValue, 10) || 1) : 1;

  const sortValue = getFirstParamValue(searchParams._sort);
  const orderValue = getFirstParamValue(searchParams._order);
  const titleValue = getFirstParamValue(searchParams.title_like);

  const [goodsFilters, exchangeRate, goodsListResponse] = await Promise.all([
    getGoodsFilters({ category }),
    getExchangeRate(),
    getGoodsList({
      _start: (page - 1) * API_LIMITS_ITEMS.goods,
      _end: page * API_LIMITS_ITEMS.goods,
      _sort: sortValue || "updatedAt",
      _order: orderValue === "asc" ? "asc" : "desc",
      category,
      title_like: titleValue || "",
      type: toStringArray(searchParams.type),
      material: toStringArray(searchParams.material),
      power: toNumberArray(searchParams.power),
      phase: toNumberArray(searchParams.phase),
      capacity: toNumberArray(searchParams.capacity),
      voltage: toNumberArray(searchParams.voltage),
      country: toStringArray(searchParams.country),
      brand: toStringArray(searchParams.brand),
    }),
  ]);

  const goodsItems = goodsListResponse.items ?? [];
  const goodsTotal = goodsListResponse.total ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(goodsTotal / API_LIMITS_ITEMS.goods),
  );

  const sidebarStateKey = [
    category,
    searchParams.type,
    searchParams.power,
    searchParams.phase,
    searchParams.capacity,
    searchParams.voltage,
    searchParams.material,
    searchParams.country,
    searchParams.brand,
  ]
    .map((value) => (Array.isArray(value) ? value.join("|") : (value ?? "")))
    .join("::");

  const canonicalUrl = buildUrl(locale, seo.path);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${canonicalUrl}#collection`,
    name: seo.titles[locale],
    description: seo.descriptions[locale],
    url: canonicalUrl,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: goodsItems.length,
      itemListElement: goodsItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: buildUrl(locale, `/products/${item.tag}`),
        name: item.title[locale],
      })),
    },
  };
  const breadcrumbSchema = buildBreadcrumbSchema(locale, [
    { name: locale === ELocale.UK ? "Головна" : "Главная", path: "/" },
    { name: locale === ELocale.UK ? "Каталог" : "Каталог", path: "/products" },
    { name: seo.titles[locale], path: seo.path },
  ]);
  const categoryOptions = buildCategoryOptions(locale);

  return (
    <Box>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Container maxWidth="xl">
        <Box height={70} />
        <Box mb={1.5}>
          <Typography
            component="h1"
            fontSize={{ xs: "22px", md: "28px" }}
            fontWeight={700}
            color="var(--color-text-g2)"
          >
            {seo.titles[locale]}
          </Typography>
        </Box>

        <GoodsShopToolbar
          fixedCategory={fixedCategory}
          categoryOptions={categoryOptions}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <GoodsFiltersSidebar
            key={sidebarStateKey}
            fields={goodsFilters as Record<string, (string | number)[]> | null}
            category={category}
            locale={locale}
          />
          <Box sx={{ flex: 1, minHeight: "calc(100vh - 250px)" }}>
            <GoodsCardGrid
              items={goodsItems}
              locale={locale}
              emptyText={t("goods.empty")}
              exchangeRate={exchangeRate?.value ?? null}
            />
            <Box mt={3}>
              <PaginationCustom count={totalPages} page={page} />
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 5, md: 7 },
            mb: { xs: 5, md: 7 },
            maxWidth: 980,
          }}
        >
          <Typography
            component="h2"
            fontSize={{ xs: "22px", md: "28px" }}
            fontWeight={700}
            color="var(--color-text-g2)"
            mb={2}
          >
            {seo.footerTitle[locale]}
          </Typography>
          <Stack spacing={1.5}>
            <Typography component="p" color="var(--color-text-g3)">
              {seo.intro[locale]}
            </Typography>
            {seo.footerText[locale].map((item) => (
              <Typography key={item} component="p" color="var(--color-text-g3)">
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
