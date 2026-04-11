"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Check } from "lucide-react";
import Image from "next/image";
import type {
  QuizImageOptionsStep,
  QuizOption,
  QuizOptionAnswer,
} from "../../types";
import { type QuizResolvedImage, resolveQuizImage } from "../quiz-image-map";

type Props = {
  step: QuizImageOptionsStep;
  answer?: QuizOptionAnswer;
  onChange: (answer: QuizOptionAnswer) => void;
};

function getOptionImages(option: QuizOption): {
  desktop: QuizResolvedImage | null;
  mobile: QuizResolvedImage | null;
} {
  if (!option.image || typeof option.image === "string") {
    const image = resolveQuizImage(option.image);
    return { desktop: image, mobile: image };
  }

  const desktop = resolveQuizImage(
    option.image.desktop ?? option.image.mobile ?? null,
  );
  const mobile = resolveQuizImage(
    option.image.mobile ?? option.image.desktop ?? null,
  );

  return { desktop, mobile };
}

export default function ImageOptionsModule({ step, answer, onChange }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: `repeat(${step.options.length}, minmax(0, 1fr))`,
        },
        gap: { xs: 3.5, md: 5 },
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      {step.options.map((option) => {
        const selected = answer?.optionId === option.id;
        const { desktop, mobile } = getOptionImages(option);

        return (
          <Stack
            component="button"
            type="button"
            key={option.id}
            onClick={() => onChange({ optionId: option.id })}
            sx={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              p: 0,
              textAlign: { xs: "left", md: "center" },
              alignItems: { xs: "center", md: "center" },
              flexDirection: { xs: "row", md: "column" },
              justifyContent: { xs: "flex-start", md: "center" },
              gap: { xs: 2, md: 2 },
              minHeight: { xs: 96, md: "auto" },
              pl: { xs: 5.5, md: 0 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 86, md: "100%" },
                height: { xs: 92, md: "auto" },
                aspectRatio: { xs: "auto", md: "2.15 / 1" },
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.86), rgba(220,238,255,0.72))",
                  outline: selected
                    ? "2px solid var(--color-primary)"
                    : "1px solid rgba(22, 73, 138, 0.12)",
                  outlineOffset: 0,
                }}
              >
                {desktop ? (
                  <Image
                    src={desktop}
                    alt={option.imageAlt ?? option.title}
                    fill
                    sizes="(max-width: 900px) 90vw, 440px"
                    style={{ objectFit: "cover" }}
                    className="hidden md:block"
                  />
                ) : null}
                {mobile ? (
                  <Image
                    src={mobile}
                    alt={option.imageAlt ?? option.title}
                    fill
                    sizes="86px"
                    style={{ objectFit: "cover" }}
                    className="block md:hidden"
                  />
                ) : null}
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 0, md: "50%" },
                  top: { xs: "50%", md: 0 },
                  transform: {
                    xs: "translate(-64%, -50%)",
                    md: "translate(-50%, -50%)",
                  },
                  width: { xs: 58, md: 74 },
                  height: { xs: 58, md: 74 },
                  borderRadius: "50%",
                  bgcolor: selected ? "var(--color-primary)" : "#9aa3b0",
                  display: "grid",
                  placeItems: "center",
                  zIndex: 2,
                }}
              >
                <Check color="#fff" size={34} strokeWidth={2.5} />
              </Box>
            </Box>
            <Typography
              component="span"
              sx={{
                color: "var(--color-text-g2)",
                fontSize: { xs: 18, md: 22 },
                fontWeight: 500,
                lineHeight: 1.25,
                whiteSpace: "pre-line",
                maxWidth: { xs: 210, md: 470 },
                flex: 1,
              }}
            >
              {option.title}
            </Typography>
          </Stack>
        );
      })}
    </Box>
  );
}
