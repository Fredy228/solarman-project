import { Box } from "@mui/material";
import type { ReactNode } from "react";

export default function Section({ children }: { children?: ReactNode }) {
  return (
    <Box component="section" className="w-full pt-14 pb-14">
      {children}
    </Box>
  );
}
