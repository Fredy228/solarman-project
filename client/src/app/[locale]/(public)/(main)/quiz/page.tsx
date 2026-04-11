import type { Metadata } from "next";

import { ELocale } from "@/src/i18n/routing";
import { getQuizConfig, QuizEngine } from "@/src/features/quiz";
import { buildMetadata, buildUrl, SITE_URL } from "@/src/shared/utils/seo";

type Props = { params: Promise<{ locale: ELocale }> };

const quizUk = getQuizConfig(ELocale.UK);
const quizRu = getQuizConfig(ELocale.RU);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    locale,
    path: "/quiz",
    titles: {
      [ELocale.UK]: quizUk.meta.title,
      [ELocale.RU]: quizRu.meta.title,
    },
    descriptions: {
      [ELocale.UK]: quizUk.meta.description,
      [ELocale.RU]: quizRu.meta.description,
    },
    keywords: {
      [ELocale.UK]: [
        "розрахунок сонячної станції",
        "вартість сонячної станції",
        "сонячна станція Одеса",
        "кошторис СЕС",
      ],
      [ELocale.RU]: [
        "расчет солнечной станции",
        "стоимость солнечной станции",
        "солнечная станция Одесса",
        "смета СЭС",
      ],
    },
  });
}

export default async function QuizPage({ params }: Props) {
  const { locale } = await params;
  const config = getQuizConfig(locale);
  const pageUrl = buildUrl(locale, "/quiz");

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: config.meta.title,
    description: config.meta.description,
    inLanguage: locale === ELocale.UK ? "uk-UA" : "ru-UA",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    potentialAction: {
      "@type": "QuoteAction",
      target: [pageUrl],
    },
  };

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
      {
        "@type": "ListItem",
        position: 2,
        name: config.pageTitle,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <QuizEngine config={config} locale={locale} />
    </>
  );
}
