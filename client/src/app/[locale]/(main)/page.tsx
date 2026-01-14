import { getTranslations } from "next-intl/server";

import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import { IntroMain } from "@/src/widgets/intro-main/IntroMain";
import { homeBenefitsList } from "./list-home-benefits";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const portfolioList = await getLastPortfolio();

  return (
    <>
      <IntroMain />
      <BenefitsSimple title={t("benefits.title")} items={homeBenefitsList(t)} />
      {portfolioList && <PortfolioPreview data={portfolioList} />}
      <ConsultSection />
    </>
  );
}
