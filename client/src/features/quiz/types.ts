export type QuizModuleType =
  | "image-options"
  | "text-options"
  | "slider"
  | "contact-form";

export type QuizTextPart = {
  text: string;
  accent?: boolean;
};

export type QuizUiLabels = {
  progressLabel: string;
  back: string;
  next: string;
  submit: string;
  home: string;
  requiredMessage: string;
  submitError: string;
};

export type QuizIntroConfig = {
  title: QuizTextPart[];
  subtitle: string;
  buttonLabel: string;
  leftImage?: string | null;
  leftImageAlt?: string;
  rightImage?: string | null;
  rightImageAlt?: string;
};

export type QuizSuccessConfig = {
  title: string;
  subtitle: string;
  image?: string | null;
  imageAlt?: string;
};

export type QuizGoogleAdsConversionConfig = {
  stepId: string;
  optionFormTypes: Record<string, string>;
  fallbackFormType?: string;
};

export type QuizOptionInput = {
  id: string;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
};

export type QuizVisibleIfRule = {
  stepId: string;
  optionIds: string[];
};

export type QuizOption = {
  id: string;
  title: string;
  description?: string;
  image?:
    | string
    | {
        desktop?: string | null;
        mobile?: string | null;
      }
    | null;
  imageAlt?: string;
  input?: QuizOptionInput;
};

type QuizBaseStep = {
  id: string;
  module: QuizModuleType;
  question: string;
  required?: boolean;
  visibleIf?: QuizVisibleIfRule | QuizVisibleIfRule[];
};

export type QuizImageOptionsStep = QuizBaseStep & {
  module: "image-options";
  options: QuizOption[];
};

export type QuizTextOptionsStep = QuizBaseStep & {
  module: "text-options";
  options: QuizOption[];
};

export type QuizSliderOption = {
  id: string;
  label: string;
  mobileLabel?: string;
  value?: number;
};

export type QuizSliderStep = QuizBaseStep & {
  module: "slider";
  options: QuizSliderOption[];
  defaultOptionId?: string;
  mobileHint?: string;
};

export type QuizFormField = {
  id: string;
  label: string;
  placeholder?: string;
  inputType?: "text" | "tel" | "email";
  required?: boolean;
  maxLength?: number;
};

export type QuizContactFormStep = QuizBaseStep & {
  module: "contact-form";
  fields: QuizFormField[];
};

export type QuizStep =
  | QuizImageOptionsStep
  | QuizTextOptionsStep
  | QuizSliderStep
  | QuizContactFormStep;

export type QuizConfig = {
  id: string;
  slug: string;
  pageTitle: string;
  progressTotal?: number;
  meta: {
    title: string;
    description: string;
  };
  ui: QuizUiLabels;
  intro: QuizIntroConfig;
  success: QuizSuccessConfig;
  googleAdsConversion?: QuizGoogleAdsConversionConfig;
  steps: QuizStep[];
};

export type QuizOptionAnswer = {
  optionId: string;
  inputValue?: string;
};

export type QuizFormAnswer = Record<string, string>;

export type QuizAnswerValue = QuizOptionAnswer | QuizFormAnswer;

export type QuizAnswers = Record<string, QuizAnswerValue>;
