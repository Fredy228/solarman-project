import type { TranslatorType } from "@/src/i18n/types";
import type { BenefitSimpleItemType } from "@/src/shared/ui/sections/benefits-simple/types/benefit-simple-item.type";

export const listAchievements = (
  t: TranslatorType
): Array<BenefitSimpleItemType> => [
  {
    id: 1,
    title: t("achivements.items1.title"),
    text: t("achivements.items1.text"),
    ico: "Earth",
  },
  {
    id: 2,
    title: t("achivements.items2.title"),
    text: t("achivements.items2.text"),
    ico: "Power",
  },
];
