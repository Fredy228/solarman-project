import { Box, Container } from "@mui/material";
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

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const isGoodsCategory = (
  value: string | null | undefined,
): value is EGoodsCategory => {
  if (!value) return false;
  return Object.values(EGoodsCategory).includes(value as EGoodsCategory);
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refine" });
  const searchParamsResolved = await searchParams;

  const categoryValueRaw = searchParamsResolved.category;
  const categoryValue = Array.isArray(categoryValueRaw)
    ? categoryValueRaw[0]
    : categoryValueRaw;

  const category = isGoodsCategory(categoryValue)
    ? categoryValue
    : EGoodsCategory.PANEL;

  const pageRaw = searchParamsResolved.page;
  const pageValue = Array.isArray(pageRaw) ? pageRaw[0] : pageRaw;
  const page = pageValue ? Math.max(1, Number.parseInt(pageValue, 10) || 1) : 1;

  const sortRaw = searchParamsResolved._sort;
  const sortValue = Array.isArray(sortRaw) ? sortRaw[0] : sortRaw;
  const orderRaw = searchParamsResolved._order;
  const orderValue = Array.isArray(orderRaw) ? orderRaw[0] : orderRaw;

  const titleRaw = searchParamsResolved.title_like;
  const titleValue = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw;

  const toStringArray = (value: string | string[] | undefined) => {
    if (!value) return undefined;
    return (Array.isArray(value) ? value : [value]).filter(
      (item) => item !== "",
    );
  };

  const toNumberArray = (value: string | string[] | undefined) => {
    const values = toStringArray(value);
    if (!values) return undefined;

    const numbers = values
      .map((item) => Number(item))
      .filter((item) => !Number.isNaN(item));

    return numbers.length > 0 ? numbers : undefined;
  };

  const goodsFilters = await getGoodsFilters({ category });
  const exchangeRate = await getExchangeRate();

  const goodsListResponse = await getGoodsList({
    _start: (page - 1) * API_LIMITS_ITEMS.goods,
    _end: page * API_LIMITS_ITEMS.goods,
    _sort: sortValue || "updatedAt",
    _order: orderValue === "asc" ? "asc" : "desc",
    category,
    title_like: titleValue || "",
    type: toStringArray(searchParamsResolved.type),
    material: toStringArray(searchParamsResolved.material),
    power: toNumberArray(searchParamsResolved.power),
    phase: toNumberArray(searchParamsResolved.phase),
    capacity: toNumberArray(searchParamsResolved.capacity),
    voltage: toNumberArray(searchParamsResolved.voltage),
  });

  const goodsItems = goodsListResponse.items ?? [];
  const goodsTotal = goodsListResponse.total ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(goodsTotal / API_LIMITS_ITEMS.goods),
  );

  const sidebarStateKey = [
    category,
    searchParamsResolved.type,
    searchParamsResolved.power,
    searchParamsResolved.phase,
    searchParamsResolved.capacity,
    searchParamsResolved.voltage,
    searchParamsResolved.material,
  ]
    .map((value) => (Array.isArray(value) ? value.join("|") : (value ?? "")))
    .join("::");

  return (
    <Box>
      <Container maxWidth="xl">
        <Box height={70} />
        <GoodsShopToolbar />

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <GoodsFiltersSidebar
            key={sidebarStateKey}
            fields={goodsFilters as Record<string, (string | number)[]> | null}
            category={category}
          />
          <Box sx={{ flex: 1, minHeight: "100vh" }}>
            <GoodsCardGrid
              items={goodsItems}
              locale={locale as ELocale}
              emptyText={t("goods.empty")}
              exchangeRate={exchangeRate?.value ?? null}
            />
            <Box mt={3}>
              <PaginationCustom count={totalPages} page={page} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
