import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { TranslatorType } from "@/src/i18n/types";
import type { TCalculatorProfitForm } from "./calculator-profit.type";

export type CalcFormProps = {
  control: Control<TCalculatorProfitForm>;
  errors: FieldErrors<TCalculatorProfitForm>;
  registerAction: UseFormRegister<TCalculatorProfitForm>;
  t: TranslatorType;
};
