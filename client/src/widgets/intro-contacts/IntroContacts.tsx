import PageTitle from "@/src/shared/ui/title/PageTitle";
import { Box, Container, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function IntroContacts() {
  const t = useTranslations("contacts");

  return (
    <Box
      component={"section"}
      className="w-full pt-28 pb-14"
      sx={{
        background: "var(--bg-section-gradient)",
      }}
    >
      <Container maxWidth="xl">
        <Box>
          <PageTitle textAlign={"left"}>{t("title")}</PageTitle>
          <Typography
            component={"p"}
            variant="subtitle1"
            className="max-w-[400px]"
          >
            {t("decscription")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
