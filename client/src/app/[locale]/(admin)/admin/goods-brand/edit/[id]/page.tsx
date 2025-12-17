"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { Edit } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { IGoodsBrand, IGoodsBrandForm } from "@/src/features/goods-brand";
import { goodsBrandSchema } from "@/src/validators/goods-brand.schema";
import { GoodsBrandForm } from "@/src/features/goods-brand/components/GoodsBrandForm";

export default function GoodsBrandEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IGoodsBrand>({
    resource: "goods-brand",
    id,
  });

  const goodsBrandData: IGoodsBrand | undefined = useMemo(() => {
    if (!data?.data) {
      return undefined;
    }

    return data.data;
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    reset,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<IGoodsBrandForm, HttpError, IGoodsBrandForm>({
    resolver: joiResolver(goodsBrandSchema(t)),
    refineCoreProps: {
      resource: "goods-brand",
      id,
      action: "edit",
      redirect: "list",
    },
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (goodsBrandData) {
      reset({
        name: goodsBrandData.name,
      });
    }
  }, [goodsBrandData, reset]);

  const handleSave = (data: IGoodsBrandForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return list("portfolio");
    }

    const updatedData: Partial<IGoodsBrandForm> = {};

    (Object.keys(dirtyFields) as Array<keyof IGoodsBrandForm>).forEach(
      (key) => {
        updatedData[key] = data[key];
      },
    );

    void onFinish(updatedData as IGoodsBrandForm);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <GoodsBrandForm errors={errors} registerAction={register} />
    </Edit>
  );
}
