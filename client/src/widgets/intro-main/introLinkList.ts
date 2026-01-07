import type { TranslatorType } from "@/src/i18n/types";
import type { StaticImageData } from "next/image";

import introCreditImg from "@/src/assets/intro/intro-credit.jpg";
import introInterpriseImg from "@/src/assets/intro/intro-enterprise.webp";
import introHomeImg from "@/src/assets/intro/intro-home.webp";
import introIncomeImg from "@/src/assets/intro/intro-profit.jpg";

import { PUBLIC_ROUTES } from "@/src/configs/routes.config";

export type IntroLinkItem = {
  id: number;
  title: string;
  href: string;
  imgSrc: StaticImageData;
  ico: string;
};

export const introLinkList = (t: TranslatorType): IntroLinkItem[] => [
  {
    id: 1,
    title: t("intro.enterprise"),
    imgSrc: introInterpriseImg,
    href: PUBLIC_ROUTES.services.enterprise,
    ico: "Building2",
  },
  {
    id: 2,
    title: t("intro.home"),
    imgSrc: introHomeImg,
    href: PUBLIC_ROUTES.services.home,
    ico: "House",
  },
  {
    id: 3,
    title: t("intro.income"),
    imgSrc: introIncomeImg,
    href: PUBLIC_ROUTES.services.income,
    ico: "ChartNoAxesCombined",
  },
  {
    id: 4,
    title: t("intro.credit"),
    imgSrc: introCreditImg,
    href: PUBLIC_ROUTES.services.crediting,
    ico: "BanknoteArrowUp",
  },
];
