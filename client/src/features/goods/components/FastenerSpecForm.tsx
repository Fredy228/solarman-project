import { FC } from "react";

import {
  EFastenerSpecType,
  EMaterialType,
  SpecFormProps,
  TFastenerSpecs,
} from "@/src/features/goods";
import { Chip, Divider, MenuItem, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FastenerSpecForm: FC<SpecFormProps<TFastenerSpecs>> = ({
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
            {Object.values(EFastenerSpecType).map((type: EFastenerSpecType) => (
              <MenuItem key={type} value={type}>
                {t(`goods.specs.fastenerType.${type}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("goods.fields.specs.material")} size="small" />
      </Divider>
      <Controller
        name="specs.material"
        control={control}
        defaultValue={defaultValues?.material}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            select
            value={field.value ?? ""}
            fullWidth
            label={t("goods.fields.specs.material")}
            error={!!errors.specs}
            helperText={errors.specs?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem value={""}>{t(`common.noSelect`)}</MenuItem>
            {Object.values(EMaterialType).map((material: EMaterialType) => (
              <MenuItem key={material} value={material}>
                {t(`goods.specs.fastenerType.${material}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </>
  );
};
