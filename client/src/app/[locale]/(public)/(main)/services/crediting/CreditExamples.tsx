import { TranslatorType } from "@/src/i18n/types";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";

type Props = {
  t: TranslatorType;
};

export default function CreditExamples({ t }: Props) {
  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle textAlign={"center"} mb={4}>
          {t("examples.title")}
        </SectionTitle>

        <Box>
          {t.raw("examples.list").map(
            (
              item: {
                name: string;
                texts: string[];
              },
              index: number,
            ) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography
                    component="h4"
                    fontWeight={700}
                    color="var(--color-text-g2)"
                  >
                    {item.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {item.texts.map((text, idx) => (
                    <Typography
                      key={idx}
                      component="p"
                      color="var(--color-text-g3)"
                      mb={1}
                    >
                      {text}
                    </Typography>
                  ))}
                </AccordionDetails>
              </Accordion>
            ),
          )}
        </Box>
      </Container>
    </Section>
  );
}
