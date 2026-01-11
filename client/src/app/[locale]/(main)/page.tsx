import { getTranslations } from "next-intl/server";

import { API_ROUTES } from "@/src/configs/api-routes.config";
import type { IPortfolioItem } from "@/src/features/portfolio";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import fetchNative from "@/src/libs/fetch-native";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import { IntroMain } from "@/src/widgets/intro-main/IntroMain";
import { homeBenefitsList } from "./list-home-benefits";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const portfoliosResponse = await fetchNative.fetchAPI(
    API_ROUTES.portfolio.list +
      `?_sort=date&_order=desc&_start=0&_end=4&status=${EProductStatus.PUBLISHED}`,
    false,
    { method: "GET", next: { revalidate: 60 } }
  );

  const portfolioList: IPortfolioItem[] = portfoliosResponse
    ? await portfoliosResponse.json()
    : null;

  return (
    <>
      <IntroMain />
      <BenefitsSimple title={t("benefits.title")} items={homeBenefitsList(t)} />
      {portfoliosResponse && <PortfolioPreview data={portfolioList} />}
    </>
  );
}
