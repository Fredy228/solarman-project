"use client";

import { Box, Slider, styled } from "@mui/material";
import type { QuizOptionAnswer, QuizSliderStep } from "../../types";

const QuizSlider = styled(Slider)(({ theme }) => ({
  height: 8,
  padding: "28px 0 18px",
  "& .MuiSlider-thumb": {
    height: 44,
    width: 44,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    border: "none",
    boxShadow: "none",
    "&:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28' fill='%23ffffff'%3E%3Cpath d='M15.821 1.465c0.583 0.184 0.979 0.724 0.979 1.335v7h5.6c0.522 0 1.001 0.29 1.242 0.753s0.205 1.022-0.095 1.449l-9.8 14c-0.35 0.5-0.985 0.716-1.568 0.532s-0.979-0.724-0.979-1.335v-7h-5.6c-0.522 0-1.001-0.29-1.242-0.753s-0.205-1.022 0.095-1.449l9.8-14c0.35-0.501 0.985-0.716 1.568-0.532z'%3E%3C/path%3E%3C/svg%3E\")",
      backgroundSize: "52%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
  "& .MuiSlider-track": {
    height: 8,
  },
  "& .MuiSlider-rail": {
    height: 8,
    color: "#b9bec8",
    opacity: 1,
  },
  "& .MuiSlider-mark": {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "6px solid #c9ced6",
    backgroundColor: "#fff",
    transform: "translate(-50%, -50%)",
  },
  "& .MuiSlider-markActive": {
    borderColor: theme.palette.primary.main,
    backgroundColor: "#fff",
  },
}));

type Props = {
  step: QuizSliderStep;
  answer?: QuizOptionAnswer;
  onChange: (answer: QuizOptionAnswer) => void;
};

export default function SliderModule({ step, answer, onChange }: Props) {
  const currentIndex = Math.max(
    0,
    step.options.findIndex((option) => option.id === answer?.optionId),
  );
  const selectedOffset =
    step.options.length > 1
      ? (currentIndex / (step.options.length - 1)) * 100
      : 0;

  const getLabelPosition = (index: number) => {
    const offset =
      step.options.length > 1
        ? (index / (step.options.length - 1)) * 100
        : 0;

    if (index === 0) {
      return { left: `${offset}%`, transform: "translateX(-18%)" };
    }

    if (index === step.options.length - 1) {
      return { left: `${offset}%`, transform: "translateX(-82%)" };
    }

    return { left: `${offset}%`, transform: "translateX(-50%)" };
  };

  const getMobileSelectedLabelPosition = (index: number) => {
    if (index <= 0) {
      return { left: `${selectedOffset}%`, transform: "translateX(-14%)" };
    }

    if (index >= step.options.length - 1) {
      return { left: `${selectedOffset}%`, transform: "translateX(-76%)" };
    }

    return { left: `${selectedOffset}%`, transform: "translateX(-50%)" };
  };
  const mobileLabelPosition = getMobileSelectedLabelPosition(currentIndex);

  const handleChange = (_event: Event, value: number | number[]) => {
    const index = Array.isArray(value) ? value[0] : value;
    const option = step.options[index];
    if (!option) return;

    onChange({ optionId: option.id });
  };

  return (
    <Box width="100%" maxWidth={900} mx="auto" px={{ xs: 3, md: 4 }}>
      <QuizSlider
        value={currentIndex}
        min={0}
        max={step.options.length - 1}
        step={1}
        marks={step.options.map((option, index) => ({
          value: index,
          label: "",
        }))}
        valueLabelDisplay="off"
        onChange={handleChange}
      />
      <Box
        sx={{
          display: { xs: "none", sm: "block" },
          position: "relative",
          height: 28,
          mt: -0.25,
        }}
      >
        {step.options.map((option, index) => {
          const selected = index === currentIndex;
          const labelPosition = getLabelPosition(index);

          return (
            <Box
              component="button"
              type="button"
              key={option.id}
              onClick={() => onChange({ optionId: option.id })}
              sx={{
                position: "absolute",
                top: 0,
                left: labelPosition.left,
                transform: labelPosition.transform,
                border: "none",
                borderRadius: "10px",
                px: 1.5,
                py: 0.45,
                minWidth: "auto",
                maxWidth: 112,
                bgcolor: selected
                  ? "var(--color-primary)"
                  : "rgba(154, 163, 176, 0.22)",
                color: selected ? "#fff" : "var(--color-text-g3)",
                fontWeight: 600,
                fontSize: 12,
                lineHeight: 1,
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {option.label}
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          position: "relative",
          height: step.mobileHint ? 48 : 30,
          mt: 0.5,
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => onChange({ optionId: step.options[currentIndex].id })}
          sx={{
            position: "absolute",
            left: mobileLabelPosition.left,
            transform: mobileLabelPosition.transform,
            border: "none",
            borderRadius: "10px",
            px: 1.75,
            py: 0.5,
            minWidth: 88,
            bgcolor: "var(--color-primary)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            lineHeight: 1,
            whiteSpace: "nowrap",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "left 160ms ease, transform 160ms ease",
          }}
        >
          {step.options[currentIndex]?.mobileLabel ??
            step.options[currentIndex]?.label}
        </Box>
        {step.mobileHint ? (
          <Box
            component="span"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              textAlign: "center",
              color: "var(--color-text-g3)",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 0,
            }}
          >
            {step.mobileHint}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
