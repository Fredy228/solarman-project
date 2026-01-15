import Section from "@/src/shared/ui/sections/Section";
import { Box, Container, Typography } from "@mui/material";
import { Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OurMission() {
  const t = useTranslations("about");

  return (
    <Section sx={{ paddingBottom: 0 }}>
      <Container maxWidth="xl">
        <Box className="flex gap-10 justify-center items-center flex-col sm:flex-row">
          <Box className="flex items-center justify-center">
            <Box
              sx={{
                boxShadow: "0 10px 30px 0 #fc7300",
              }}
              className="w-[180px] h-[180px] rounded-full bg-(--color-primary) flex items-center justify-center"
            >
              <Rocket
                color="var(--color-text-light)"
                className="w-[110px] h-[110px]"
              />
            </Box>
          </Box>
          <Box className="text-center sm:text-left">
            <Typography
              component={"h2"}
              variant="body1"
              fontSize={16}
              fontWeight={700}
              color="var(--color-primary)"
              className="uppercase"
              mb={1}
            >
              {t("mission.title")}
            </Typography>
            <Typography
              variant="h2"
              component={"p"}
              fontSize={{ xs: "24px", sm: "22px", md: "30px", lg: "40px" }}
              className="whitespace-pre-line"
            >
              {t("mission.text")}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
