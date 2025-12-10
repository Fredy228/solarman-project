"use client";

import { Edit } from "@refinedev/mui";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

import { portfolioUpdateSchema } from "@/src/validators/portfolio.schema";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import { IPortfolio, IPortfolioForm } from "@/src/features/portfolio";

export default function PortfolioEdit() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");

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
    resolver: joiResolver(portfolioUpdateSchema(t)),
    refineCoreProps: {
      resource: "portfolio",
      id,
      action: "edit",
      redirect: "show",
    },
    defaultValues: {
      titleUk: "",
      titleRu: "",
      tag: "",
      descriptionUk: undefined,
      descriptionRu: undefined,
      date: null,
      cover: null,
      images: null,
    },
  });

  useEffect(() => {
    if (portfolioData) {
      reset({
        titleUk: portfolioData.titleUk,
        titleRu: portfolioData.titleRu,
        tag: portfolioData.tag,
        descriptionUk: portfolioData.descriptionUk,
        descriptionRu: portfolioData.descriptionRu,
        date: portfolioData.date,
        images: null,
        cover: null,
      });
    }
  }, [portfolioData, reset]);

  const handleSave = (data: IPortfolioForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return list("portfolio");
    }

    const updatedData: Partial<IPortfolioForm> = {};

    (Object.keys(dirtyFields) as Array<keyof IPortfolioForm>).forEach((key) => {
      if (key === "titleUk" && !dirtyFields["tag"]) {
        updatedData["titleUk"] = data["titleUk"];
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
        registerAction={register}
        watch={watch}
        setValueAction={setValue}
        isEdit={true}
        portfolio={portfolioData}
      />
    </Edit>
  );
}
