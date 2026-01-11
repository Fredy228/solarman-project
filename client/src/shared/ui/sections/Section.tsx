import { Box } from "@mui/material";
import type { ReactNode } from "react";

export default function Section({ children }: { children?: ReactNode }) {
  return (
    <Box component="section" className="w-full pt-8 pb-8 md:pt-14 md:pb-14">
      {children}
    </Box>
  );
}
