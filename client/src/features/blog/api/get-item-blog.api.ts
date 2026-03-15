import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IBlog } from "../types/blog.interface";

type Params = {
  tag: string;
};

export async function getBlogItem({ tag }: Params): Promise<IBlog | null> {
  const url = API_ROUTES.blog.getByTag(tag);

  const response = await fetchNative.fetchAPI(url, false, {
    method: "GET",
    next: { revalidate: 3600, tags: [CACHE_TAGS.blogId(tag)] },
  });

  if (!response?.ok) {
    console.error("Failed to fetch blog item");
    return null;
  }

  return response.json() as Promise<IBlog>;
}
