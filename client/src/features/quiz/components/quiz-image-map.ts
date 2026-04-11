import quizPurposeBusinessMobile from "@/src/assets/quiz/main-quiz/quiz-1-1_mobile.webp";
import quizPurposeBusinessPc from "@/src/assets/quiz/main-quiz/quiz-1-1_pc.webp";
import quizPurposeHomeMobile from "@/src/assets/quiz/main-quiz/quiz-1-2_mobile.webp";
import quizPurposeHomePc from "@/src/assets/quiz/main-quiz/quiz-1-2_pc.webp";
import quizPurposeIncomeMobile from "@/src/assets/quiz/main-quiz/quiz-1-3_mobile.webp";
import quizPurposeIncomePc from "@/src/assets/quiz/main-quiz/quiz-1-3_pc.webp";
import quizDiagram from "@/src/assets/quiz/quiz-diagrama.webp";
import quizStart from "@/src/assets/quiz/quiz-start.webp";
import quizThanks from "@/src/assets/quiz/thanks.webp";
import type { StaticImageData } from "next/image";

const quizImageMap: Record<string, StaticImageData> = {
  quizDiagram,
  quizPurposeBusinessMobile,
  quizPurposeBusinessPc,
  quizPurposeHomeMobile,
  quizPurposeHomePc,
  quizPurposeIncomeMobile,
  quizPurposeIncomePc,
  quizStart,
  quizThanks,
};

export type QuizResolvedImage = StaticImageData | string;

export function resolveQuizImage(src?: string | null): QuizResolvedImage | null {
  if (!src) return null;

  if (src.startsWith("asset:")) {
    const key = src.replace("asset:", "");
    return quizImageMap[key] ?? null;
  }

  return src;
}
