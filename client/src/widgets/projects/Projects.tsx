import type { IHashtag } from "@/src/features/hashtag";
import type { IPortfolioItem } from "@/src/features/portfolio";
import PortfolioCard from "@/src/features/portfolio/components/portfolio-card/PortfolioCard";
import HashtagChips from "@/src/shared/ui/hashtag/HashtagChips";
import Section from "@/src/shared/ui/sections/Section";
import PageTitle from "@/src/shared/ui/title/PageTitle";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

type Props = {
  data: IPortfolioItem[];
  hashtags: IHashtag[] | null;
};

export default function Projects({ data, hashtags }: Props) {
  const t = useTranslations("projects");

  return (
    <Section>
      <Container maxWidth="xl">
        <PageTitle textAlign={"center"} mb={1}>
          {t("title")}
        </PageTitle>
        <Typography
          component={"p"}
          variant="subtitle1"
          margin={"0 auto"}
          textAlign={"center"}
          maxWidth={"900px"}
        >
          {t("description")}
        </Typography>
        {hashtags && <HashtagChips hashtags={hashtags} />}
        <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
          {data.map((item) => (
            <PortfolioCard key={item.id} data={item} />
          ))}
        </Box>
      </Container>
    </Section>
  );
}
