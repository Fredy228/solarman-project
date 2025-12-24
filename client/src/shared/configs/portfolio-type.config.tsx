import { type ReactElement } from "react";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";

import { EPortfolioType } from "@/src/features/portfolio";

export const portfolioTypeConfig: Record<
  EPortfolioType,
  {
    color: "default";
    icon: ReactElement;
  }
> = {
  [EPortfolioType.ENTERPRISES]: {
    color: "default",
    icon: <BusinessIcon />,
  },
  [EPortfolioType.HOME]: {
    color: "default",
    icon: <HomeIcon />,
  },
};
