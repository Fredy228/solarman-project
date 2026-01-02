import { FC } from "react";

import {
  SpecFormProps,
  type TReadyMadeSolutionSpecs,
} from "@/src/features/goods";
import { Chip, Divider } from "@mui/material";
import { Controller } from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";

export const ReadyMadeSolutionSpecForm: FC<
  SpecFormProps<TReadyMadeSolutionSpecs>
> = ({ errors, control, defaultValues, t }) => {
  return (
    <>
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
    </>
  );
};
