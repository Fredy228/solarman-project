import { ECurrency } from '@prisma/client';

export type TExchangeRates = {
  [ECurrency.UAH]: number;
  [ECurrency.EUR]: number;
};
