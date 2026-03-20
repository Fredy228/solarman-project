"use client";

import type { TContacts } from "@/src/features/global-params";
import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { ContactsForm } from "@/src/features/global-params/components/ContactsForm";
import { revalidateCache } from "@/src/libs/revalidateCache";
import { globalParamContactsSchema } from "@/src/validators/global-param-items.schema";
import { Edit } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

export default function ContactsAdminPage() {
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IGlobalParam<TContacts>>({
    resource: "global-param",
    id: "contacts",
  });

  const contactsData: TContacts | undefined = useMemo(() => {
    if (!data?.data?.value) {
      return undefined;
    }

    return data.data.value;
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    reset,
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<TContacts, HttpError, TContacts>({
    resolver: joiResolver(globalParamContactsSchema(t)),
    refineCoreProps: {
      resource: "global-param",
      action: "edit",
      redirect: "list",
    },
  });

  const addressWatch = watch("address");

  useEffect(() => {
    if (contactsData) {
      reset({
        ...contactsData,
        phone: contactsData.phone
          ? String(contactsData.phone).replace(/^380/, "")
          : "",
      });
    }
  }, [contactsData, reset]);

  const handleSave = (data: TContacts) => {
    if (Object.keys(dirtyFields).length === 0) {
      return;
    }

    const updatedData = {} as TContacts;

    (Object.keys(dirtyFields) as Array<keyof TContacts>).forEach((key) => {
      if (key === "phone") {
        const digits = String(data[key] ?? "").replace(/\D/g, "");
        updatedData["phone"] = digits ? "380" + digits.slice(-9) : "";
        return;
      }
      if (key === "address") {
        updatedData["address"] = addressWatch;
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      updatedData[key] = data[key];
    });

    void onFinish({
      name: "contacts",
      value: updatedData,
    } as unknown as TContacts).then(async () => {
      await revalidateCache([CACHE_TAGS.contacts]);
    });
  };

  return (
    <Edit
      isLoading={isLoading || formLoading}
      goBack={<></>}
      headerButtons={<></>}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <ContactsForm
        control={control}
        errors={errors}
        registerAction={register}
      />
    </Edit>
  );
}
