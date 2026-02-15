"use client";

import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";

import type { IOrder, IOrderForm } from "@/src/features/order";
import { OrderForm } from "@/src/features/order/components/OrderForm";
import { orderSchema } from "@/src/validators/order.schema";

export default function OrderCreatePage() {
  const t = useTranslations("validation");

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<IOrder, HttpError, IOrderForm>({
    resolver: joiResolver(orderSchema(t)),
  });

  const handleSave = (data: IOrderForm) => {
    const createData = {} as IOrderForm;
    Object.entries(data).forEach(([key, value]) => {
      if (!value) return;
      if (key === "phone") {
        createData[key] = "380" + value;
        return;
      }
      createData[key as keyof IOrderForm] = value;
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
      <OrderForm control={control} errors={errors} registerAction={register} />
    </Create>
  );
}
