import { API_LIMITS_ITEMS, API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import type { IBlogItem } from "../types/blog.interface";

type Params = {
  page?: number;
  title_like?: string;
  order?: "asc" | "desc";
};

export async function getBlogList({
  page = 1,
  title_like,
  order = "desc",
}: Params): Promise<[IBlogItem[], number] | null> {
  const start = (page - 1) * API_LIMITS_ITEMS.blog;
  const end = start + API_LIMITS_ITEMS.blog;

  const searchParams = new URLSearchParams({
    _sort: "createdAt",
    _order: order,
    _start: String(start),
    _end: String(end),
    status: EProductStatus.PUBLISHED,
  });

  if (title_like) {
    searchParams.set("title_like", title_like);
  }

  const path = `${API_ROUTES.blog.list}?${searchParams.toString()}`;

  const hasFilters = title_like !== undefined && title_like !== "";
  const fetchOptions = hasFilters
    ? { method: "GET" as const, cache: "no-store" as const }
    : {
        method: "GET" as const,
        next: { revalidate: 3600, tags: [CACHE_TAGS.blogList] },
      };

  const response = await fetchNative.fetchAPI(path, false, fetchOptions);

  if (!response?.ok) {
    console.error("Failed to fetch blog list");
    return null;
  }

  return [
    (await response.json()) as IBlogItem[],
    Number(response.headers.get("X-Total-Count")),
  ];
}
