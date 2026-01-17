"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useNavigation, useOne } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import {
  HashtagForm,
  type IHashtag,
  type IHashtagForm,
} from "@/src/features/hashtag";
import { hashtagchema } from "@/src/validators/hashtag.schema";

export default function HashtagEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IHashtag>({
    resource: "hashtag",
    id,
  });

  const hashtagData: IHashtag | undefined = useMemo(() => {
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
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm<IHashtagForm, HttpError, IHashtagForm>({
    resolver: joiResolver(hashtagchema(t)),
    refineCoreProps: {
      resource: "hashtag",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  useEffect(() => {
    if (hashtagData) {
      reset({
        nameUk: hashtagData.name.uk,
        nameRu: hashtagData.name.ru,
        tag: hashtagData.tag,
      });
    }
  }, [hashtagData, reset]);

  const handleSave = (data: IHashtagForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return list("hashtag");
    }

    const updatedData: Partial<IHashtagForm> = {};

    (Object.keys(dirtyFields) as Array<keyof IHashtagForm>).forEach((key) => {
      updatedData[key] = data[key];
    });

    void onFinish(updatedData as IHashtagForm);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <HashtagForm
        errors={errors}
        registerAction={register}
        getValuesAction={getValues}
        setValueAction={setValue}
      />
    </Edit>
  );
}
