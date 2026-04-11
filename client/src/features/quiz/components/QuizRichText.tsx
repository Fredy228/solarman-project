"use client";

import { Box } from "@mui/material";
import type { QuizTextPart } from "../types";

type Props = {
  parts: QuizTextPart[];
};

export default function QuizRichText({ parts }: Props) {
  return (
    <>
      {parts.map((part, index) => (
        <Box
          component="span"
          key={`${part.text}-${index}`}
          sx={{ color: part.accent ? "var(--color-primary)" : "inherit" }}
        >
          {part.text}
        </Box>
      ))}
    </>
  );
}
