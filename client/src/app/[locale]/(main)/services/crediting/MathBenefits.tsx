import type { TranslatorType } from "@/src/i18n/types";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";
import { Container, Typography } from "@mui/material";

type Props = {
  t: TranslatorType;
};

export default function MathBenefits({ t }: Props) {
  return (
    <Section>
      <Container maxWidth="xl">
        <SectionTitle textAlign={"center"} mb={2}>
          {t("mathBenefits.title")}
        </SectionTitle>
        <Typography className="indent-8" component={"p"}>
          {t("mathBenefits.text")}
        </Typography>
      </Container>
    </Section>
  );
}
