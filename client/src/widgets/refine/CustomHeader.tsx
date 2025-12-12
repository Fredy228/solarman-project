"use client";

import { AppBar, Stack, Toolbar } from "@mui/material";
import { RefineThemedLayoutHeaderProps } from "@refinedev/mui";
import { HamburgerMenu } from "@refinedev/mui";

import { LanguageSwitcher } from "@/src/shared/ui/language-switcher/LanguageSwitcher";

export const CustomHeader: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky,
}) => {
  return (
    <AppBar
      position={sticky ? "sticky" : "relative"}
      color="default"
      elevation={1}
      sx={{ backgroundColor: "primary" }}
    >
      <Toolbar>
        <HamburgerMenu />

        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          <LanguageSwitcher />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
