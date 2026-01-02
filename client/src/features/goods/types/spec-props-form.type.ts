import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { IGoodsForm } from "@/src/features/goods/types/goods.interface";
import { TranslatorType } from "@/src/i18n/types";

export type SpecFormProps<T> = {
  control: Control<IGoodsForm>;
  errors: FieldErrors<IGoodsForm>;
  registerAction: UseFormRegister<IGoodsForm>;
  t: TranslatorType;
  defaultValues?: T;
};
