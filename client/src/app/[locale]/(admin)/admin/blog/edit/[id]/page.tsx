"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { BlogForm, type IBlog, type IBlogForm } from "@/src/features/blog";
import { revalidateCache } from "@/src/libs/revalidateCache";
import { blogUpdateSchema } from "@/src/validators/blog.schema";

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IBlog>({
    resource: "blog",
    id,
  });

  const blogData: IBlog | undefined = useMemo(() => {
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
  } = useForm<IBlogForm, HttpError, IBlogForm>({
    resolver: joiResolver(blogUpdateSchema(t)),
    refineCoreProps: {
      resource: "blog",
      id,
      action: "edit",
      redirect: "show",
    },
  });

  useEffect(() => {
    if (!blogData || formLoading) {
      return;
    }

    reset({
      titleUk: blogData.title.uk,
      titleRu: blogData.title.ru,
      descriptionUk: blogData.description.uk,
      descriptionRu: blogData.description.ru,
      tag: blogData.tag,
      textUk: blogData.text?.uk ? JSON.parse(blogData.text.uk) : undefined,
      textRu: blogData.text?.ru ? JSON.parse(blogData.text.ru) : undefined,
      cover: null,
    });
  }, [blogData, formLoading, reset]);

  const handleSave = (data: IBlogForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return list("blog");
    }

    const updatedData: Partial<IBlogForm> = {};

    (Object.keys(dirtyFields) as Array<keyof IBlogForm>).forEach((key) => {
      if (key === "titleUk" && !dirtyFields["tag"]) {
        updatedData["titleUk"] = data["titleUk"];
        updatedData["tag"] = data["tag"];
      } else if (["textUk", "textRu"].includes(key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = JSON.stringify(data[key]);
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = data[key];
      }
    });

    void onFinish(updatedData as IBlogForm).then(async () => {
      await revalidateCache([CACHE_TAGS.blogId(data.tag), CACHE_TAGS.blogList]);
    });
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <BlogForm
        control={control}
        errors={errors}
        registerAction={register}
        watch={watch}
        setValueAction={setValue}
        getValuesAction={getValues}
        isEdit={true}
        blog={blogData}
      />
    </Edit>
  );
}
