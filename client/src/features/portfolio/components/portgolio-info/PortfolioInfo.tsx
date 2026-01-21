import type { ELocale } from "@/src/i18n/routing";
import MuiBlockNoteViewer from "@/src/shared/ui/editor/BlockNoteRenderer";
import { Box, Container } from "@mui/material";
import type { IPortfolio } from "../../types/portfolio.interface";

type Props = {
  data: IPortfolio;
  locale: ELocale;
};

export function PortfolioInfo({ data, locale }: Props) {
  return (
    <Box mt={3}>
      <Container maxWidth="xl">
        <MuiBlockNoteViewer content={JSON.parse(data.description[locale])} />
      </Container>
    </Box>
  );
}
