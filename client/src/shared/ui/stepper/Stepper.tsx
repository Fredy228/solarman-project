"use client";

import {
  Box,
  Container,
  Stepper as MuiStepper,
  Step,
  StepConnector,
  StepLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Calculator,
  ClipboardPen,
  FileChartColumnIncreasing,
  Hammer,
  LayoutTemplate,
  Search,
  Settings,
  Truck,
  MonitorCog,
  Files,
} from "lucide-react";
import Section from "../sections/Section";
import SectionTitle from "../title/SectionTitle";
import type { StepperItem } from "./stepper-item.type";

const IconLucide = {
  Truck,
  LayoutTemplate,
  Settings,
  FileChartColumnIncreasing,
  Calculator,
  Hammer,
  ClipboardPen,
  Search,
  MonitorCog,
  Files,
};

type Props = {
  steps: StepperItem[];
  title?: string;
  subtitle?: string;
};

export default function Stepper({ steps, title, subtitle }: Props) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Section>
      <Container maxWidth="xl">
        {title && (
          <>
            <SectionTitle component="h2" className="text-center">
              {title}
            </SectionTitle>
            {subtitle && (
              <Typography
                variant="subtitle1"
                component="p"
                className="text-center whitespace-pre-line"
                maxWidth={700}
                mx="auto"
              >
                {subtitle}
              </Typography>
            )}
            <Box height={40} />
          </>
        )}
        <MuiStepper
          activeStep={-1}
          nonLinear
          orientation={isMdDown ? "vertical" : "horizontal"}
          connector={
            <StepConnector
              sx={{
                alignSelf: isMdDown ? "stretch" : "center",
                "& .MuiStepConnector-line": {
                  borderColor: "primary.main",
                  borderTopWidth: isMdDown ? 0 : 2,
                  borderLeftWidth: isMdDown ? 2 : 0,
                  minHeight: isMdDown ? 32 : "auto",
                },
              }}
            />
          }
          sx={{
            width: "100%",
            flexWrap: isMdDown ? "nowrap" : "wrap",
            alignItems: isMdDown ? "stretch" : "flex-start",
            gap: isMdDown ? 2 : 3,
            padding: 0,
          }}
        >
          {steps.map((step) => {
            const IconComponent =
              IconLucide[step.icon as keyof typeof IconLucide];
            return (
              <Step
                key={step.id}
                sx={{
                  width: isMdDown
                    ? "100%"
                    : {
                        xs: "100%",
                        md: "33.3333%",
                        lg: "25%",
                      },
                  padding: 0,
                }}
              >
                <StepLabel
                  sx={{
                    alignItems: isMdDown ? "flex-start" : "center",
                    flexDirection: "column",
                    gap: 1,
                    "& .MuiStepLabel-iconContainer": {
                      paddingRight: 0,
                      marginBottom: 1,
                    },
                    "& .MuiStepLabel-label": {
                      textAlign: isMdDown ? "left" : "center",
                    },
                  }}
                  icon={
                    <Box
                      className="flex justify-center items-center w-12 h-12 rounded-full bg-(--color-primary)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <IconComponent
                        size={25}
                        color="var(--color-text-light)"
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={isMdDown ? "flex-start" : "center"}
                    gap={0.5}
                  >
                    <Typography
                      component={"h4"}
                      variant="subtitle1"
                      fontWeight={600}
                      color="var(--color-text-g1)"
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      component={"p"}
                      variant="body2"
                      color="text.secondary"
                    >
                      {step.text}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </MuiStepper>
      </Container>
    </Section>
  );
}
