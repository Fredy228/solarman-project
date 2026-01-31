import { API_ROUTES } from "@/src/configs/api-routes.config";
import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import fetchNative from "@/src/libs/fetch-native";
import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import type { TCalculatorProfit } from "../types/calculator-profit.type";

export async function getCalculatorProfit(): Promise<IGlobalParam<TCalculatorProfit> | null> {
  const calculatorProfitResponse = await fetchNative.fetchAPI(
    API_ROUTES.globalParams.calculatorProfit,
    false,
    {
      method: "GET",
      next: { revalidate: 1000, tags: [CACHE_TAGS.calculatorProfit] },
    },
  );

  if (!calculatorProfitResponse?.ok) {
    console.error("Failed to fetch calculator profit");
    return null;
  }

  return calculatorProfitResponse.json() as Promise<
    IGlobalParam<TCalculatorProfit>
  >;
}
