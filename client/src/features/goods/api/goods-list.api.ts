import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { TGetGoodsListParams, TGoodsListItem } from "../types/goods.interface";

export async function getGoodsList(
  params: Partial<TGetGoodsListParams> = {},
): Promise<{ items: TGoodsListItem[]; total: number }> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value
        .filter((item) => item !== undefined && item !== null && item !== "")
        .forEach((item) => {
          searchParams.append(key, String(item));
        });
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  const path = `${API_ROUTES.goods.list}${queryString ? `?${queryString}` : ""}`;

  const response = await fetchNative.fetchAPI(path, false, {
    method: "GET",
    next: { revalidate: 300, tags: [CACHE_TAGS.goodsList] },
  });

  if (!response?.ok) {
    console.error("Failed to fetch goods list", { params });
    return { items: [], total: 0 };
  }

  const total = Number(response.headers.get("X-Total-Count") ?? 0);
  const items = (await response.json()) as TGoodsListItem[];

  return { items, total };
}
