"use client";

import { EOrderType, type IOrderRequest } from "@/src/features/order";
import { sendRequestApi } from "@/src/features/order/api/sendRequest.api";
import { ELocale } from "@/src/i18n/routing";
import { reportGoogleAdsRequestConversion } from "@/src/libs/google-ads";
import { utmStorage } from "@/src/libs/utm-storage";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type {
  QuizAnswerValue,
  QuizAnswers,
  QuizConfig,
  QuizContactFormStep,
  QuizFormAnswer,
  QuizImageOptionsStep,
  QuizOptionAnswer,
  QuizSliderStep,
  QuizStep,
  QuizTextOptionsStep,
  QuizUiLabels,
} from "../types";
import QuizIntro from "./QuizIntro";
import QuizProgress from "./QuizProgress";
import QuizSuccess from "./QuizSuccess";
import ContactFormModule from "./modules/ContactFormModule";
import ImageOptionsModule from "./modules/ImageOptionsModule";
import SliderModule from "./modules/SliderModule";
import TextOptionsModule from "./modules/TextOptionsModule";

type Props = {
  config: QuizConfig;
  locale: ELocale;
};

type QuizScreen = "intro" | "questions" | "success";

type StepValidation = {
  stepError: string | null;
  fieldErrors: Record<string, string>;
};

const ORDER_NOTES_MAX_LENGTH = 1000;

function isOptionAnswer(
  answer: QuizAnswerValue | undefined,
): answer is QuizOptionAnswer {
  return Boolean(
    answer &&
      typeof answer === "object" &&
      !Array.isArray(answer) &&
      "optionId" in answer,
  );
}

function isFormAnswer(
  answer: QuizAnswerValue | undefined,
): answer is QuizFormAnswer {
  return Boolean(
    answer &&
      typeof answer === "object" &&
      !Array.isArray(answer) &&
      !("optionId" in answer),
  );
}

function cleanText(value: string): string {
  return value.replace(/\s*\n\s*/g, " ").trim();
}

function createInitialAnswers(config: QuizConfig): QuizAnswers {
  return config.steps.reduce<QuizAnswers>((acc, step) => {
    if (step.module === "slider") {
      const optionId = step.defaultOptionId ?? step.options[0]?.id;
      if (optionId) {
        acc[step.id] = { optionId };
      }
    }

    if (step.module === "contact-form") {
      acc[step.id] = step.fields.reduce<QuizFormAnswer>((fields, field) => {
        fields[field.id] = "";
        return fields;
      }, {});
    }

    return acc;
  }, {});
}

function validateStep(
  step: QuizStep,
  answer: QuizAnswerValue | undefined,
  ui: QuizUiLabels,
): StepValidation {
  if (!step.required) {
    return { stepError: null, fieldErrors: {} };
  }

  if (step.module === "image-options" || step.module === "text-options") {
    if (!isOptionAnswer(answer) || !answer.optionId) {
      return { stepError: ui.requiredMessage, fieldErrors: {} };
    }

    const selectedOption = step.options.find(
      (option) => option.id === answer.optionId,
    );

    if (
      selectedOption?.input?.required &&
      !answer.inputValue?.trim()
    ) {
      return { stepError: ui.requiredMessage, fieldErrors: {} };
    }

    return { stepError: null, fieldErrors: {} };
  }

  if (step.module === "slider") {
    if (!isOptionAnswer(answer) || !answer.optionId) {
      return { stepError: ui.requiredMessage, fieldErrors: {} };
    }

    return { stepError: null, fieldErrors: {} };
  }

  const formAnswer: QuizFormAnswer = isFormAnswer(answer) ? answer : {};
  const fieldErrors = step.fields.reduce<Record<string, string>>(
    (errors, field) => {
      if (!field.required) return errors;

      const value = formAnswer[field.id]?.trim() ?? "";
      const phoneIsIncomplete =
        field.inputType === "tel" && value.replace(/\D/g, "").length < 9;

      if (!value || phoneIsIncomplete) {
        errors[field.id] = ui.requiredMessage;
      }

      return errors;
    },
    {},
  );

  return {
    stepError: Object.keys(fieldErrors).length ? ui.requiredMessage : null,
    fieldErrors,
  };
}

function getChoiceAnswerText(
  step: QuizImageOptionsStep | QuizTextOptionsStep | QuizSliderStep,
  answer: QuizAnswerValue | undefined,
): string {
  if (!isOptionAnswer(answer)) return "";

  const selected = step.options.find((option) => option.id === answer.optionId);
  if (!selected) return answer.optionId;

  const title =
    "title" in selected ? selected.title : "label" in selected ? selected.label : "";
  const inputValue = answer.inputValue?.trim();

  return inputValue ? `${cleanText(title)}: ${inputValue}` : cleanText(title);
}

function buildQuizNotes(config: QuizConfig, answers: QuizAnswers): string {
  const notes = config.steps
    .filter((step) => step.module !== "contact-form")
    .map((step, index) => {
      const answer = answers[step.id];

      return `${index + 1}. ${step.question}\n${getChoiceAnswerText(
        step,
        answer,
      )}`;
    })
    .join("\n\n");

  if (notes.length <= ORDER_NOTES_MAX_LENGTH) return notes;

  return `${notes.slice(0, ORDER_NOTES_MAX_LENGTH - 3)}...`;
}

function getFormAnswer(
  answers: QuizAnswers,
  stepId: string,
): QuizFormAnswer {
  const answer = answers[stepId];
  return isFormAnswer(answer) ? answer : {};
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("380") ? digits : `380${digits}`;
}

export default function QuizEngine({ config, locale }: Props) {
  const pathname = usePathname();
  const initialAnswers = useMemo(() => createInitialAnswers(config), [config]);
  const [screen, setScreen] = useState<QuizScreen>("intro");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [touchedSteps, setTouchedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setScreen("intro");
    setActiveIndex(0);
    setAnswers(initialAnswers);
    setTouchedSteps({});
    setSubmitError(null);
  }, [initialAnswers, locale]);

  const currentStep = config.steps[activeIndex];
  const currentAnswer = answers[currentStep.id];
  const validation = validateStep(currentStep, currentAnswer, config.ui);
  const showValidation = touchedSteps[currentStep.id];
  const isLastStep = activeIndex === config.steps.length - 1;

  const updateAnswer = (stepId: string, answer: QuizAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [stepId]: answer }));
    setSubmitError(null);
  };

  const goNext = () => {
    setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }));

    if (validation.stepError) return;

    setActiveIndex((prev) => Math.min(prev + 1, config.steps.length - 1));
    setSubmitError(null);
  };

  const goBack = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
    setSubmitError(null);
  };

  const submitQuiz = async () => {
    setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }));

    if (validation.stepError) return;

    const contactsStep = config.steps.find(
      (step): step is QuizContactFormStep => step.module === "contact-form",
    );
    const contactsAnswer = contactsStep
      ? getFormAnswer(answers, contactsStep.id)
      : {};

    const request: IOrderRequest = {
      email: null,
      name: contactsAnswer.name?.trim() ?? "",
      phone: normalizePhone(contactsAnswer.phone ?? ""),
      notes: buildQuizNotes(config, answers),
      type: EOrderType.QUIZ,
      pageUrl: pathname,
      utmTags: utmStorage.get(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendRequestApi(request);
      reportGoogleAdsRequestConversion({ formType: "consultation" });
      setScreen("success");
    } catch (error) {
      console.error("Failed to send quiz request:", error);
      setSubmitError(config.ui.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepModule = () => {
    if (currentStep.module === "image-options") {
      return (
        <ImageOptionsModule
          step={currentStep}
          answer={isOptionAnswer(currentAnswer) ? currentAnswer : undefined}
          onChange={(answer) => updateAnswer(currentStep.id, answer)}
        />
      );
    }

    if (currentStep.module === "text-options") {
      return (
        <TextOptionsModule
          step={currentStep}
          answer={isOptionAnswer(currentAnswer) ? currentAnswer : undefined}
          onChange={(answer) => updateAnswer(currentStep.id, answer)}
          error={showValidation ? validation.stepError : null}
        />
      );
    }

    if (currentStep.module === "slider") {
      return (
        <SliderModule
          step={currentStep}
          answer={isOptionAnswer(currentAnswer) ? currentAnswer : undefined}
          onChange={(answer) => updateAnswer(currentStep.id, answer)}
        />
      );
    }

    return (
      <ContactFormModule
        step={currentStep}
        answer={isFormAnswer(currentAnswer) ? currentAnswer : undefined}
        onChange={(answer) => updateAnswer(currentStep.id, answer)}
        errors={showValidation ? validation.fieldErrors : {}}
      />
    );
  };

  if (screen === "intro") {
    return (
      <QuizIntro
        title={config.pageTitle}
        intro={config.intro}
        onStart={() => setScreen("questions")}
      />
    );
  }

  if (screen === "success") {
    return <QuizSuccess success={config.success} ui={config.ui} />;
  }

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        pt: { xs: 10, md: 12 },
        pb: { xs: 5, md: 9 },
        background: "var(--bg-section-gradient)",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          component="h1"
          sx={{
            color: "var(--color-secondary)",
            fontSize: { xs: 27, sm: 33, md: 40 },
            lineHeight: { xs: 1.35, md: 1.25 },
            fontWeight: 800,
            textTransform: "uppercase",
            textAlign: "center",
            maxWidth: { xs: 360, md: "none" },
            mx: "auto",
          }}
        >
          {config.pageTitle}
        </Typography>

        <Box
          sx={{
            mt: { xs: 2.5, md: 5 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
            alignItems: "center",
            gap: { xs: 2.5, md: 5 },
            maxWidth: 1180,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-start" },
              gap: { xs: 2.25, md: 3 },
              minWidth: 0,
              maxWidth: { xs: 340, md: "none" },
              mx: { xs: "auto", md: 0 },
              order: { xs: 2, md: 1 },
            }}
          >
            <Typography
              component="span"
              aria-hidden
              sx={{
                color: "transparent",
                WebkitTextStroke: {
                  xs: "1.5px var(--color-primary)",
                  md: "2px var(--color-primary)",
                },
                fontFamily: "var(--font-poppins), var(--font-montserrat)",
                fontSize: { xs: 116, md: 140 },
                lineHeight: 0.8,
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {activeIndex + 1}
            </Typography>
            <Typography
              component="h2"
              sx={{
                color: "var(--color-secondary)",
                fontSize: { xs: 18, md: 22 },
                lineHeight: 1.25,
                fontWeight: 800,
                textTransform: "uppercase",
                whiteSpace: "pre-line",
                overflowWrap: "anywhere",
              }}
            >
              {currentStep.question}
            </Typography>
          </Box>

          <QuizProgress
            activeIndex={activeIndex}
            total={config.steps.length}
            label={config.ui.progressLabel}
            sx={{ order: { xs: 1, md: 2 } }}
          />
        </Box>

        <Box mt={{ xs: 3.25, md: 7 }}>{renderStepModule()}</Box>

        {(showValidation && validation.stepError && currentStep.module !== "text-options") ||
        submitError ? (
          <Typography
            component="p"
            color="error"
            textAlign="center"
            mt={3}
            fontSize={14}
          >
            {submitError ?? validation.stepError}
          </Typography>
        ) : null}

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
          mt={{ xs: 4.5, md: 7 }}
        >
          {activeIndex > 0 && (
            <Button
              type="button"
              variant="outlined"
              size="large"
              startIcon={<ArrowLeft size={22} />}
              onClick={goBack}
              disabled={isSubmitting}
              sx={{
                px: { xs: 3, md: 4 },
                py: 1.2,
                color: "var(--color-text-g3)",
                borderColor: "var(--color-text-g3)",
              }}
            >
              {config.ui.back}
            </Button>
          )}
          <Button
            type="button"
            variant="contained"
            size="large"
            endIcon={isLastStep ? <Send size={20} /> : <ArrowRight size={22} />}
            onClick={isLastStep ? submitQuiz : goNext}
            loading={isSubmitting}
            sx={{ px: { xs: 3.5, md: 4.5 }, py: 1.2 }}
          >
            {isLastStep ? config.ui.submit : config.ui.next}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
