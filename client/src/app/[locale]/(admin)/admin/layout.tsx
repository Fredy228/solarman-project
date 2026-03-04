"use client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import { GlobalStyles } from "@mui/material";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  RefineSnackbarProvider,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import {
  Building2,
  Calculator,
  CircleDollarSign,
  Contact,
  FileCodeCorner,
  GalleryVerticalEnd,
  Hash,
  Images,
  Mails,
  Settings2,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

import { ADMIN_PROTECTED_ROUTES } from "@/src/configs/routes.config";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { accessControlProvider } from "@/src/providers/accessControlProvider";
import { authProvider } from "@/src/providers/authProvider";
import { dataProvider } from "@/src/providers/dataProvider";
import { CustomHeader } from "@/src/widgets/refine/CustomHeader";
import { ModifiedSider } from "@/src/widgets/refine/ModifiedSider";

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
                  label: t("common.main"),
                  icon: <DashboardIcon />,
                },
              },
              {
                name: "main-site",
                list: "/",
                meta: {
                  label: t("common.site"),
                  icon: <FileCodeCorner />,
                },
              },
              {
                name: "order",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.order.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.order.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.order.edit,
                show: `/${locale}` + ADMIN_PROTECTED_ROUTES.order.show,
                meta: {
                  label: t("order.order"),
                  icon: <Mails />,
                },
              },
              {
                name: "portfolio-group",
                meta: {
                  label: t("group.portfolio"),
                  icon: <GalleryVerticalEnd />,
                },
              },
              {
                name: "portfolio",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.edit,
                show: `/${locale}` + ADMIN_PROTECTED_ROUTES.portfolio.show,
                meta: {
                  label: t("portfolio.portfolio"),
                  icon: <Images />,
                  parent: "portfolio-group",
                },
              },
              {
                name: "hashtag",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.hashtag.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.hashtag.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.hashtag.edit,
                meta: {
                  label: t("hashtag.hashtag"),
                  parent: "portfolio-group",
                  icon: <Hash />,
                },
              },
              {
                name: "goods-group",
                meta: {
                  label: t("group.goods"),
                  icon: <ShoppingCart />,
                },
              },
              {
                name: "goods",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.goods.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.goods.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.goods.edit,
                meta: {
                  label: t("goods.goods"),
                  parent: "goods-group",
                  icon: <ShoppingBasket />,
                },
              },
              {
                name: "goods-brand",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.goodsBrand.list,
                create: `/${locale}` + ADMIN_PROTECTED_ROUTES.goodsBrand.create,
                edit: `/${locale}` + ADMIN_PROTECTED_ROUTES.goodsBrand.edit,
                meta: {
                  label: t("goods-brand.goods-brand"),
                  parent: "goods-group",
                  icon: <Building2 />,
                },
              },
              {
                name: "global-param-group",
                meta: {
                  label: t("group.global-param"),
                  icon: <Settings2 />,
                },
              },
              {
                name: "contacts",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.contacts,
                meta: {
                  label: t("contacts.contacts"),
                  parent: "global-param-group",
                  icon: <Contact />,
                },
              },
              {
                name: "calculator-profit",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.calculatorProfit,
                meta: {
                  label: t("calculator-profit.calculator_profit"),
                  parent: "global-param-group",
                  icon: <Calculator />,
                },
              },
              {
                name: "exchange-rate",
                list: `/${locale}` + ADMIN_PROTECTED_ROUTES.exchangeRate,
                meta: {
                  label: t("exchange-rate.exchange_rate"),
                  parent: "global-param-group",
                  icon: <CircleDollarSign />,
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
