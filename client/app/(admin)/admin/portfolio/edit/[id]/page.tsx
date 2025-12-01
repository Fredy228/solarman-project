"use client";

import { Edit } from "@refinedev/mui";
import { HttpError, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { portfolioSchema } from "@/src/validators/portfolio";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import { IPortfolio } from "@/src/features/portfolio";

export default function PortfolioEdit() {
  const { id } = useParams<{ id: string }>();

  const {
    query: { data, isLoading },
  } = useOne<IPortfolio>({
    resource: "portfolio",
    id,
  });

  const portfolioData = useMemo(() => {
    return (
      data?.data && {
        ...data.data,
        date: data.data.date
          ? (new Date(data.data.date)
              .toISOString()
              .split("T")[0] as unknown as Date)
          : null,
      }
    );
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
    reset,
  } = useForm<IPortfolio, HttpError, IPortfolio>({
    resolver: joiResolver(portfolioSchema),
    refineCoreProps: {
      resource: "portfolio",
      id,
      action: "edit",
      redirect: "show",
    },
    defaultValues: {
      title: "",
      tag: "",
      description: "",
      date: null,
      cover: null,
      images: null,
    },
  });

  useEffect(() => {
    if (portfolioData) {
      reset(portfolioData);
    }
  }, [portfolioData, reset]);

  const handleSave = (data: IPortfolio) => {
    const dirtyData: Partial<IPortfolio> = {};
    const dirtyFieldKeys = Object.keys(dirtyFields) as (keyof IPortfolio)[];

    for (const key of dirtyFieldKeys) {
      // @ts-expect-error We are intentionally creating a partial object from a full object
      dirtyData[key] = data[key];
    }
    void onFinish(dirtyData as IPortfolio);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave),
      }}
    >
      <PortfolioForm
        control={control}
        errors={errors}
        register={register}
        watch={watch}
        setValue={setValue}
        isEdit={true}
        portfolio={portfolioData}
      />
    </Edit>
  );
}
