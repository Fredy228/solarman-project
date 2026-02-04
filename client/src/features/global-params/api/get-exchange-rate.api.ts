import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import type { TExchangeRates } from "../types/exchange-rate.type";

export async function getExchangeRate(): Promise<IGlobalParam<TExchangeRates> | null> {
  const exchangeRateResponse = await fetchNative.fetchAPI(
    API_ROUTES.globalParams.exchangeRate,
    false,
    {
      method: "GET",
      next: { revalidate: 1000, tags: [CACHE_TAGS.exchangeRate] },
    },
  );

  if (!exchangeRateResponse?.ok) {
    console.error("Failed to fetch exchange rate");
    return null;
  }

  return exchangeRateResponse.json() as Promise<IGlobalParam<TExchangeRates>>;
}
