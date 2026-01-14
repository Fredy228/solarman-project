import { Box, Button, Container, Typography } from "@mui/material";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import IntroImage from "@/src/assets/intro/intro-bg.webp";
import PageTitle from "@/src/shared/ui/title/PageTitle";
import IntroLinks from "./IntroLink";
import { introLinkList } from "./introLinkList";

export const IntroMain = () => {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <Box
      component="section"
      className="w-full relative overflow-hidden pt-28 pb-14"
    >
      <Box
        className="absolute flex justify-items-center w-[2200px] h-[1000px] top-[-600px] md:top-[-572px] left-1/2 transform -translate-x-1/2 z-[-1] rounded-[50%] overflow-hidden"
        sx={{
          background:
            "radial-gradient(92.05% 162.69% at 81.46% 7.95%,#fff8de 0%,#dceeff 100%)",
        }}
      >
        <Box className="relative w-full ml-auto mr-auto max-w-[1440px]">
          <Image
            src={IntroImage}
            alt="Intro background"
            className="absolute right-[280px] bottom-[-50px] h-auto w-[400px] sm:w-[450px] sm:right-[150px] md:w-[500px] md:right-0"
          />
        </Box>
      </Box>
      <Container maxWidth="xl">
        <PageTitle className="pb-2.5 whitespace-pre-line">
          {t("intro.title")}
        </PageTitle>
        <Typography
          component={"p"}
          variant="subtitle1"
          className="pb-10 whitespace-pre-line"
        >
          {t("intro.subtitle")}
        </Typography>

        <Button variant="contained" size="large" startIcon={<Phone />}>
          {tCommon("button.getConsultationV1")}
        </Button>

        <IntroLinks list={introLinkList(t)} />
      </Container>
    </Box>
  );
};
