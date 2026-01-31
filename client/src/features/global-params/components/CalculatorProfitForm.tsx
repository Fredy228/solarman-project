"use client";

import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";
import type { TCalculatorProfitForm } from "../types/calculator-profit.type";
import RangePowerForm from "./parts/RangePowerForm";
import RangeRatePerKwhForm from "./parts/RangeratePerKwhForm";

type CalculatorProfitFormProps = {
  errors: FieldErrors<TCalculatorProfitForm>;
  registerAction: UseFormRegister<TCalculatorProfitForm>;
  control: Control<TCalculatorProfitForm>;
};

export const CalculatorProfitForm: FC<CalculatorProfitFormProps> = ({
  errors,
  registerAction,
  control,
}) => {
  const t = useTranslations("refine");

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Divider textAlign="left">
        <Chip
          label={t("calculator-profit.sections.min_max_range_power")}
          size="small"
        />
      </Divider>
      <Typography>{t("calculator-profit.types.NETWORK")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          name="min_max_range_power.NETWORK.min"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.min_range_power")}
              error={!!errors?.min_max_range_power?.NETWORK?.min}
              helperText={errors?.min_max_range_power?.NETWORK?.min?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="min_max_range_power.NETWORK.max"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.max_range_power")}
              error={!!errors?.min_max_range_power?.NETWORK?.max}
              helperText={errors?.min_max_range_power?.NETWORK?.max?.message}
              fullWidth
            />
          )}
        />
      </Stack>
      <Typography>{t("calculator-profit.types.HYBRID")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          name="min_max_range_power.HYBRID.min"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.min_range_power")}
              error={!!errors?.min_max_range_power?.HYBRID?.min}
              helperText={errors?.min_max_range_power?.HYBRID?.min?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="min_max_range_power.HYBRID.max"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.max_range_power")}
              error={!!errors?.min_max_range_power?.HYBRID?.max}
              helperText={errors?.min_max_range_power?.HYBRID?.max?.message}
              fullWidth
            />
          )}
        />
      </Stack>

      <Divider textAlign="left">
        <Chip
          label={t("calculator-profit.sections.range_power")}
          size="small"
        />
      </Divider>
      <RangePowerForm
        errors={errors}
        control={control}
        registerAction={registerAction}
        t={t}
      />

      <Divider textAlign="left">
        <Chip
          label={t("calculator-profit.sections.range_rate_per_kwh")}
          size="small"
        />
      </Divider>
      <RangeRatePerKwhForm
        errors={errors}
        control={control}
        registerAction={registerAction}
        t={t}
      />

      <Divider textAlign="left">
        <Chip
          label={t("calculator-profit.sections.station_operating_time")}
          size="small"
        />
      </Divider>
      <Typography>{t("calculator-profit.types.NETWORK")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          name="station_operating_time.NETWORK.min"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.years")}`}
              label={t("calculator-profit.fields.min_operating_time")}
              error={!!errors?.station_operating_time?.NETWORK?.min}
              helperText={errors?.station_operating_time?.NETWORK?.min?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="station_operating_time.NETWORK.max"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.years")}`}
              label={t("calculator-profit.fields.max_operating_time")}
              error={!!errors?.station_operating_time?.NETWORK?.max}
              helperText={errors?.station_operating_time?.NETWORK?.max?.message}
              fullWidth
            />
          )}
        />
      </Stack>
      <Typography>{t("calculator-profit.types.HYBRID")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          name="station_operating_time.HYBRID.min"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.years")}`}
              label={t("calculator-profit.fields.min_operating_time")}
              error={!!errors?.station_operating_time?.HYBRID?.min}
              helperText={errors?.station_operating_time?.HYBRID?.min?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="station_operating_time.HYBRID.max"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.measurements.years")}`}
              label={t("calculator-profit.fields.max_operating_time")}
              error={!!errors?.station_operating_time?.HYBRID?.max}
              helperText={errors?.station_operating_time?.HYBRID?.max?.message}
              fullWidth
            />
          )}
        />
      </Stack>

      <Divider textAlign="left">
        <Chip label={t("calculator-profit.sections.tariff")} size="small" />
      </Divider>
      <Stack direction={"row"} gap={5}>
        <Controller
          name="tariff.min"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.currency.UAH")}`}
              label={t("calculator-profit.fields.min_tariff")}
              error={!!errors?.tariff?.min}
              helperText={errors?.tariff?.min?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="tariff.max"
          control={control}
          // defaultValue={defaultValues?.power}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              suffix={` ${t("goods.currency.UAH")}`}
              label={t("calculator-profit.fields.max_tariff")}
              error={!!errors?.tariff?.max}
              helperText={errors?.tariff?.max?.message}
              fullWidth
            />
          )}
        />
      </Stack>
    </Box>
  );
};
