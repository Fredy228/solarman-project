"use client";

import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";

import { ECurrency } from "@/src/shared/types/currency.enum";
import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";
import type { TExchangeRatesForm } from "../types/exchange-rate.type";

type ExchangeRateFormProps = {
  errors: FieldErrors<TExchangeRatesForm>;
  control: Control<TExchangeRatesForm>;
};

export const ExchangeRateForm: FC<ExchangeRateFormProps> = ({
  errors,
  control,
}) => {
  const t = useTranslations("refine");

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Controller
        name={ECurrency.UAH}
        control={control}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            value={field.value}
            suffix={" = 1$"}
            label={t("exchange-rate.fields.UAH")}
            error={!!errors?.UAH}
            helperText={errors?.UAH?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name={ECurrency.EUR}
        control={control}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            value={field.value}
            suffix={" = 1$"}
            label={t("exchange-rate.fields.EUR")}
            error={!!errors?.EUR}
            helperText={errors?.EUR?.message}
            fullWidth
          />
        )}
      />
    </Box>
  );
};
