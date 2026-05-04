"use client";

import { EOrderType, type IOrderRequest } from "@/src/features/order";
import { sendRequestApi } from "@/src/features/order/api/sendRequest.api";
import { ELocale } from "@/src/i18n/routing";
import { reportGoogleAdsRequestConversion } from "@/src/libs/google-ads";
import { utmStorage } from "@/src/libs/utm-storage";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
  QuizVisibleIfRule,
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

function matchesVisibleRule(
  rule: QuizVisibleIfRule,
  answers: QuizAnswers,
): boolean {
  const answer = answers[rule.stepId];

  if (!isOptionAnswer(answer)) return false;

  return rule.optionIds.includes(answer.optionId);
}

function getVisibleSteps(config: QuizConfig, answers: QuizAnswers): QuizStep[] {
  return config.steps.filter((step) => {
    if (!step.visibleIf) return true;

    const rules = Array.isArray(step.visibleIf)
      ? step.visibleIf
      : [step.visibleIf];

    return rules.every((rule) => matchesVisibleRule(rule, answers));
  });
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

function buildQuizNotes(steps: QuizStep[], answers: QuizAnswers): string {
  const notes = steps
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

function getQuizGoogleAdsFormType(
  config: QuizConfig,
  answers: QuizAnswers,
): string {
  const conversionConfig = config.googleAdsConversion;

  if (!conversionConfig) {
    return "consultation";
  }

  const answer = answers[conversionConfig.stepId];

  if (!isOptionAnswer(answer)) {
    return conversionConfig.fallbackFormType ?? "consultation";
  }

  return (
    conversionConfig.optionFormTypes[answer.optionId] ??
    conversionConfig.fallbackFormType ??
    "consultation"
  );
}

export default function QuizEngine({ config, locale }: Props) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobileStickyViewport = useMediaQuery(theme.breakpoints.down("md"));
  const initialAnswers = useMemo(() => createInitialAnswers(config), [config]);
  const actionsRowRef = useRef<HTMLDivElement | null>(null);
  const [screen, setScreen] = useState<QuizScreen>("intro");
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [touchedSteps, setTouchedSteps] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showFloatingActions, setShowFloatingActions] = useState(false);

  useEffect(() => {
    setScreen("intro");
    setActiveIndex(0);
    setAnswers(initialAnswers);
    setTouchedSteps({});
    setSubmitError(null);
  }, [initialAnswers, locale]);

  const visibleSteps = useMemo(
    () => getVisibleSteps(config, answers),
    [config, answers],
  );
  const safeActiveIndex =
    visibleSteps.length > 0
      ? Math.min(activeIndex, visibleSteps.length - 1)
      : 0;

  useEffect(() => {
    if (activeIndex !== safeActiveIndex) {
      setActiveIndex(safeActiveIndex);
    }
  }, [activeIndex, safeActiveIndex]);

  const currentStep = visibleSteps[safeActiveIndex];
  const currentAnswer = answers[currentStep.id];
  const validation = validateStep(currentStep, currentAnswer, config.ui);
  const showValidation = touchedSteps[currentStep.id];
  const isLastStep = safeActiveIndex === visibleSteps.length - 1;
  const progressTotal = config.progressTotal ?? visibleSteps.length;

  useEffect(() => {
    if (!isMobileStickyViewport || screen !== "questions") {
      setShowFloatingActions(false);
      return;
    }

    const updateFloatingState = () => {
      const actionsRow = actionsRowRef.current;
      const ACTIONS_VISIBILITY_BUFFER = 88;

      if (!actionsRow) {
        setShowFloatingActions(false);
        return;
      }

      const { top } = actionsRow.getBoundingClientRect();
      setShowFloatingActions(
        top > window.innerHeight - ACTIONS_VISIBILITY_BUFFER,
      );
    };

    const frameId = window.requestAnimationFrame(updateFloatingState);

    window.addEventListener("scroll", updateFloatingState, { passive: true });
    window.addEventListener("resize", updateFloatingState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateFloatingState);
      window.removeEventListener("resize", updateFloatingState);
    };
  }, [isMobileStickyViewport, screen, safeActiveIndex, currentStep.id]);

  const updateAnswer = (stepId: string, answer: QuizAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [stepId]: answer }));
    setSubmitError(null);
  };

  const goNext = () => {
    setTouchedSteps((prev) => ({ ...prev, [currentStep.id]: true }));

    if (validation.stepError) return;

    setActiveIndex((prev) => Math.min(prev + 1, visibleSteps.length - 1));
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
      notes: buildQuizNotes(visibleSteps, answers),
      type: EOrderType.QUIZ,
      pageUrl: pathname,
      utmTags: utmStorage.get(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await sendRequestApi(request);
      reportGoogleAdsRequestConversion({
        formType: getQuizGoogleAdsFormType(config, answers),
      });
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
        pb: { xs: 10, md: 9 },
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
              {safeActiveIndex + 1}
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
            activeIndex={safeActiveIndex}
            total={progressTotal}
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
          ref={actionsRowRef}
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
          mt={{ xs: 4.5, md: 7 }}
          mb={{ xs: 1, md: 0 }}
        >
          {safeActiveIndex > 0 && (
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

      <Box
        sx={{
          display: {
            xs: showFloatingActions ? "block" : "none",
            md: "none",
          },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          px: 2,
          pt: 1.5,
          pb: "calc(16px + env(safe-area-inset-bottom, 0px))",
          background:
            "linear-gradient(180deg, rgba(233,244,255,0) 0%, rgba(233,244,255,0.88) 24%, rgba(233,244,255,0.98) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {safeActiveIndex > 0 && (
              <Button
                type="button"
                variant="outlined"
                size="large"
                startIcon={<ArrowLeft size={20} />}
                onClick={goBack}
                disabled={isSubmitting}
                sx={{
                  minWidth: 0,
                  px: 2.25,
                  py: 1.15,
                  color: "var(--color-text-g3)",
                  borderColor: "var(--color-text-g3)",
                  flexShrink: 0,
                }}
              >
                {config.ui.back}
              </Button>
            )}
            <Button
              type="button"
              variant="contained"
              size="large"
              endIcon={
                isLastStep ? <Send size={19} /> : <ArrowRight size={20} />
              }
              onClick={isLastStep ? submitQuiz : goNext}
              loading={isSubmitting}
              sx={{
                py: 1.2,
                px: 3,
                minWidth: 0,
                flex: 1,
              }}
            >
              {isLastStep ? config.ui.submit : config.ui.next}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
