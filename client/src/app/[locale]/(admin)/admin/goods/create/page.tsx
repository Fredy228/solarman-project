"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import { GoodsForm } from "@/src/features/goods/components/GoodsForm";
import { IGoodsForm } from "@/src/features/goods/types/goods.interface";
import { goodsSchema } from "@/src/validators/goods.schema";

export default function GoodsCreatePage() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<IGoodsForm, HttpError, IGoodsForm>({
    resolver: joiResolver(goodsSchema(t)),
  });

  const handleSave = (data: IGoodsForm) => {
    const createData = {} as IGoodsForm;
    Object.entries(data).forEach(([key, value]) => {
      if (!value) return;
      if (key === "specs")
        return (createData.specs = JSON.stringify(
          value,
        ) as unknown as IGoodsForm["specs"]);
      if (key === "price" || key === "discountPrice")
        return (createData[key] = (parseFloat(value) *
          100) as unknown as string);
      createData[key as keyof IGoodsForm] = value;
    });

    void onFinish(createData);
  };

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <GoodsForm
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
