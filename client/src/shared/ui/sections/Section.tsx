import { Box, type BoxProps } from "@mui/material";
import type { ReactNode } from "react";

type Props = BoxProps & {
  children?: ReactNode;
};

export default function Section({ children, ...props }: Props) {
  return (
    <Box component="section" className="w-full pt-12 pb-12" {...props}>
      {children}
    </Box>
  );
}
