import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getLastBlog } from "@/src/features/blog/api/get-last-blog.api";
import BlogPreview from "@/src/features/blog/components/blog-preview/BlogPreview";
import { EPageType } from "@/src/features/global-params";
import { getCalculatorProfit } from "@/src/features/global-params/api/get-calculator-profit.api";
import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { getLastPortfolio } from "@/src/features/portfolio/api/get-last-portfolio.api";
import PortfolioPreview from "@/src/features/portfolio/components/portfolio-preview/PortfolioPreview";
import { ELocale } from "@/src/i18n/routing";
import { DEFAULT_TARIFF } from "@/src/shared/configs/calculator-profit.config";
import BenefitsSimple from "@/src/shared/ui/sections/benefits-simple/BenefitsSimple";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import { buildMetadata, buildUrl } from "@/src/shared/utils/seo";
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
      uk: "Будуємо сонячні електростанції від 3 до 200 кВт у Одесі під ключ. Знижуємо тарифи на електроенергію: окупність 3 роки, гарантія 15 років, кредит 0%. Безкоштовна консультація!",
      ru: "Строим солнечные электростанции от 3 до 200 кВт в Одессе под ключ. Снижаем тарифы на электроэнергию: окупаемость 3 года, гарантия 15 лет, кредит 0%. Бесплатная консультация!",
    },
    keywords: {
      uk: [
        "сонячні панелі Одеса",
        "сонячна електростанція",
        "СЕС Одеса",
        "сонячна станція для дому",
        "сонячна енергетика",
        "тарифи на електроенергію",
        "кВт сонячна панель",
        "економія електроенергії",
        "сонячна станція ціна",
      ],
      ru: [
        "солнечные панели Одесса",
        "солнечная электростанция",
        "СЭС Одесса",
        "солнечная станция для дома",
        "солнечная энергетика",
        "тарифы на электроэнергию",
        "кВт солнечная панель",
        "экономия электроэнергии",
        "солнечная станция цена",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === ELocale.UK ? "Головна" : "Главная",
        item: buildUrl(locale, "/"),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
      {portfolioList && portfolioList.length > 0 && (
        <PortfolioPreview data={portfolioList} />
      )}
      {blogList && blogList.length > 0 && <BlogPreview data={blogList} />}
      <ConsultSection />
    </>
  );
}
