import type { ECurrency } from "@/src/shared/types/currency.enum";

export type TExchangeRates = {
  [ECurrency.UAH]: number;
  [ECurrency.EUR]: number;
};

export type TExchangeRatesForm = {
  [ECurrency.UAH]: string;
  [ECurrency.EUR]: string;
};
