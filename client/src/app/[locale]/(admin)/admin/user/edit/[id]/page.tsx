"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { useNavigation, useOne, type HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { IUser, IUserForm } from "@/src/features/user";
import { UserForm } from "@/src/features/user/components/UserForm";
import { userEditSchema } from "@/src/validators/user.schema";

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    query: { data, isLoading },
  } = useOne<IUser>({
    resource: "user",
    id,
  });

  const userData: IUser | undefined = useMemo(() => {
    if (!data?.data) return undefined;
    return data.data;
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<IUserForm, HttpError, IUserForm>({
    resolver: joiResolver(userEditSchema(t)),
    refineCoreProps: {
      resource: "user",
      id,
      action: "edit",
      redirect: "list",
    },
  });

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name,
        email: userData.email ?? "",
        phone: userData.phone ? String(userData.phone).replace(/^380/, "") : "",
        role: userData.role,
        isBlocked: userData.isBlocked,
        password: "",
      });
      setTimeout(() => setIsInitializing(false), 0);
    }
  }, [userData, reset]);

  const handleSave = (data: IUserForm) => {
    if (Object.keys(dirtyFields).length === 0) return list("user");

    const updatedData: Partial<IUserForm> = {};
    (Object.keys(dirtyFields) as Array<keyof IUserForm>).forEach((key) => {
      if (key === "phone") {
        const digits = String(data[key] ?? "").replace(/\D/g, "");
        updatedData[key] = digits ? "380" + digits.slice(-9) : undefined;
        return;
      }
      if (key === "password" && !data[key]) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      updatedData[key] = data[key];
    });

    void onFinish(updatedData as IUserForm);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading || isInitializing}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <UserForm control={control} errors={errors} registerAction={register} />
    </Edit>
  );
}
