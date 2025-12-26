import { type ReactElement } from "react";
import { ArrowUpNarrowWide, Percent, Warehouse } from "lucide-react";

import { EBadgeType } from "@/src/features/goods/types/goods-badge-type.enum";

export const goodsBadgeConfig: Record<
  EBadgeType,
  {
    color:
      | "default"
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning";
    icon: ReactElement;
  }
> = {
  [EBadgeType.SALE]: {
    color: "error",
    icon: <Percent />,
  },
  [EBadgeType.PRICE_INCREASE_PLANNED]: {
    color: "warning",
    icon: <ArrowUpNarrowWide />,
  },
  [EBadgeType.LOW_STOCK]: {
    color: "info",
    icon: <Warehouse />,
  },
};
