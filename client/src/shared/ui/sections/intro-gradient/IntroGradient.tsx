import { Box, Button, Container, Typography } from "@mui/material";
import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import PageTitle from "../../title/PageTitle";

type Props = {
  title: string;
  description: string;
  imageSrc: StaticImport;
  isShowButtom?: boolean;
};

export default function IntroGradient({
  title,
  description,
  imageSrc,
  isShowButtom,
}: Props) {
  return (
    <Box
      component={"section"}
      className="w-full overflow-hidden pt-28 pb-14"
      sx={{
        background: "var(--bg-section-gradient)",
      }}
    >
      <Container maxWidth="xl">
        <Box className="flex flex-col md:flex-row">
          <Box className="flex-1 pr-0 md:pr-8">
            <PageTitle className="z-10" mb={2}>
              {title}
            </PageTitle>
            <Typography component={"p"} variant="subtitle1" className="z-10">
              {description}
            </Typography>
            {isShowButtom && <Button></Button>}
          </Box>
          <Box className="relative h-[100px] sm:h-[150px] md:h-auto md:w-[400px] lg:w-[560px]">
            <Image
              src={imageSrc}
              alt="Intro Image"
              className="absolute z-0 w-[300px] sm:w-[450px] md:w-[400px] lg:w-[560px] h-auto top-4 right-0"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
