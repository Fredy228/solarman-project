"use client";

import { Edit } from "@refinedev/mui";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

import { portfolioUpdateSchema } from "@/src/validators/portfolio.schema";
import { PortfolioForm } from "@/src/features/portfolio/components/PortfolioForm";
import {
  EPortfolioType,
  IPortfolio,
  IPortfolioForm,
} from "@/src/features/portfolio";

export const PortfolioEditForm = () => {
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
    if (!data?.data) {
      return undefined;
    }

    return data.data;
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
    getValues,
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
      type: EPortfolioType.HOME,
    },
  });

  useEffect(() => {
    if (portfolioData) {
      reset({
        titleUk: portfolioData.title.uk,
        titleRu: portfolioData.title.ru,
        tag: portfolioData.tag,
        descriptionUk: portfolioData.description?.uk
          ? JSON.parse(portfolioData.description.uk)
          : undefined,
        descriptionRu: portfolioData.description?.ru
          ? JSON.parse(portfolioData.description.ru)
          : undefined,
        date: dayjs(portfolioData.date),
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
      } else if (["descriptionUk", "descriptionRu"].includes(key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = JSON.stringify(data[key]);
      } else if (key === "date") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = data[key] ? dayjs(data[key]).toISOString() : null;
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
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <PortfolioForm
        control={control}
        errors={errors}
        registerAction={register}
        watch={watch}
        setValueAction={setValue}
        getValuesAction={getValues}
        isEdit={true}
        portfolio={portfolioData}
      />
    </Edit>
  );
};
