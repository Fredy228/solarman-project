import type { TranslatorType } from "@/src/i18n/types";
import type { BenefitWithImgItemType } from "@/src/shared/ui/sections/benefits-with-image/types/benefit-with-img-item.type";

import ImageGreenTariff from "@/src/assets/services/income/how-earn/green-tariff.png";
import ImageNetBilling from "@/src/assets/services/income/how-earn/net-billing.png";
import ImageNetMetering from "@/src/assets/services/income/how-earn/net-metering.png";

export const benefitsImageList = (
  t: TranslatorType,
): BenefitWithImgItemType[] => [
  {
    id: 1,
    title: t("how-earn.item1.title"),
    text: t("how-earn.item1.text"),
    img: ImageGreenTariff,
  },
  {
    id: 2,
    title: t("how-earn.item2.title"),
    text: t("how-earn.item2.text"),
    img: ImageNetBilling,
  },
  {
    id: 3,
    title: t("how-earn.item3.title"),
    text: t("how-earn.item3.text"),
    img: ImageNetMetering,
  },
];
