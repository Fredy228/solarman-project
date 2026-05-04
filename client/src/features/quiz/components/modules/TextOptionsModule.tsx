"use client";

import { Box, TextField, Typography } from "@mui/material";
import { Check } from "lucide-react";
import type { QuizOptionAnswer, QuizTextOptionsStep } from "../../types";

type Props = {
  step: QuizTextOptionsStep;
  answer?: QuizOptionAnswer;
  onChange: (answer: QuizOptionAnswer) => void;
  error?: string | null;
};

export default function TextOptionsModule({
  step,
  answer,
  onChange,
  error,
}: Props) {
  const denseLayout = step.options.length > 4;

  return (
    <Box width="100%">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: `repeat(${step.options.length}, minmax(0, 1fr))`,
          },
          gap: { xs: 2.25, md: denseLayout ? 2.25 : 4 },
          width: "100%",
          maxWidth: denseLayout ? 1320 : 1400,
          mx: "auto",
          pl: { xs: 3.5, md: 0 },
        }}
      >
        {step.options.map((option) => {
          const selected = answer?.optionId === option.id;
          const value = selected ? answer?.inputValue ?? "" : "";

          return (
            <Box
              component="button"
              type="button"
              key={option.id}
              onClick={() =>
                onChange({
                  optionId: option.id,
                  inputValue: option.input ? value : undefined,
                })
              }
              sx={{
                position: "relative",
                minHeight: { xs: 76, md: 150 },
                borderRadius: "10px",
                border: "2px solid",
                borderColor: selected ? "var(--color-primary)" : "#9aa3b0",
                bgcolor: "rgba(255,255,255,0.12)",
                color: selected
                  ? "var(--color-primary)"
                  : "var(--color-text-g2)",
                cursor: "pointer",
                px: { xs: 4, md: 4 },
                py: { xs: 2, md: 4 },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "center" },
                flexDirection: { xs: "row", md: "column" },
                gap: 1.5,
                font: "inherit",
                textAlign: { xs: "left", md: "center" },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: 0, md: "50%" },
                  top: { xs: "50%", md: 0 },
                  transform: {
                    xs: "translate(-50%, -50%)",
                    md: "translate(-50%, -50%)",
                  },
                  width: { xs: 58, md: 74 },
                  height: { xs: 58, md: 74 },
                  borderRadius: "50%",
                  bgcolor: selected ? "var(--color-primary)" : "#9aa3b0",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Check color="#fff" size={34} strokeWidth={2.5} />
              </Box>
              <Typography
                component="span"
                sx={{
                  mt: { xs: 0, md: option.input ? 2 : 0 },
                  fontSize: { xs: 18, md: 21 },
                  lineHeight: 1.25,
                  fontWeight: 500,
                  whiteSpace: "pre-line",
                  flexShrink: 0,
                }}
              >
                {option.title}
              </Typography>
              {option.input && (
                <TextField
                  value={value}
                  placeholder={option.input.placeholder}
                  size="small"
                  onFocus={() =>
                    onChange({
                      optionId: option.id,
                      inputValue: value,
                    })
                  }
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) =>
                    onChange({
                      optionId: option.id,
                      inputValue: event.target.value,
                    })
                  }
                  error={selected && !!error}
                  slotProps={{
                    htmlInput: {
                      maxLength: option.input.maxLength,
                      "aria-label": option.input.placeholder,
                    },
                  }}
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 185, md: 250 },
                    "& .MuiInputBase-root": {
                      bgcolor: "#fff",
                      borderRadius: "10px",
                      fontSize: 16,
                      alignItems: "center",
                    },
                    "& .MuiInputBase-input": {
                      boxSizing: "border-box",
                      height: 36,
                      px: 1.5,
                      py: 0,
                      lineHeight: "36px",
                      textAlign: "center",
                    },
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      {error && (
        <Typography
          component="p"
          color="error"
          textAlign="center"
          mt={2}
          fontSize={14}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
