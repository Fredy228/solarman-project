import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";

import IntroImage from "@/src/assets/intro/services/enterprise-intro.webp";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { STATIC_HASHTAGS } from "@/src/features/hashtag/list-static-hashtag-tag";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import { DEFAULT_TARIFF } from "@/src/shared/configs/calculator-profit.config";
import AreasApplication from "@/src/shared/ui/sections/areas-application/AreasApplication";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import CalculatorProfit from "@/src/widgets/calculator-profit/CalcularoeProfit";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: string }> };

export default async function ServiceEnterprisePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesEnterprise" });

  const portfolioList = await getLastPortfolio([STATIC_HASHTAGS.ENTERPRISE]);
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
          pageType={EPageType.ENTERPRISE}
          defaultTariff={DEFAULT_TARIFF.ENTERPRISE}
          defaultOperatingTime={20}
        />
      )}
      <AreasApplication
        title={t("areasApplication.title")}
        description={t("areasApplication.description")}
        list={t.raw("areasApplication.list") as string[]}
      />
      {portfolioList && (
        <PortfolioPreview
          data={portfolioList}
          hashtags={[STATIC_HASHTAGS.ENTERPRISE]}
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
