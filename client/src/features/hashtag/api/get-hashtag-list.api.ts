import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IHashtag } from "../types/hashtag.interface";

export async function getHashtagsList(): Promise<IHashtag[] | null> {
  const hashtagsResponse = await fetchNative.fetchAPI(
    API_ROUTES.hashtag.list + `?_sort=id&_order=desc&_start=0&_end=100`,
    false,
    {
      method: "GET",
      next: { revalidate: 3600, tags: [CACHE_TAGS.hashtags] },
    },
  );

  if (!hashtagsResponse?.ok) {
    console.error("Failed to fetch hashtags");
    return null;
  }

  return hashtagsResponse.json() as Promise<IHashtag[]>;
}
