export enum EStationType {
  HYBRID = 'HYBRID',
  NETWORK = 'NETWORK',
}

type TRangePower = {
  breakPoint: number;
  step: number;
};

type TRangeRatePerKWh = {
  breakPoint: number;
  rate: number;
};

type TMinMaxRange = {
  min: number;
  max: number;
};

export type TCalculatorProfit = {
  min_max_range_power: {
    [key in keyof typeof EStationType]: TMinMaxRange;
  };
  range_power: {
    [key in keyof typeof EStationType]: TRangePower[];
  };
  range_rate_per_kwh: {
    [key in keyof typeof EStationType]: TRangeRatePerKWh[];
  };
  station_operating_time: {
    [key in keyof typeof EStationType]: TMinMaxRange;
  };
  tariff: TMinMaxRange;
};
