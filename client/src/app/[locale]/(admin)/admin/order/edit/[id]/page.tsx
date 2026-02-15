"use client";

import { useNavigation, useOne, type HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { IOrder, IOrderForm } from "@/src/features/order";
import { OrderForm } from "@/src/features/order/components/OrderForm";
import { orderSchema } from "@/src/validators/order.schema";
import { joiResolver } from "@hookform/resolvers/joi";

export default function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    query: { data, isLoading },
  } = useOne<IOrder>({
    resource: "order",
    id,
  });

  const orderData: IOrder | undefined = useMemo(() => {
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
    reset,
  } = useForm<IOrderForm, HttpError, IOrderForm>({
    resolver: joiResolver(orderSchema(t)),
    refineCoreProps: {
      resource: "order",
      id,
      action: "edit",
      redirect: "show",
    },
  });

  useEffect(() => {
    if (orderData) {
      reset({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone.replace(/^380/, ""),
        type: orderData.type,
        notes: orderData.notes,
      });
      setTimeout(() => setIsInitializing(false), 0);
    }
  }, [orderData, reset]);

  const handleSave = (data: IOrderForm) => {
    if (Object.keys(dirtyFields).length === 0) return list("order");

    const updatedData = {} as IOrderForm;
    (Object.keys(dirtyFields) as Array<keyof IOrderForm>).forEach((key) => {
      if (key === "phone") {
        updatedData[key] = "380" + data[key];
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      updatedData[key] = data[key];
    });

    console.log(updatedData);

    void onFinish(updatedData);
  };

  return (
    <Edit
      isLoading={isLoading || formLoading || isInitializing}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <OrderForm control={control} errors={errors} registerAction={register} />
    </Edit>
  );
}
