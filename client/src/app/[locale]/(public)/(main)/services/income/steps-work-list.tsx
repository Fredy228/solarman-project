import type { TranslatorType } from "@/src/i18n/types";
import type { StepperItem } from "@/src/shared/ui/stepper/stepper-item.type";

export const stepsWorkList = (t: TranslatorType): StepperItem[] => [
  {
    id: 1,
    title: t("stepsWork.item1.title"),
    text: t("stepsWork.item1.text"),
    icon: "FileChartColumnIncreasing",
  },
  {
    id: 2,
    title: t("stepsWork.item2.title"),
    text: t("stepsWork.item2.text"),
    icon: "LayoutTemplate",
  },
  {
    id: 3,
    title: t("stepsWork.item3.title"),
    text: t("stepsWork.item3.text"),
    icon: "Search",
  },
  {
    id: 4,
    title: t("stepsWork.item4.title"),
    text: t("stepsWork.item4.text"),
    icon: "Hammer",
  },
  {
    id: 5,
    title: t("stepsWork.item5.title"),
    text: t("stepsWork.item5.text"),
    icon: "Files",
  },
  {
    id: 6,
    title: t("stepsWork.item6.title"),
    text: t("stepsWork.item6.text"),
    icon: "MonitorCog",
  },
];
