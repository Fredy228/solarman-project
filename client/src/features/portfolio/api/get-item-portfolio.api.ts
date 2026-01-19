import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IPortfolio } from "../types/portfolio.interface";

type ResponseParams = {
  tag: string;
};

export async function getPortfolioItem({
  tag,
}: ResponseParams): Promise<IPortfolio | null> {
  const url = API_ROUTES.portfolio.getByTag(tag);

  const portfoliosResponse = await fetchNative.fetchAPI(url, false, {
    method: "GET",
    next: { revalidate: 3600, tags: [CACHE_TAGS.portfolioId(tag)] },
  });

  if (!portfoliosResponse?.ok) {
    console.error("Failed to fetch portfolio");
    return null;
  }

  return portfoliosResponse.json() as Promise<IPortfolio>;
}
