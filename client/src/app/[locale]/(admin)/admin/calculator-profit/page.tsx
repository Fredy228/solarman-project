"use client";

import type {
  TCalculatorProfit,
  TCalculatorProfitForm,
} from "@/src/features/global-params";
import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { CalculatorProfitForm } from "@/src/features/global-params/components/CalculatorProfitForm";
import { revalidateCache } from "@/src/libs/revalidateCache";
import { EGlobalParam } from "@/src/shared/types/global-param.enum";
import { globalParamCalculatorProfitSchema } from "@/src/validators/global-param-items.schema";
import { Edit } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

export default function CalculatorProfitAdminPage() {
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IGlobalParam<TCalculatorProfit>>({
    resource: "global-param",
    id: EGlobalParam.CALCULATOR_PROFIT,
  });

  const calculatorProfitData: TCalculatorProfit | undefined = useMemo(() => {
    if (!data?.data?.value) {
      return undefined;
    }

    return data.data.value;
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<TCalculatorProfit, HttpError, TCalculatorProfitForm>({
    resolver: joiResolver(globalParamCalculatorProfitSchema(t)),
    refineCoreProps: {
      resource: "global-param",
      action: "edit",
      redirect: "list",
    },
  });

  useEffect(() => {
    if (calculatorProfitData) {
      reset(calculatorProfitData as unknown as TCalculatorProfitForm);
    }
  }, [calculatorProfitData, reset]);

  const handleSave = (data: TCalculatorProfitForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return;
    }

    const updatedData = {} as TCalculatorProfitForm;

    (Object.keys(dirtyFields) as Array<keyof TCalculatorProfitForm>).forEach(
      (key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = data[key];
      },
    );

    console.log("Updated Data:", updatedData);

    void onFinish({
      name: EGlobalParam.CALCULATOR_PROFIT,
      value: updatedData,
    } as unknown as TCalculatorProfitForm).then(async () => {
      await revalidateCache(CACHE_TAGS.calculatorProfit);
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
      <CalculatorProfitForm
        control={control}
        errors={errors}
        registerAction={register}
      />
    </Edit>
  );
}
