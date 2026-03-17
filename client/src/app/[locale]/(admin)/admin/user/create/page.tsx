"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import type { IUser, IUserForm } from "@/src/features/user";
import { UserForm } from "@/src/features/user/components/UserForm";
import { userSchema } from "@/src/validators/user.schema";

export default function UserCreatePage() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<IUser, HttpError, IUserForm>({
    resolver: joiResolver(userSchema(t)),
  });

  const handleSave = (data: IUserForm) => {
    const createData: Partial<IUserForm> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") return;
      if (key === "phone") {
        createData[key] = "380" + String(value).replace(/\D/g, "").slice(-9);
        return;
      }
      createData[key as keyof IUserForm] = value as never;
    });

    void onFinish(createData as IUserForm);
  };

  return (
    <Create
      isLoading={formLoading}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <UserForm control={control} errors={errors} registerAction={register} />
    </Create>
  );
}
