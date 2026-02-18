import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";

import IntroImage from "@/src/assets/intro/services/debit-intro.webp";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";
import CreditExamples from "./CreditExamples";
import CreditTypes from "./CreditTypes";
import MathBenefits from "./MathBenefits";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: string }> };

export default async function ServiceCreditingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesCrediting" });

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <MathBenefits t={t} />
      <CreditTypes t={t} />
      <CreditExamples t={t} />
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
      <Stepper
        title={t("stepsWork.title")}
        subtitle={t("stepsWork.subtitle")}
        steps={stepsWorkList(t)}
      />
      <ConsultSection />
    </>
  );
}
