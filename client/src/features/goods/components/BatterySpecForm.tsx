import { FC } from "react";

import {
  EBatterySpecType,
  SpecFormProps,
  TBatterySpecs,
} from "@/src/features/goods";
import { Chip, Divider, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";

export const BatterySpecForm: FC<SpecFormProps<TBatterySpecs>> = ({
  errors,
  control,
  t,
  defaultValues,
}) => {
  return (
    <>
      <Divider textAlign="left">
        <Chip label={t("goods.fields.specs.type")} size="small" />
      </Divider>
      <Controller
        name="specs.type"
        control={control}
        defaultValue={defaultValues?.type}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            value={field.value ?? ""}
            fullWidth
            label={t("goods.fields.specs.type")}
            error={!!errors.specs}
            helperText={errors.specs?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value={""}>{t(`common.noSelect`)}</MenuItem>
            {Object.values(EBatterySpecType).map((type: EBatterySpecType) => (
              <MenuItem key={type} value={type}>
                {t(`goods.specs.batteryType.${type}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip
          label={
            t("goods.fields.specs.capacity") +
            ` (${t("goods.measurements.kilowattHour")})`
          }
          size="small"
        />
      </Divider>
      <Controller
        name="specs.capacity"
        control={control}
        defaultValue={defaultValues?.capacity}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            suffix={` ${t("goods.measurements.kilowattHour")}`}
            label={t("goods.fields.specs.capacity")}
            error={!!errors?.specs}
            helperText={errors?.specs?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip
          label={
            t("goods.fields.specs.voltage") +
            ` (${t("goods.measurements.volt")})`
          }
          size="small"
        />
      </Divider>
      <Controller
        name="specs.voltage"
        control={control}
        defaultValue={defaultValues?.voltage}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            suffix={` ${t("goods.measurements.volt")}`}
            label={t("goods.fields.specs.voltage")}
            error={!!errors?.specs}
            helperText={errors?.specs?.message}
            fullWidth
          />
        )}
      />
    </>
  );
};
