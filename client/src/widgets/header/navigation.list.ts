import { PUBLIC_ROUTES } from "@/src/configs/routes.config";
import type { TranslatorType } from "@/src/i18n/types";
import { BanknoteArrowUp, BatteryFull, Building2, House } from "lucide-react";
import type { ElementType } from "react";

type NavItemType = {
  label: string;
  href: string;
  children?: NavItemType[];
  icon?: ElementType;
};

export const navItemList = (t: TranslatorType): NavItemType[] => [
  {
    label: t("nav.services"),
    href: "/services",
    children: [
      {
        label: t("nav.serviceEnterprise"),
        href: PUBLIC_ROUTES.services.enterprise,
        icon: Building2,
      },
      {
        label: t("nav.serviceHome"),
        href: PUBLIC_ROUTES.services.home,
        icon: House,
      },
      //   { label: t("nav.serviceInvestment"), href: "/services/investment" },
      {
        label: t("nav.serviceBackupPower"),
        href: PUBLIC_ROUTES.services.backupPower,
        icon: BatteryFull,
      },
      {
        label: t("nav.serviceCrediting"),
        href: PUBLIC_ROUTES.services.crediting,
        icon: BanknoteArrowUp,
      },
    ],
  },
  { label: t("nav.products"), href: PUBLIC_ROUTES.products },
  { label: t("nav.projects"), href: PUBLIC_ROUTES.projects },
  { label: t("nav.blog"), href: PUBLIC_ROUTES.blog },
  { label: t("nav.about"), href: PUBLIC_ROUTES.about },
  { label: t("nav.contact"), href: PUBLIC_ROUTES.contacts },
];
