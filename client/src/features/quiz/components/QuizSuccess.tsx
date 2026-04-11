"use client";

import { Link } from "@/src/i18n/navigation";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { QuizSuccessConfig, QuizUiLabels } from "../types";
import QuizCircularImage from "./QuizCircularImage";

type Props = {
  success: QuizSuccessConfig;
  ui: QuizUiLabels;
};

export default function QuizSuccess({ success, ui }: Props) {
  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        pt: { xs: 12, md: 14 },
        pb: { xs: 8, md: 10 },
        background: "var(--bg-section-gradient)",
      }}
    >
      <Container maxWidth="xl">
        <Stack alignItems="center" textAlign="center" spacing={{ xs: 3, md: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography
              component="h1"
              sx={{
                color: "var(--color-secondary)",
                fontSize: { xs: 32, md: 42 },
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {success.title}
            </Typography>
            <Typography
              component="p"
              sx={{
                color: "var(--color-text-g2)",
                fontSize: { xs: 18, md: 22 },
                lineHeight: 1.35,
                whiteSpace: "pre-line",
                fontWeight: 500,
              }}
            >
              {success.subtitle}
            </Typography>
          </Stack>

          <QuizCircularImage
            src={success.image}
            alt={success.imageAlt}
            size={{ xs: 260, md: 420 }}
          />

          <Button
            component={Link}
            href="/"
            variant="contained"
            sx={{ px: 4, py: 1.2 }}
          >
            {ui.home}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
