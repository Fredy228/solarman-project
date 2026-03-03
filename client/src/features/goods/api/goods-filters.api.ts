import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EGoodsCategory } from "../types/goods-category.enum";
import { TGoodsCategoryFiltersMap } from "../types/goods-filters.type";

type ResponseParams = {
  category: EGoodsCategory;
};

export async function getGoodsFilters<C extends EGoodsCategory>({
  category,
}: ResponseParams): Promise<TGoodsCategoryFiltersMap[C] | null> {
  const url = API_ROUTES.goods.filters(category);

  const goodsFiltersResponse = await fetchNative.fetchAPI(url, false, {
    method: "GET",
    next: { revalidate: 300, tags: [CACHE_TAGS.goodsFilters] },
  });

  if (!goodsFiltersResponse?.ok) {
    console.error("Failed to fetch goods filters by category: ", category);
    return null;
  }

  return goodsFiltersResponse.json() as Promise<TGoodsCategoryFiltersMap[C]>;
}
