"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import { HashtagForm } from "@/src/features/hashtag";
import { IHashtagForm } from "@/src/features/hashtag/types/hashtag.interface";
import { hashtagchema } from "@/src/validators/hashtag.schema";

export default function HashtagCreate() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IHashtagForm, HttpError, IHashtagForm>({
    resolver: joiResolver(hashtagchema(t)),
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <HashtagForm
        errors={errors}
        registerAction={register}
        getValuesAction={getValues}
        setValueAction={setValue}
      />
    </Create>
  );
}
