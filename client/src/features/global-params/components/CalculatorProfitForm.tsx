"use client";

import {
  Box,
  Chip,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";
import type { TCalculatorProfitForm } from "../types/calculator-profit.type";
import { EPageType } from "../types/calculator-profit.type";
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
  const [pageType, setPageType] = useState<EPageType>(EPageType.DEFAULT);

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
      <Tabs
        value={pageType}
        onChange={(_event, value: EPageType) => setPageType(value)}
        variant="scrollable"
        allowScrollButtonsMobile
      >
        <Tab
          label={t("calculator-profit.page_types.DEFAULT")}
          value={EPageType.DEFAULT}
        />
        <Tab
          label={t("calculator-profit.page_types.ENTERPRISE")}
          value={EPageType.ENTERPRISE}
        />
        <Tab
          label={t("calculator-profit.page_types.HOME")}
          value={EPageType.HOME}
        />
        <Tab
          label={t("calculator-profit.page_types.INCOME")}
          value={EPageType.INCOME}
        />
      </Tabs>

      <Typography>{t("calculator-profit.types.NETWORK")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          key={`min-max-network-min-${pageType}`}
          name={`min_max_range_power.${pageType}.NETWORK.min`}
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              value={field.value ?? ""}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.min_range_power")}
              error={!!errors?.min_max_range_power?.[pageType]?.NETWORK?.min}
              helperText={
                errors?.min_max_range_power?.[pageType]?.NETWORK?.min?.message
              }
              fullWidth
            />
          )}
        />
        <Controller
          key={`min-max-network-max-${pageType}`}
          name={`min_max_range_power.${pageType}.NETWORK.max`}
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              value={field.value ?? ""}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.max_range_power")}
              error={!!errors?.min_max_range_power?.[pageType]?.NETWORK?.max}
              helperText={
                errors?.min_max_range_power?.[pageType]?.NETWORK?.max?.message
              }
              fullWidth
            />
          )}
        />
      </Stack>
      <Typography>{t("calculator-profit.types.HYBRID")}</Typography>
      <Stack direction={"row"} gap={5}>
        <Controller
          key={`min-max-hybrid-min-${pageType}`}
          name={`min_max_range_power.${pageType}.HYBRID.min`}
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              value={field.value ?? ""}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.min_range_power")}
              error={!!errors?.min_max_range_power?.[pageType]?.HYBRID?.min}
              helperText={
                errors?.min_max_range_power?.[pageType]?.HYBRID?.min?.message
              }
              fullWidth
            />
          )}
        />
        <Controller
          key={`min-max-hybrid-max-${pageType}`}
          name={`min_max_range_power.${pageType}.HYBRID.max`}
          control={control}
          rules={{ required: t("common.required_field") }}
          render={({ field }) => (
            <NumericFormatSimple
              {...field}
              value={field.value ?? ""}
              suffix={` ${t("goods.measurements.kilowatts")}`}
              label={t("calculator-profit.fields.max_range_power")}
              error={!!errors?.min_max_range_power?.[pageType]?.HYBRID?.max}
              helperText={
                errors?.min_max_range_power?.[pageType]?.HYBRID?.max?.message
              }
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
    </Box>
  );
};
