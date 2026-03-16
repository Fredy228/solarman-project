import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getLastBlog } from "@/src/features/blog/api/get-last-blog.api";
import BlogPreview from "@/src/features/blog/components/blog-preview/BlogPreview";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import type { ELocale } from "@/src/i18n/routing";
import { DEFAULT_TARIFF } from "@/src/shared/configs/calculator-profit.config";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import { buildMetadata } from "@/src/shared/utils/seo";
import CalculatorProfit from "@/src/widgets/calculator-profit/CalcularoeProfit";
import { IntroMain } from "@/src/widgets/intro-main/IntroMain";
import { homeBenefitsList } from "./list-home-benefits";

type Props = { params: Promise<{ locale: ELocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/",
    titles: {
      uk: "Сонячні електростанції в Одесі під ключ",
      ru: "Солнечные электростанции в Одессе под ключ",
    },
    descriptions: {
      uk: "Будуємо сонячні електростанції для дому та бізнесу в Одесі і Одеській області. Окупність від 3 років, гарантія 15 років, кредит 0%. Безкоштовна консультація!",
      ru: "Строим солнечные электростанции для дома и бизнеса в Одессе и Одесской области. Окупаемость от 3 лет, гарантия 15 лет, кредит 0%. Бесплатная консультация!",
    },
    keywords: {
      uk: [
        "сонячні панелі Одеса",
        "сонячна електростанція",
        "СЕС Одеса",
        "сонячна станція для дому",
        "сонячна енергетика",
      ],
      ru: [
        "солнечные панели Одесса",
        "солнечная электростанция",
        "СЭС Одесса",
        "солнечная станция для дома",
        "солнечная энергетика",
      ],
    },
  });
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const portfolioList = await getLastPortfolio();
  const blogList = await getLastBlog();
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
          defaultTariff={DEFAULT_TARIFF.HOME}
          defaultOperatingTime={15}
        />
      )}
      {portfolioList && <PortfolioPreview data={portfolioList} />}
      {blogList && <BlogPreview data={blogList} />}
      <ConsultSection />
    </>
  );
}
