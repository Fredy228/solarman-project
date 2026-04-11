"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { QuizIntroConfig } from "../types";
import QuizCircularImage from "./QuizCircularImage";
import QuizRichText from "./QuizRichText";
import { resolveQuizImage } from "./quiz-image-map";

type Props = {
  title: string;
  intro: QuizIntroConfig;
  onStart: () => void;
};

export default function QuizIntro({ title, intro, onStart }: Props) {
  const rightImage = resolveQuizImage(intro.rightImage);

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        pt: { xs: 11, md: 12 },
        pb: { xs: 6, md: 10 },
        background: "var(--bg-section-gradient)",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1fr 0.75fr" },
            alignItems: "center",
            gap: { xs: 3, md: 5, lg: 3 },
            minHeight: { lg: "calc(100vh - 190px)" },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              transform: "translateX(-18%)",
            }}
          >
            <QuizCircularImage
              src={intro.leftImage}
              alt={intro.leftImageAlt}
              size={{ lg: 560 }}
              align="left"
            />
          </Box>

          <Stack
            spacing={{ xs: 3, md: 4 }}
            alignItems={{ xs: "center", lg: "flex-start" }}
            textAlign={{ xs: "center", lg: "left" }}
          >
            <Typography
              component="h1"
              sx={{
                color: "var(--color-secondary)",
                fontSize: { xs: 29, sm: 38, md: 46 },
                fontWeight: 800,
                lineHeight: { xs: 1.35, md: 1.3 },
                textTransform: "uppercase",
                whiteSpace: "pre-line",
              }}
            >
              <QuizRichText parts={intro.title} />
            </Typography>
            <Typography
              component="p"
              sx={{
                color: "var(--color-text-g1)",
                fontSize: { xs: 18, md: 22 },
                lineHeight: 1.25,
                whiteSpace: "pre-line",
                fontWeight: 500,
              }}
            >
              {intro.subtitle}
            </Typography>
            <Box
              sx={{
                position: "relative",
                width: { xs: "min(88vw, 360px)", md: 420, lg: 520 },
                aspectRatio: "1.2 / 1",
                display: { xs: "block", lg: "none" },
              }}
            >
              {rightImage ? (
                <Image
                  src={rightImage}
                  alt={intro.rightImageAlt ?? title}
                  fill
                  sizes="(max-width: 900px) 88vw, 420px"
                  style={{ objectFit: "contain" }}
                />
              ) : null}
            </Box>
            <Button
              type="button"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={22} />}
              onClick={onStart}
              sx={{ px: { xs: 4, md: 5 }, py: 1.4 }}
            >
              {intro.buttonLabel}
            </Button>
          </Stack>

          <Box
            sx={{
              position: "relative",
              width: { xs: "min(74vw, 320px)", md: 420, lg: 520 },
              aspectRatio: "1.25 / 1",
              justifySelf: "center",
              display: { xs: "none", lg: "block" },
            }}
          >
            {rightImage ? (
              <Image
                src={rightImage}
                alt={intro.rightImageAlt ?? title}
                fill
                sizes="(max-width: 1200px) 420px, 520px"
                style={{ objectFit: "contain" }}
              />
            ) : null}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
