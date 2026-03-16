import { getPortfolioItem } from "@/src/features/portfolio/api/get-item-portfolio.api";
import { PortfolioInfo } from "@/src/features/portfolio/components/portgolio-info/PortfolioInfo";
import { Link } from "@/src/i18n/navigation";
import { ELocale } from "@/src/i18n/routing";
import ImageSlider from "@/src/shared/ui/image-slider/ImageSlider";
import { buildUrl, OG_IMAGE_DEFAULT, SITE_NAME } from "@/src/shared/utils/seo";
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
  const description = projectItem.description?.[locale]
    ? String(projectItem.description[locale]).slice(0, 160)
    : "";
  const canonicalUrl = buildUrl(locale, `/projects/${tag}`);
  const ogImage = projectItem.cover || OG_IMAGE_DEFAULT;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "uk-UA": buildUrl(ELocale.UK, `/projects/${tag}`),
        "ru-UA": buildUrl(ELocale.RU, `/projects/${tag}`),
      },
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

  return (
    <>
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
