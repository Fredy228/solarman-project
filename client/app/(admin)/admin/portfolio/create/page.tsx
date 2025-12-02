"use client";

import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";

import { portfolioSchema } from "@/src/validators/portfolio.schema";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import { IPortfolioForm } from "@/src/features/portfolio";

export default function PortfolioCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IPortfolioForm, HttpError, IPortfolioForm>({
    resolver: joiResolver(portfolioSchema),
    defaultValues: {
      cover: null,
      title: "",
      tag: "",
      description: "",
      images: null,
      date: "",
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <PortfolioForm
        control={control}
        errors={errors}
        register={register}
        watch={watch}
        setValue={setValue}
      />
    </Create>
  );
}
