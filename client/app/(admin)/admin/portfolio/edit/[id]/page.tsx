"use client";

import { Edit } from "@refinedev/mui";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { portfolioUpdateSchema } from "@/src/validators/portfolio.schema";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import { IPortfolio, IPortfolioForm } from "@/src/features/portfolio";

export default function PortfolioEdit() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();

  const {
    query: { data, isLoading },
  } = useOne<IPortfolio>({
    resource: "portfolio",
    id,
  });

  const portfolioData: IPortfolio | undefined = useMemo(() => {
    return (
      data?.data && {
        ...data.data,
        date: new Date(data.data.date).toISOString().split("T")[0],
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
  } = useForm<IPortfolioForm, HttpError, IPortfolioForm>({
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
        title: portfolioData.title,
        tag: portfolioData.tag,
        description: portfolioData.description,
        date: portfolioData.date,
      });
    }
  }, [portfolioData, reset]);

  const handleSave = (data: IPortfolioForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return list("portfolio");
    }

    const updatedData: Partial<IPortfolioForm> = {};

    (Object.keys(dirtyFields) as Array<keyof IPortfolioForm>).forEach((key) => {
      if (key === "title" && !dirtyFields["tag"]) {
        updatedData["title"] = data["title"];
        updatedData["tag"] = data["tag"];
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = data[key];
      }
    });

    void onFinish(updatedData as IPortfolioForm);
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
