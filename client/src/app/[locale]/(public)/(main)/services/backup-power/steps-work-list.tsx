import type { TranslatorType } from "@/src/i18n/types";
import type { StepperItem } from "@/src/shared/ui/stepper/stepper-item.type";

export const stepsWorkList = (t: TranslatorType): StepperItem[] => [
  {
    id: 1,
    title: t("stepsWork.item1.title"),
    text: t("stepsWork.item1.text"),
    icon: "Truck",
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
    icon: "Hammer",
  },
];
