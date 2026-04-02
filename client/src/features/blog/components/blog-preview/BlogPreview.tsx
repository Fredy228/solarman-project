import { PUBLIC_ROUTES } from "@/src/configs/routes.config";
import type { ELocale } from "@/src/i18n/routing";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { buildLocalizedPath } from "@/src/shared/utils/localized-path";
import { Box, Button, Container, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { IBlogItem } from "../../types/blog.interface";
import BlogCard from "../blog-card/BlogCard";

type Props = {
  data: IBlogItem[];
};

export default function BlogPreview({ data }: Props) {
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const locale = useLocale() as ELocale;

  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle component="h2" mb={1} className="text-center">
          {t("title")}
        </SectionTitle>
        <Typography
          variant="subtitle1"
          component="p"
          mb={5}
          className="text-center whitespace-pre-line"
        >
          {t("subtitle")}
        </Typography>
        <Box className="flex overflow-x-auto gap-5 pb-5 custom-scrollbar">
          {data.map((item) => (
            <Box
              key={item.id}
              className="w-[calc(25%-0.625rem)] min-w-60 sm:min-w-[260px] md:min-w-[280px]"
            >
              <BlogCard data={item} />
            </Box>
          ))}
        </Box>
        <Box mt={1.5} className="w-full flex justify-end">
          <Button
            component="a"
            variant="contained"
            href={buildLocalizedPath(locale, PUBLIC_ROUTES.blog)}
          >
            {tCommon("button.viewMore")}
          </Button>
        </Box>
      </Container>
    </Section>
  );
}
