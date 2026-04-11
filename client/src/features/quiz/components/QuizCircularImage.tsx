"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import { resolveQuizImage } from "./quiz-image-map";

type Props = {
  src?: string | null;
  alt?: string;
  size?: {
    xs?: number | string;
    sm?: number | string;
    md?: number | string;
    lg?: number | string;
  };
  align?: "left" | "center";
};

export default function QuizCircularImage({
  src,
  alt = "",
  size = { xs: 260, md: 390, lg: 500 },
  align = "center",
}: Props) {
  const image = resolveQuizImage(src);

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        aspectRatio: "1 / 1",
        mx: align === "center" ? "auto" : 0,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 900px) 70vw, 500px"
            style={{ objectFit: "contain" }}
            priority
          />
        ) : null}
      </Box>
    </Box>
  );
}
