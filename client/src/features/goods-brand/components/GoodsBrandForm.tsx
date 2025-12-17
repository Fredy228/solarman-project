"use client";

import { Box, Chip, Divider, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { type FC } from "react";
import { useTranslations } from "next-intl";

import { IGoodsBrandForm } from "../types/goods-brand.interface";

type GoodsBrandFormProps = {
  errors: FieldErrors<IGoodsBrandForm>;
  registerAction: UseFormRegister<IGoodsBrandForm>;
};

export const GoodsBrandForm: FC<GoodsBrandFormProps> = ({
  errors,
  registerAction,
}) => {
  const t = useTranslations("refine");

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      autoComplete="off"
    >
      <Divider textAlign="left">
        <Chip label={t("goods-brand.fields.name")} size="small" />
      </Divider>
      <TextField
        {...registerAction("name", {
          required: t("common.required_field"),
        })}
        error={!!errors?.name}
        helperText={errors?.name?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("goods-brand.fields.name")}
        name="name"
      />
    </Box>
  );
};
