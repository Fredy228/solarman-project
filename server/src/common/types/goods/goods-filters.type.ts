import { GoodsCategory } from '@prisma/client';

export type TFilterValue = string | number;

export type TCategoryFilterFields = Record<GoodsCategory, readonly string[]>;

export type TBrandFilter = {
  id: string;
  name: string;
};

export type TGoodsCategoryFiltersMap = {
  PANEL: {
    type: TFilterValue[];
    power: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  INVERTOR: {
    type: TFilterValue[];
    power: TFilterValue[];
    phase: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  BATTERY: {
    type: TFilterValue[];
    capacity: TFilterValue[];
    voltage: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  FASTENER: {
    type: TFilterValue[];
    material: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  COMPONENT: {
    type: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  CHARGE_STATION: {
    power: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
  READY_MADE_SOLUTION: {
    power: TFilterValue[];
    country: TFilterValue[];
    brand: TBrandFilter[];
  };
};
