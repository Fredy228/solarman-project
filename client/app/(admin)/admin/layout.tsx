"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import {
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";

import routerProvider from "@refinedev/nextjs-router";
import { authProvider } from "@/src/providers/authProvider";
import { theme } from "@/src/configs/mui.config";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            resources={[
              {
                name: "dashboard",
                list: "/admin",
              },
            ]}
          >
            <ThemedLayout Title={() => <div>Admin Panel</div>}>
              {children}
            </ThemedLayout>

            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </RefineSnackbarProvider>
    </ThemeProvider>
  );
}
