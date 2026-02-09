import type { TranslatorType } from "@/src/i18n/types";
import type { BenefitWithImgItemType } from "@/src/shared/ui/sections/benefits-with-image/types/benefit-with-img-item.type";

import ImageBattery from "@/src/assets/services/backup/equipments/battery.png";
import ImageBmsSystem from "@/src/assets/services/backup/equipments/bms-system.png";
import ImageInvertor from "@/src/assets/services/backup/equipments/invertor.png";

export const benefitsImageList = (
  t: TranslatorType,
): BenefitWithImgItemType[] => [
  {
    id: 1,
    title: t("equipment.item1.title"),
    text: t("equipment.item1.text"),
    img: ImageInvertor,
  },
  {
    id: 2,
    title: t("equipment.item2.title"),
    text: t("equipment.item2.text"),
    img: ImageBattery,
  },
  {
    id: 3,
    title: t("equipment.item3.title"),
    text: t("equipment.item3.text"),
    img: ImageBmsSystem,
  },
];
