import type { TranslatorType } from "@/src/i18n/types";
import type { BenefitWithImgItemType } from "@/src/shared/ui/sections/benefits-with-image/types/benefit-with-img-item.type";

import ImageBackupStation from "@/src/assets/services/home/solutions/backup-station.png";
import ImageHybridStation from "@/src/assets/services/home/solutions/hybrid-station.png";
import ImageNetworkStation from "@/src/assets/services/home/solutions/network-station.png";

export const benefitsImageList = (
  t: TranslatorType,
): BenefitWithImgItemType[] => [
  {
    id: 1,
    title: t("solution.item1.title"),
    text: t("solution.item1.text"),
    img: ImageHybridStation,
  },
  {
    id: 2,
    title: t("solution.item2.title"),
    text: t("solution.item2.text"),
    img: ImageNetworkStation,
  },
  {
    id: 3,
    title: t("solution.item3.title"),
    text: t("solution.item3.text"),
    img: ImageBackupStation,
  },
];
