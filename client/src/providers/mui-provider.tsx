"use client";

import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "dayjs/locale/uk";
import "dayjs/locale/ru";

import { theme } from "../configs/mui.config";
import { ELocale } from "../i18n/routing";

export default function MuiProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme(locale as ELocale)}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
