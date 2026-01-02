import { FC } from "react";

import {
  EInvertorSpecType,
  SpecFormProps,
  TInvertorSpecs,
} from "@/src/features/goods";
import { Chip, Divider, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";

export const InvertorSpecForm: FC<SpecFormProps<TInvertorSpecs>> = ({
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
            {Object.values(EInvertorSpecType).map((type: EInvertorSpecType) => (
              <MenuItem key={type} value={type}>
                {t(`goods.specs.invertorType.${type}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip
          label={
            t("goods.fields.specs.power") +
            ` (${t("goods.measurements.kilowatts")})`
          }
          size="small"
        />
      </Divider>
      <Controller
        name="specs.power"
        control={control}
        defaultValue={defaultValues?.power}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            suffix={` ${t("goods.measurements.kilowatts")}`}
            label={t("goods.fields.specs.power")}
            error={!!errors?.specs}
            helperText={errors?.specs?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.specs.phase")} size="small" />
      </Divider>
      <Controller
        name="specs.phase"
        control={control}
        defaultValue={defaultValues?.phase}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatSimple
            {...field}
            label={t("goods.fields.specs.phase")}
            error={!!errors?.specs}
            helperText={errors?.specs?.message}
            fullWidth
          />
        )}
      />
    </>
  );
};
