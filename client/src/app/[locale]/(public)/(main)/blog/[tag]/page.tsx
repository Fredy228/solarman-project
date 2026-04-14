import { getBlogItem } from "@/src/features/blog/api/get-item-blog.api";
import { ELocale } from "@/src/i18n/routing";
import MuiBlockNoteViewer, {
  type Block,
} from "@/src/shared/ui/editor/BlockNoteRenderer";
import ConsultSection from "@/src/shared/ui/sections/consult/ConsultSection";
import {
  absoluteUrl,
  buildLanguageAlternates,
  buildSeoTitle,
  buildUrl,
  OG_IMAGE_DEFAULT,
  SITE_NAME,
  SITE_URL,
} from "@/src/shared/utils/seo";
import { toPlainText, truncateText } from "@/src/shared/utils/plain-text";
import {
  buildBlogBreadcrumbSchema,
  withoutEmptyValues,
} from "@/src/shared/utils/structured-data";
import { Box, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Clock, RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: ELocale; tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tag } = await params;
  const article = await getBlogItem({ tag });
  if (!article) return {};

  const title = article.title[locale];
  const brandedTitle = buildSeoTitle(title);
  const plainArticleText = toPlainText(article.text?.[locale]);
  const description = truncateText(
    article.description?.[locale] || plainArticleText || title,
  );
  const canonicalUrl = buildUrl(locale, `/blog/${tag}`);
  const ogImage = article.cover ? absoluteUrl(article.cover) : OG_IMAGE_DEFAULT;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(`/blog/${tag}`),
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: brandedTitle,
      description,
      locale: locale === ELocale.UK ? "uk_UA" : "ru_UA",
      alternateLocale: locale === ELocale.UK ? "ru_UA" : "uk_UA",
      images: [{ url: ogImage, width: 1200, height: 630, alt: brandedTitle }],
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: brandedTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogItemPage({ params }: Props) {
  const { tag, locale } = await params;

  const article = await getBlogItem({ tag });
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  let textContent: Block[] | null = null;
  try {
    textContent = JSON.parse(article.text[locale]) as Block[];
  } catch {
    textContent = null;
  }

  const articlePath = `/blog/${tag}`;
  const canonicalUrl = buildUrl(locale, articlePath);
  const articleTitle = article.title[locale];
  const articlePlainText = toPlainText(article.text?.[locale]);
  const articleDescription = truncateText(
    article.description?.[locale] || articlePlainText || articleTitle,
  );
  const articleSchema = withoutEmptyValues({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    headline: articleTitle,
    description: articleDescription,
    image: article.cover ? [absoluteUrl(article.cover)] : undefined,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: locale === ELocale.UK ? "uk-UA" : "ru-UA",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    wordCount: articlePlainText
      ? articlePlainText.split(/\s+/).filter(Boolean).length
      : undefined,
    isAccessibleForFree: true,
    mainEntityOfPage: canonicalUrl,
  });
  const breadcrumbSchema = buildBlogBreadcrumbSchema(
    locale,
    articleTitle,
    articlePath,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Container maxWidth="xl">
        <Box mt={10} mb={6}>
          {/* Title */}
          <Typography
            component="h1"
            fontSize={{ xs: "22px", md: "28px", lg: "34px" }}
            fontWeight={700}
            color="var(--color-text-g2)"
            mb={2}
          >
            {article.title[locale]}
          </Typography>

          {/* Date */}
          <Box className="flex flex-wrap items-center gap-x-5 gap-y-1" mb={5}>
            <Box className="flex items-center gap-2">
              <Clock size={16} color="var(--color-text-g4)" />
              <Typography
                component="span"
                fontSize={14}
                color="var(--color-text-g4)"
              >
                {t("item.published")}:{" "}
                {dayjs(article.createdAt).format("DD.MM.YYYY")}
              </Typography>
            </Box>
            <Box className="flex items-center gap-2">
              <RefreshCw size={15} color="var(--color-text-g4)" />
              <Typography
                component="span"
                fontSize={14}
                color="var(--color-text-g4)"
              >
                {t("item.updated")}:{" "}
                {dayjs(article.updatedAt).format("DD.MM.YYYY")}
              </Typography>
            </Box>
          </Box>

          {/* Cover + Description side by side */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              mb: 6,
              alignItems: { xs: "flex-start", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: "100%", md: "50%" },
                borderRadius: "var(--border-radius-main)",
                overflow: "hidden",
              }}
            >
              <Image
                src={article.cover}
                alt={article.title[locale]}
                width={720}
                height={480}
                style={{ width: "100%", height: "auto", display: "block" }}
                priority
              />
            </Box>

            {article.description[locale] && (
              <Typography
                component="p"
                variant="body1"
                color="var(--color-text-g2)"
                sx={{
                  flex: 1,
                  lineHeight: 1.8,
                  fontSize: { xs: "15px", md: "16px" },
                }}
              >
                {article.description[locale]}
              </Typography>
            )}
          </Box>

          {/* Full article text */}
          {textContent && <MuiBlockNoteViewer content={textContent} />}
        </Box>
      </Container>
      <ConsultSection />
    </>
  );
}
