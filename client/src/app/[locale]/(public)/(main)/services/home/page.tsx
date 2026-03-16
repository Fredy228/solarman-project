import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";
import type { Metadata } from "next";

import IntroImage from "@/src/assets/intro/services/home-intro.webp";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { STATIC_HASHTAGS } from "@/src/features/hashtag/list-static-hashtag-tag";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
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
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services/home",
    titles: {
      uk: "Сонячні електростанції для будинку в Одесі",
      ru: "Солнечные электростанции для дома в Одессе",
    },
    descriptions: {
      uk: "Встановлення домашніх сонячних станцій під ключ в Одесі. Автономне живлення 24/7, економія до 100%, кредит 0%. Безкоштовний розрахунок!",
      ru: "Установка домашних солнечных станций под ключ в Одессе. Автономное питание 24/7, экономия до 100%, кредит 0%. Бесплатный расчёт!",
    },
    keywords: {
      uk: [
        "сонячна станція для дому",
        "домашня СЕС Одеса",
        "автономне живлення",
        "сонячні панелі для будинку",
        "енергонезалежність дому",
      ],
      ru: [
        "солнечная станция для дома",
        "домашняя СЭС Одесса",
        "автономное питание",
        "солнечные панели для дома",
        "энергонезависимость дома",
      ],
    },
  });
}

export default async function ServiceHomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesHome" });

  const portfolioList = await getLastPortfolio([STATIC_HASHTAGS.HOME]);
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
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      {calculatorProfit && exchangeRate && (
        <CalculatorProfit
          data={calculatorProfit.value}
          exchangeRate={exchangeRate.value}
          pageType={EPageType.HOME}
          defaultTariff={DEFAULT_TARIFF.HOME}
          defaultOperatingTime={15}
        />
      )}
      <BenefitsWithImage
        title={t("solution.title")}
        items={benefitsImageList(t)}
      />
      {portfolioList && (
        <PortfolioPreview
          data={portfolioList}
          hashtags={[STATIC_HASHTAGS.HOME]}
        />
      )}
      <Stepper
        title={t("stepsWork.title")}
        subtitle={t("stepsWork.subtitle")}
        steps={stepsWorkList(t)}
      />
      <ConsultSection />
    </>
  );
}
