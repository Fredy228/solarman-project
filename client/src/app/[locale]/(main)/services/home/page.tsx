import IntroGradient from "@/src/shared/ui/sections/intro-gradient/IntroGradient";

import IntroImage from "@/src/assets/intro/services/home-intro.webp";
import { STATIC_HASHTAGS } from "@/src/features/hashtag/list-static-hashtag-tag";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import Stepper from "@/src/shared/ui/stepper/Stepper";
import { getTranslations } from "next-intl/server";
import { benefitsList } from "./benefits-list";
import { stepsWorkList } from "./steps-work-list";

type Props = { params: Promise<{ locale: string }> };

export default async function ServiceHomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesHome" });

  const portfolioList = await getLastPortfolio([STATIC_HASHTAGS.HOME]);

  return (
    <>
      <IntroGradient
        title={t("intro.title")}
        description={t("intro.description")}
        imageSrc={IntroImage}
        buttonText={t("intro.button")}
      />
      <BenefitsSimple title={t("benefits.title")} items={benefitsList(t)} />
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
