import { GoodsCategory } from '@prisma/client';

export type TFilterValue = string | number;

export type TCategoryFilterFields = Record<GoodsCategory, readonly string[]>;

export type TGoodsCategoryFiltersMap = {
  PANEL: {
    type: TFilterValue[];
    power: TFilterValue[];
  };
  INVERTOR: {
    type: TFilterValue[];
    power: TFilterValue[];
    phase: TFilterValue[];
  };
  BATTERY: {
    type: TFilterValue[];
    capacity: TFilterValue[];
    voltage: TFilterValue[];
  };
  FASTENER: {
    type: TFilterValue[];
    material: TFilterValue[];
  };
  COMPONENT: {
    type: TFilterValue[];
  };
  CHARGE_STATION: {
    power: TFilterValue[];
  };
  READY_MADE_SOLUTION: {
    power: TFilterValue[];
  };
};
