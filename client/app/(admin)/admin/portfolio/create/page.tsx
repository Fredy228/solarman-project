"use client";

import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { portfolioSchema } from "@/src/validators/portfolio";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import { IPortfolio } from "@/src/features/portfolio";

export default function PortfolioCreate() {
  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IPortfolio>({
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
