import { getPortfolioItem } from "@/src/features/portfolio/api/get-item-portfolio.api";
import { PortfolioInfo } from "@/src/features/portfolio/components/portgolio-info/PortfolioInfo";
import { Link } from "@/src/i18n/navigation";
import { ELocale } from "@/src/i18n/routing";
import ImageSlider from "@/src/shared/ui/image-slider/ImageSlider";
import { toPlainText, truncateText } from "@/src/shared/utils/plain-text";
import {
  absoluteUrl,
  buildLanguageAlternates,
  buildUrl,
  OG_IMAGE_DEFAULT,
  SITE_NAME,
  SITE_URL,
} from "@/src/shared/utils/seo";
import {
  buildProjectBreadcrumbSchema,
  withoutEmptyValues,
} from "@/src/shared/utils/structured-data";
import { Box, Chip, Container, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Clock } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: ELocale; tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tag } = await params;
  const projectItem = await getPortfolioItem({ tag });
  if (!projectItem) return {};

  const title = `${projectItem.title[locale]} | ${SITE_NAME}`;
  const description = truncateText(
    toPlainText(projectItem.description?.[locale]),
  );
  const canonicalUrl = buildUrl(locale, `/projects/${tag}`);
  const ogImage = projectItem.cover
    ? absoluteUrl(projectItem.cover)
    : OG_IMAGE_DEFAULT;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(`/projects/${tag}`),
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      locale: locale === ELocale.UK ? "uk_UA" : "ru_UA",
      alternateLocale: locale === ELocale.UK ? "ru_UA" : "uk_UA",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProjectItemPage({ params }: Props) {
  const { tag, locale } = await params;

  const projectItem = await getPortfolioItem({ tag });
  if (!projectItem) notFound();

  const projectPath = `/projects/${tag}`;
  const canonicalUrl = buildUrl(locale, projectPath);
  const projectTitle = projectItem.title[locale];
  const projectDescription =
    truncateText(toPlainText(projectItem.description?.[locale]), 5000) ||
    projectTitle;
  const projectSchema = withoutEmptyValues({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalUrl}#project`,
    name: projectTitle,
    description: projectDescription,
    image: [projectItem.cover, ...projectItem.images]
      .filter(Boolean)
      .map(absoluteUrl),
    datePublished: projectItem.date,
    inLanguage: locale === ELocale.UK ? "uk-UA" : "ru-UA",
    author: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: canonicalUrl,
  });
  const breadcrumbSchema = buildProjectBreadcrumbSchema(
    locale,
    projectTitle,
    projectPath,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Container maxWidth="xl">
        <Typography
          component={"h1"}
          fontSize={{
            xs: "20px",
            md: "22px",
            lg: "25px",
          }}
          color="var(--color-text-g2)"
          fontWeight={700}
          mt={10}
          mb={2}
        >
          {projectItem.title[locale]}
        </Typography>

        <Box className="w-full mb-5 flex flex-wrap gap-x-4 gap-y-1">
          <Box className="flex items-center gap-2">
            <Clock size={18} color="var(--color-text-g4)" />
            <Typography
              component={"span"}
              fontSize={14}
              color="var(--color-text-g4)"
            >
              {dayjs(projectItem.date).format("DD.MM.YYYY")}
            </Typography>
          </Box>
          {projectItem.hashtags &&
            projectItem.hashtags.map((i) => (
              <Link key={i.id} href={`/projects?hashtag=${i.tag}`}>
                <Chip
                  key={i.id}
                  label={i.name[locale]}
                  variant="outlined"
                  size="small"
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--color-text-g6)",
                    },
                  }}
                />
              </Link>
            ))}
        </Box>

        <ImageSlider images={[projectItem.cover, ...projectItem.images]} />
      </Container>
      <PortfolioInfo data={projectItem} locale={locale} />
    </>
  );
}
