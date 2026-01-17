"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import { IPortfolioForm, PortfolioForm } from "@/src/features/portfolio";
import { portfolioSchema } from "@/src/validators/portfolio.schema";

export default function PortfolioCreate() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<IPortfolioForm, HttpError, IPortfolioForm>({
    resolver: joiResolver(portfolioSchema(t)),
    defaultValues: {
      cover: null,
      titleUk: "",
      titleRu: "",
      tag: "",
      descriptionUk: undefined,
      descriptionRu: undefined,
      images: null,
      date: null,
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <PortfolioForm
        control={control}
        errors={errors}
        registerAction={register}
        watch={watch}
        setValueAction={setValue}
        getValuesAction={getValues}
      />
    </Create>
  );
}
