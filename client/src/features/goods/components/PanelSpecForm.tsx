import { FC } from "react";

import {
  EPanelSpecType,
  SpecFormProps,
  TPanelSpecs,
} from "@/src/features/goods";
import { Chip, Divider, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

import { NumericFormatSimple } from "@/src/shared/ui/number-input/NumericFormatSimple";

export const PanelSpecForm: FC<SpecFormProps<TPanelSpecs>> = ({
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
            {Object.values(EPanelSpecType).map((type: EPanelSpecType) => (
              <MenuItem key={type} value={type}>
                {t(`goods.specs.panelType.${type}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip
          label={
            t("goods.fields.specs.power") + ` (${t("goods.measurements.watt")})`
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
            suffix={` ${t("goods.measurements.watt")}`}
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
