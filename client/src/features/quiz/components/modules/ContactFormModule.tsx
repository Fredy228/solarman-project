"use client";

import { Box, TextField } from "@mui/material";
import { PatternFormat } from "react-number-format";
import type { QuizContactFormStep, QuizFormAnswer } from "../../types";

type Props = {
  step: QuizContactFormStep;
  answer?: QuizFormAnswer;
  onChange: (answer: QuizFormAnswer) => void;
  errors?: Record<string, string>;
};

export default function ContactFormModule({
  step,
  answer = {},
  onChange,
  errors = {},
}: Props) {
  const updateField = (fieldId: string, value: string) => {
    onChange({ ...answer, [fieldId]: value });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: { xs: 2, md: 4 },
        width: "100%",
        maxWidth: 900,
        mx: "auto",
      }}
    >
      {step.fields.map((field) => {
        const value = answer[field.id] ?? "";
        const commonProps = {
          id: `quiz-${step.id}-${field.id}`,
          placeholder: field.placeholder ?? field.label,
          value,
          error: !!errors[field.id],
          helperText: errors[field.id],
          fullWidth: true,
          size: "small" as const,
          hiddenLabel: true,
          sx: {
            "& .MuiInputBase-root": {
              bgcolor: "#fff",
              borderRadius: "10px",
              minHeight: { xs: 44, md: 50 },
              fontSize: { xs: 16, md: 18 },
              alignItems: "center",
            },
            "& .MuiInputBase-input": {
              boxSizing: "border-box",
              height: { xs: 44, md: 50 },
              px: { xs: 2.5, md: 3 },
              py: 0,
              lineHeight: { xs: "44px", md: "50px" },
            },
          },
        };

        if (field.inputType === "tel") {
          return (
            <PatternFormat
              key={field.id}
              {...commonProps}
              format="+380 (##) ###-##-##"
              mask="_"
              allowEmptyFormatting
              onValueChange={(values) => updateField(field.id, values.value)}
              customInput={TextField}
              slotProps={{
                htmlInput: {
                  "aria-label": field.label,
                  maxLength: field.maxLength,
                },
              }}
            />
          );
        }

        return (
          <TextField
            key={field.id}
            {...commonProps}
            type={field.inputType ?? "text"}
            onChange={(event) => updateField(field.id, event.target.value)}
            slotProps={{
              htmlInput: {
                "aria-label": field.label,
                maxLength: field.maxLength,
              },
            }}
          />
        );
      })}
    </Box>
  );
}
