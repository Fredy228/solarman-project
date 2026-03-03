import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { IGoodsLocalized } from "../types/goods.interface";

export async function getGoodsByTag(
  tag: string,
): Promise<IGoodsLocalized | null> {
  if (!tag) return null;

  const path = API_ROUTES.goods.getByTag(tag);
  const cacheTag = CACHE_TAGS.goodsId(tag);

  const response = await fetchNative.fetchAPI(path, false, {
    method: "GET",
    next: { revalidate: 3600, tags: [cacheTag] },
  });

  if (!response?.ok) {
    console.error("Failed to fetch goods by tag", {
      tag,
      status: response?.status,
    });
    return null;
  }

  return response.json() as unknown as IGoodsLocalized;
}
