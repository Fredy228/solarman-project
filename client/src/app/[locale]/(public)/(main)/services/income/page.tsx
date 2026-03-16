import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import type { Metadata } from "next";

import IntroImage from "@/src/assets/intro/services/income-intro.webp";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import type { ELocale } from "@/src/i18n/routing";
import { DEFAULT_TARIFF } from "@/src/shared/configs/calculator-profit.config";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import BenefitsWithImage from "@/src/shared/ui/sections/benefits-with-image/BenefitsWithImage";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import { buildMetadata } from "@/src/shared/utils/seo";
import CalculatorProfit from "@/src/widgets/calculator-profit/CalcularoeProfit";
import { getTranslations } from "next-intl/server";
import { benefitsImageList } from "./benefits-image-list";
import { benefitsList } from "./benefits-list";
import Services from "./Services";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services/income",
    titles: {
      uk: "Сонячна станція для прибутку: Net Billing в Одесі",
      ru: "Солнечная станция для дохода: Net Billing в Одессе",
    },
    descriptions: {
      uk: "Перетворіть ваш дах на джерело прибутку з Net Billing. Пасивний дохід від сонячної електростанції з окупністю від 3 років.",
      ru: "Превратите вашу крышу в источник дохода с Net Billing. Пассивный доход от солнечной электростанции с окупаемостью от 3 лет.",
    },
    keywords: {
      uk: [
        "Net Billing Україна",
        "заробіток на сонячній станції",
        "пасивний дохід СЕС",
        "продаж електроенергії",
      ],
      ru: [
        "Net Billing Украина",
        "заработок на солнечной станции",
        "пассивный доход СЭС",
        "продажа электроэнергии",
      ],
    },
  });
}

export default async function ServiceIncomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesIncome" });

  const calculatorProfit = await getCalculatorProfit();
  const exchangeRate = await getExchangeRate();

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <BenefitsWithImage
        title={t("how-earn.title")}
        items={benefitsImageList(t)}
      />
      {calculatorProfit && exchangeRate && (
        <CalculatorProfit
          data={calculatorProfit.value}
          exchangeRate={exchangeRate.value}
          pageType={EPageType.INCOME}
          defaultTariff={DEFAULT_TARIFF.HOME}
          defaultOperatingTime={15}
        />
      )}
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      <Services t={t} />
      <Stepper
        title={t("stepsWork.title")}
        subtitle={t("stepsWork.subtitle")}
        steps={stepsWorkList(t)}
      />
      <ConsultSection />
    </>
  );
}
