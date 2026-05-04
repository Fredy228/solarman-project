import { ELocale } from "@/src/i18n/routing";
import type { QuizConfig } from "../types";
import solarMatchRu from "./solar-match-quiz.ru.json";
import solarMatchUk from "./solar-match-quiz.uk.json";
import quizRu from "./solar-station-quiz.ru.json";
import quizUk from "./solar-station-quiz.uk.json";

const quizRegistry = {
  "solar-match": {
    [ELocale.UK]: solarMatchUk,
    [ELocale.RU]: solarMatchRu,
  },
  main: {
    [ELocale.UK]: quizUk,
    [ELocale.RU]: quizRu,
  },
} as const;

export type QuizSlug = keyof typeof quizRegistry;

export function getQuizConfig(locale: ELocale): QuizConfig {
  return quizRegistry.main[locale] as QuizConfig;
}

export function getQuizConfigBySlug(
  locale: ELocale,
  slug: string,
): QuizConfig | null {
  const entry = quizRegistry[slug as QuizSlug];

  if (!entry) return null;

  return entry[locale] as QuizConfig;
}
