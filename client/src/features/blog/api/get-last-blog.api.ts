import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import type { IBlogItem } from "../types/blog.interface";

export async function getLastBlog(): Promise<IBlogItem[] | null> {
  const hashtagQuery = `?_sort=createdAt&_order=desc&_start=0&_end=4&status=${EProductStatus.PUBLISHED}`;

  const portfoliosResponse = await fetchNative.fetchAPI(
    API_ROUTES.blog.list + hashtagQuery,
    false,
    {
      method: "GET",
      next: { revalidate: 3600, tags: [CACHE_TAGS.blogList] },
    },
  );

  if (!portfoliosResponse?.ok) {
    console.error("Failed to fetch blog");
    return null;
  }

  return portfoliosResponse.json() as Promise<IBlogItem[]>;
}
