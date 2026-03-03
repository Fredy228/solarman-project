import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import { TGetGoodsListParams, TGoodsListItem } from "../types/goods.interface";

// Parameters that are allowed for caching (pagination and sorting only)
const CACHEABLE_PARAMS = new Set(["_start", "_end", "_sort", "_order"]);

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
  searchParams.append("status", EProductStatus.PUBLISHED);

  const queryString = searchParams.toString();
  const path = `${API_ROUTES.goods.list}${queryString ? `?${queryString}` : ""}`;

  // Check if only cacheable parameters are present
  const paramKeys = Object.keys(params).filter(
    (key) =>
      params[key as keyof TGetGoodsListParams] !== undefined &&
      params[key as keyof TGetGoodsListParams] !== null &&
      params[key as keyof TGetGoodsListParams] !== "",
  );
  const hasOnlyCacheableParams = paramKeys.every((key) =>
    CACHEABLE_PARAMS.has(key),
  );

  // Use cache only if there are no filter parameters
  const fetchOptions = hasOnlyCacheableParams
    ? {
        method: "GET" as const,
        next: { revalidate: 300, tags: [CACHE_TAGS.goodsList] },
      }
    : {
        method: "GET" as const,
        cache: "no-store" as const,
      };

  const response = await fetchNative.fetchAPI(path, false, fetchOptions);

  if (!response?.ok) {
    console.error("Failed to fetch goods list", { params });
    return { items: [], total: 0 };
  }

  const total = Number(response.headers.get("X-Total-Count") ?? 0);
  const items = (await response.json()) as TGoodsListItem[];

  return { items, total };
}
