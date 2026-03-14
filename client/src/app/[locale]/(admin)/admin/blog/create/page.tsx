"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import { BlogForm, IBlogForm } from "@/src/features/blog";
import { blogSchema } from "@/src/validators/blog.schema";

export default function BlogCreate() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading },
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<IBlogForm, HttpError, IBlogForm>({
    resolver: joiResolver(blogSchema(t)),
    // defaultValues: {
    //   cover: null,
    //   titleUk: "",
    //   titleRu: "",
    //   tag: "",
    //   descriptionUk: undefined,
    //   descriptionRu: undefined,
    //   images: null,
    //   date: null,
    // },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <BlogForm
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
