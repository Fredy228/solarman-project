import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import type { IPortfolioItem } from "../types/portfolio.interface";

export async function getLastPortfolio(): Promise<IPortfolioItem[] | null> {
  const portfoliosResponse = await fetchNative.fetchAPI(
    API_ROUTES.portfolio.list +
      `?_sort=date&_order=desc&_start=0&_end=4&status=${EProductStatus.PUBLISHED}`,
    false,
    {
      method: "GET",
      next: { revalidate: 3600, tags: [CACHE_TAGS.portfolioList] },
    },
  );

  if (!portfoliosResponse?.ok) {
    console.error("Failed to fetch portfolio");
    return null;
  }

  return portfoliosResponse.json() as Promise<IPortfolioItem[]>;
}
