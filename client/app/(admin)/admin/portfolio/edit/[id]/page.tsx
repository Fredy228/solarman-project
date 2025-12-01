"use client";

import { Edit } from "@refinedev/mui";
import { HttpError, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { portfolioUpdateSchema } from "@/src/validators/portfolio.schema";
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
        title: data.data.title,
        tag: data.data.tag,
        description: data.data.description,
        cover: data.data.cover,
        images: data.data.images,
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
  } = useForm<IPortfolio, HttpError, Partial<IPortfolio>>({
    resolver: joiResolver(portfolioUpdateSchema),
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
      reset({
        ...portfolioData,
        images: null,
        cover: null,
      });
    }
  }, [portfolioData, reset]);

  const handleSave = (data: Partial<IPortfolio>) => {
    console.log("update portfolio");
    const updatedData: Partial<IPortfolio> = {};

    (Object.keys(dirtyFields) as Array<keyof IPortfolio>).forEach((key) => {
      if (key === "title" && !dirtyFields["tag"]) {
        updatedData["title"] = data["title"];
        updatedData["tag"] = data["tag"];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      updatedData[key] = data[key];
    });

    if (Object.keys(updatedData).length === 0) return;

    void onFinish(updatedData);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.log(err)),
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
