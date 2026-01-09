import { PUBLIC_ROUTES } from "@/src/configs/routes.config";
import type { ELocale } from "@/src/i18n/routing";
import Section from "@/src/shared/ui/sections/Section";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type { IPortfolioItem } from "../../types/portfolio.interface";
import PortfolioCard from "../portfolio-card/PortfolioCard";

type Props = {
  data: IPortfolioItem[];
};

export default function PortfolioPreview({ data }: Props) {
  const t = useTranslations("portfolio");
  const tCommon = useTranslations("common");
  const locale = useLocale() as ELocale;

  return (
    <Section>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h2" mb={1} className="text-center">
          {t("title")}
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          mb={5}
          className="text-center whitespace-pre-line"
        >
          {t("subtitle")}
        </Typography>
        <Stack
          direction={"row"}
          className="overflow-x-auto gap-5 pb-3 custom-scrollbar"
        >
          {data.map((item) => (
            <Box
              key={item.id}
              className="flex-1 min-w-60 sm:min-w-[260px] md:min-w-[280px]"
            >
              <PortfolioCard data={item} />
            </Box>
          ))}
        </Stack>
        <Box mt={1.5} className="w-full flex justify-end">
          <Button
            component="a"
            variant="contained"
            href={`/${locale}${PUBLIC_ROUTES.projects}`}
          >
            {tCommon("button.viewMore")}
          </Button>
        </Box>
      </Container>
    </Section>
  );
}
