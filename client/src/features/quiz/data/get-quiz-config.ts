import { ELocale } from "@/src/i18n/routing";
import type { QuizConfig } from "../types";
import quizRu from "./solar-station-quiz.ru.json";
import quizUk from "./solar-station-quiz.uk.json";

export function getQuizConfig(locale: ELocale): QuizConfig {
  return (locale === ELocale.RU ? quizRu : quizUk) as QuizConfig;
}
