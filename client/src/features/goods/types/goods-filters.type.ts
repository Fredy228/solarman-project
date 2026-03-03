import { EGoodsCategory as GoodsCategory } from "./goods-category.enum";

export type TFilterValue = string | number;

export type TCategoryFilterFields = Record<GoodsCategory, readonly string[]>;

export type TBrandFilter = {
  id: string;
  name: string;
};

export type TCountryFilter = {
  code: string;
  label: string;
};

export type TGoodsCategoryFiltersMap = {
  PANEL: {
    type: TFilterValue[];
    power: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  INVERTOR: {
    type: TFilterValue[];
    power: TFilterValue[];
    phase: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  BATTERY: {
    type: TFilterValue[];
    capacity: TFilterValue[];
    voltage: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  FASTENER: {
    type: TFilterValue[];
    material: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  COMPONENT: {
    type: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  CHARGE_STATION: {
    power: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
  READY_MADE_SOLUTION: {
    power: TFilterValue[];
    country: TFilterValue[] | TCountryFilter[];
    brand: TBrandFilter[];
  };
};
