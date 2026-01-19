import { API_LIMITS_ITEMS, API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import type { IPortfolioItem } from "../types/portfolio.interface";

type ResponseParams = {
  page?: number;
  hashtag?: string;
};

export async function getPortfolio({
  page = 1,
  hashtag,
}: ResponseParams): Promise<[IPortfolioItem[], number] | null> {
  const start = (page - 1) * API_LIMITS_ITEMS.portfolio;
  const end = start + API_LIMITS_ITEMS.portfolio;

  let url =
    API_ROUTES.portfolio.list +
    `?_sort=date&_order=desc&_start=${start}&_end=${end}&status=${EProductStatus.PUBLISHED}`;

  if (hashtag) url += `&hashtag=${hashtag}`;

  const portfoliosResponse = await fetchNative.fetchAPI(url, false, {
    method: "GET",
    next: { revalidate: 3600, tags: [CACHE_TAGS.portfolioList] },
  });

  if (!portfoliosResponse?.ok) {
    console.error("Failed to fetch portfolio");
    return null;
  }

  return [
    (await portfoliosResponse.json()) as IPortfolioItem[],
    Number(portfoliosResponse.headers.get("X-Total-Count")),
  ];
}
