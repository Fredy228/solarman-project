"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { CssBaseline, GlobalStyles } from "@mui/material";
import {
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAlt from "@mui/icons-material/ListAlt";

import { authProvider } from "@/src/providers/authProvider";
import { theme } from "@/src/configs/mui.config";
import { ADMIN_PROTECTED_ROUTES } from "@/src/configs/routes.config";
import { ModifiedSider } from "@/src/widgets/refine/ModifiedSider";
import { dataProvider } from "@/src/providers/dataProvider";
import { accessControlProvider } from "@/src/providers/accessControlProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            authProvider={authProvider}
            notificationProvider={useNotificationProvider}
            dataProvider={dataProvider}
            accessControlProvider={accessControlProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableTelemetry: true,
            }}
            resources={[
              {
                name: "Dashboard",
                list: ADMIN_PROTECTED_ROUTES.dashboard,
                meta: {
                  label: "Головна",
                  icon: <DashboardIcon />,
                },
              },
              {
                name: "portfolio",
                list: ADMIN_PROTECTED_ROUTES.portfolio.list,
                create: ADMIN_PROTECTED_ROUTES.portfolio.create,
                edit: ADMIN_PROTECTED_ROUTES.portfolio.edit,
                show: ADMIN_PROTECTED_ROUTES.portfolio.show,
                meta: {
                  label: "Портфоліо",
                  icon: <ListAlt />,
                },
              },
            ]}
          >
            <ThemedLayout
              Sider={ModifiedSider}
              Title={() => <div>Admin Panel</div>}
            >
              {children}
            </ThemedLayout>

            <RefineKbar />
          </Refine>
        </RefineKbarProvider>
      </RefineSnackbarProvider>
    </>
  );
}
