import { getPortfolioItem } from "@/src/features/portfolio/api/get-item-portfolio.api";
import { PortfolioInfo } from "@/src/features/portfolio/components/portgolio-info/PortfolioInfo";
import type { ELocale } from "@/src/i18n/routing";
import { Container, Typography } from "@mui/material";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: ELocale; tag: string }>;
};

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
          mt={9}
        >
          {projectItem.title[locale]}
        </Typography>
      </Container>
      <PortfolioInfo data={projectItem} locale={locale} />
    </>
  );
}
