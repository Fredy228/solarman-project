"use client";

import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { useTranslations } from "next-intl";

import { goodsBrandSchema } from "@/src/validators/goods-brand.schema";
import { IGoodsBrandForm } from "@/src/features/goods-brand";
import { GoodsBrandForm } from "@/src/features/goods-brand/components/GoodsBrandForm";

export default function GoodsBrandCreate() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    formState: { errors },
  } = useForm<IGoodsBrandForm, HttpError, IGoodsBrandForm>({
    resolver: joiResolver(goodsBrandSchema(t)),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <GoodsBrandForm errors={errors} registerAction={register} />
    </Create>
  );
}
