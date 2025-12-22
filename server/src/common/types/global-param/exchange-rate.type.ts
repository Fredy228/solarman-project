import { ECurrency } from '@prisma/client';

export type TExchangeRates = {
  [key in ECurrency]: number;
};
