"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

import counsultImg from "@/src/assets/common/consult.png";
import { useSendRequestStore } from "@/src/widgets/send-request/store/useSendRequestStore";
import { ArrowDown, Phone } from "lucide-react";

export default function ConsultSection() {
  const tCommon = useTranslations("common");
  const openModal = useSendRequestStore((s) => s.openModal);

  return (
    <Box
      mt={3}
      sx={{
        backgroundColor: "secondary.main",
        position: "relative",
      }}
    >
      <Box className="absolute z-20 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-primary) w-12 h-12 flex justify-center items-center">
        <ArrowDown size={25} color="var(--color-text-light)" />
      </Box>
      <Box className="w-full overflow-hidden">
        <Container maxWidth="xl">
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            className="pb-12 md:pb-20 md:pt-20 lg:pt-24 lg:pb-24"
          >
            <Box className="relative flex-1 flex justify-center">
              <Image
                src={counsultImg}
                alt="Man is setting solar panels"
                className="-translate-y-12 md:absolute md:transform md:-translate-y-1/2 md:top-1/2 md:right-8"
              />
            </Box>
            <Box className="flex-1 text-center md:text-left">
              <Typography
                component={"h2"}
                color="var(--color-text-light)"
                fontWeight={700}
                fontSize={{
                  xs: "22px",
                  sm: "25px",
                  lg: "30px",
                }}
                mb={"30px"}
                className="whitespace-pre-line uppercase"
              >
                {tCommon("phrases.consultSectionTitle")}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                onClick={openModal}
              >
                {tCommon("button.getConsultationV1")}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
