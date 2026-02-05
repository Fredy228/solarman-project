import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";

import IntroImage from "@/src/assets/intro/services/income-intro.webp";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import CalculatorProfit from "@/src/widgets/calculator-profit/CalcularoeProfit";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: string }> };

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
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      {calculatorProfit && exchangeRate && (
        <CalculatorProfit
          data={calculatorProfit.value}
          exchangeRate={exchangeRate.value}
          pageType={EPageType.INCOME}
          defaultTariff={16}
          defaultOperatingTime={10}
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
