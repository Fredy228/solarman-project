import type { TranslatorType } from "@/src/i18n/types";
import type { BenefitSimpleItemType } from "@/src/shared/ui/sections/benefits-simple/types/benefit-simple-item.type";

export const benefitsList = (t: TranslatorType): BenefitSimpleItemType[] => [
  {
    id: 1,
    title: t("benefits.item1.title"),
    text: t("benefits.item1.text"),
    ico: "VolumeX",
  },
  {
    id: 2,
    title: t("benefits.item2.title"),
    text: t("benefits.item2.text"),
    ico: "ShieldCheck",
  },
  {
    id: 3,
    title: t("benefits.item3.title"),
    text: t("benefits.item3.text"),
    ico: "Zap",
  },
  {
    id: 4,
    title: t("benefits.item4.title"),
    text: t("benefits.item4.text"),
    ico: "PiggyBank",
  },
];
