"use client";

import type { IGlobalParam } from "@/src/shared/types/global-param.interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { HttpError, useOne } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import type {
  TExchangeRates,
  TExchangeRatesForm,
} from "@/src/features/global-params";
import { ExchangeRateForm } from "@/src/features/global-params/components/ExchangeRateForm";
import { revalidateCache } from "@/src/libs/revalidateCache";
import { EGlobalParam } from "@/src/shared/types/global-param.enum";
import { globalParamExchangeRateSchema } from "@/src/validators/global-param-items.schema";
import { Edit } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

export default function ExchangeRateAdminPage() {
  const t = useTranslations("validation");

  const {
    query: { data, isLoading },
  } = useOne<IGlobalParam<TExchangeRates>>({
    resource: "global-param",
    id: EGlobalParam.EXCHANGE_RATE,
  });

  const exchangeRateData: TExchangeRates | undefined = useMemo(() => {
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
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<TExchangeRates, HttpError, TExchangeRatesForm>({
    resolver: joiResolver(globalParamExchangeRateSchema(t)),
    refineCoreProps: {
      resource: "global-param",
      action: "edit",
      redirect: "list",
    },
  });

  useEffect(() => {
    if (exchangeRateData) {
      reset(exchangeRateData as unknown as TExchangeRatesForm);
    }
  }, [exchangeRateData, reset]);

  const handleSave = (data: TExchangeRatesForm) => {
    if (Object.keys(dirtyFields).length === 0) {
      return;
    }

    const updatedData = {} as TExchangeRatesForm;

    (Object.keys(dirtyFields) as Array<keyof TExchangeRatesForm>).forEach(
      (key) => {
        updatedData[key] = data[key];
      },
    );

    void onFinish({
      name: EGlobalParam.EXCHANGE_RATE,
      value: updatedData,
    } as unknown as TExchangeRatesForm).then(async () => {
      await revalidateCache(CACHE_TAGS.exchangeRate);
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
      <ExchangeRateForm errors={errors} control={control} />
    </Edit>
  );
}
