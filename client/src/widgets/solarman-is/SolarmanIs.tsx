import Section from "@/src/shared/ui/sections/Section";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function SolarmanIs() {
  const t = useTranslations("about");

  return (
    <Section>
      <Container maxWidth="xl">
        <Box maxWidth={"1200px"} margin={"0 auto"} padding={"30px 0"}>
          <Typography component={"p"} textAlign={"center"} fontSize={24}>
            {t("solarmanIs.description")}
          </Typography>
        </Box>
      </Container>
    </Section>
  );
}
