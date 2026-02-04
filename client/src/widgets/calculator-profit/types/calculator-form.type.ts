import type { EStationType } from "@/src/features/global-params";

export type TCalculatorForm = {
  stationType: EStationType;
  tariff: string;
  operatingTime: string;
};
