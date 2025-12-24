import { type ReactElement } from "react";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import { EProductStatus } from "@/src/shared/types/product-status.enum";

export const productStatusConfig: Record<
  EProductStatus,
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
  [EProductStatus.DRAFT]: {
    color: "default",
    icon: <EditIcon />,
  },
  [EProductStatus.PUBLISHED]: {
    color: "success",
    icon: <CheckCircleIcon />,
  },
  [EProductStatus.ARCHIVED]: {
    color: "warning",
    icon: <ArchiveIcon />,
  },
};
