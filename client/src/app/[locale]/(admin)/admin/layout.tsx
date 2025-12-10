"use client";

import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { GlobalStyles } from "@mui/material";
import {
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAlt from "@mui/icons-material/ListAlt";
import { useTranslations, useLocale } from "next-intl";

import { usePathname, useRouter } from "@/src/i18n/navigation";
import { authProvider } from "@/src/providers/authProvider";
import { ADMIN_PROTECTED_ROUTES } from "@/src/configs/routes.config";
import { ModifiedSider } from "@/src/widgets/refine/ModifiedSider";
import { dataProvider } from "@/src/providers/dataProvider";
import { accessControlProvider } from "@/src/providers/accessControlProvider";
import { CustomHeader } from "@/src/widgets/refine/CustomHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("refine");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const i18nProvider = {
    translate: (key: string, params: any) => {
      return t(key, params);
    },
    changeLocale: (lang: string) => {
      router.replace(pathname, { locale: lang });
    },
    getLocale: () => locale,
  };

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
            i18nProvider={i18nProvider}
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
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.edit,
                show: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.show,
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
              Header={CustomHeader}
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
