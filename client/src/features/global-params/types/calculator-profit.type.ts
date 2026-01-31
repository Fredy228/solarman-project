export enum EStationType {
  HYBRID = "HYBRID",
  NETWORK = "NETWORK",
}

export type TRangePower = {
  breakPoint: number;
  step: number;
};

export type TRangeRatePerKWh = {
  breakPoint: number;
  rate: number;
};

export type TMinMaxRange = {
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

export type TRangePowerForm = {
  breakPoint: string;
  step: string;
};

export type TRangeRatePerKWhForm = {
  breakPoint: string;
  rate: string;
};

export type TMinMaxRangeForm = {
  min: string;
  max: string;
};

export type TCalculatorProfitForm = {
  min_max_range_power: {
    [key in keyof typeof EStationType]: TMinMaxRangeForm;
  };
  range_power: {
    [key in keyof typeof EStationType]: TRangePowerForm[];
  };
  range_rate_per_kwh: {
    [key in keyof typeof EStationType]: TRangeRatePerKWhForm[];
  };
  station_operating_time: {
    [key in keyof typeof EStationType]: TMinMaxRangeForm;
  };
  tariff: TMinMaxRangeForm;
};
