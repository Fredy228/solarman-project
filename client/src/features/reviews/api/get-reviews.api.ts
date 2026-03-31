import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import type { ELocale } from "@/src/i18n/routing";
import fetchNative from "@/src/libs/fetch-native";
import type { IReview } from "@/src/features/reviews";

export async function getReviews(locale: ELocale): Promise<IReview[] | null> {
  const response = await fetchNative.fetchAPI(
    API_ROUTES.reviews.list + `?lang=${locale}`,
    false,
    {
      method: "GET",
      headers: {
        "Accept-Language": locale,
      },
      next: { revalidate: 3600, tags: [CACHE_TAGS.reviews] },
    },
  );

  if (!response?.ok) {
    console.error("Failed to fetch Google reviews");
    return null;
  }

  return response.json() as Promise<IReview[]>;
}
