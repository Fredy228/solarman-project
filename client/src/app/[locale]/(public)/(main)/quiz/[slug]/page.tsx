import type { Metadata } from "next";

import { ELocale } from "@/src/i18n/routing";
import { getQuizConfigBySlug, QuizEngine } from "@/src/features/quiz";
import { buildMetadata, buildUrl, SITE_URL } from "@/src/shared/utils/seo";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: ELocale; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const quizUk = getQuizConfigBySlug(ELocale.UK, slug);
  const quizRu = getQuizConfigBySlug(ELocale.RU, slug);

  if (!quizUk || !quizRu) {
    return {};
  }

  return buildMetadata({
    locale,
    path: `/quiz/${slug}`,
    titles: {
      [ELocale.UK]: quizUk.meta.title,
      [ELocale.RU]: quizRu.meta.title,
    },
    descriptions: {
      [ELocale.UK]: quizUk.meta.description,
      [ELocale.RU]: quizRu.meta.description,
    },
  });
}

export default async function QuizSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const config = getQuizConfigBySlug(locale, slug);

  if (!config) {
    notFound();
  }

  const pageUrl = buildUrl(locale, `/quiz/${slug}`);

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <QuizEngine config={config} locale={locale} />
    </>
  );
}
