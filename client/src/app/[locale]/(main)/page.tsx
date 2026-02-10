import { getTranslations } from "next-intl/server";

import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import CalculatorProfit from "@/src/widgets/calculator-profit/CalcularoeProfit";
import { IntroMain } from "@/src/widgets/intro-main/IntroMain";
import { homeBenefitsList } from "./list-home-benefits";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const portfolioList = await getLastPortfolio();
  const calculatorProfit = await getCalculatorProfit();
  const exchangeRate = await getExchangeRate();

  return (
    <>
      <IntroMain />
      <BenefitsSimple title={t("benefits.title")} items={homeBenefitsList(t)} />
      {calculatorProfit && exchangeRate && (
        <CalculatorProfit
          data={calculatorProfit.value}
          exchangeRate={exchangeRate.value}
          pageType={EPageType.DEFAULT}
          defaultTariff={4.32}
          defaultOperatingTime={15}
        />
      )}
      {portfolioList && <PortfolioPreview data={portfolioList} />}
      <ConsultSection />
    </>
  );
}
