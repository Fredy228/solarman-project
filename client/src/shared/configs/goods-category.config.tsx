import { type ReactElement } from "react";
import {
  BatteryCharging,
  CirclePile,
  EvCharger,
  HousePlug,
  Puzzle,
  SaudiRiyal,
  SolarPanel,
} from "lucide-react";

import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";

export const goodsCategoryConfig: Record<
  EGoodsCategory,
  {
    color: "default";
    icon: ReactElement;
  }
> = {
  [EGoodsCategory.PANEL]: {
    color: "default",
    icon: <SolarPanel />,
  },
  [EGoodsCategory.INVERTOR]: {
    color: "default",
    icon: <CirclePile />,
  },
  [EGoodsCategory.BATTERY]: {
    color: "default",
    icon: <BatteryCharging />,
  },
  [EGoodsCategory.FASTENER]: {
    color: "default",
    icon: <SaudiRiyal />,
  },
  [EGoodsCategory.COMPONENT]: {
    color: "default",
    icon: <Puzzle />,
  },
  [EGoodsCategory.CHARGE_STATION]: {
    color: "default",
    icon: <EvCharger />,
  },
  [EGoodsCategory.READY_MADE_SOLUTION]: {
    color: "default",
    icon: <HousePlug />,
  },
};
