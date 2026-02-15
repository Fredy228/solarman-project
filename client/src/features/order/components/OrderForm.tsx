"use client";

import { Box, Chip, Divider, MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import NumericFormatPhone from "@/src/shared/ui/number-input/NumericFormatPhone";
import { EOrderType } from "../types/order-type.enum";
import type { IOrderForm } from "../types/order.type";

type OrderFormProps = {
  control: Control<IOrderForm>;
  errors: FieldErrors<IOrderForm>;
  registerAction: UseFormRegister<IOrderForm>;
};

export const OrderForm: FC<OrderFormProps> = ({
  control,
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
        <Chip label={t("order.fields.email")} size="small" />
      </Divider>
      <TextField
        {...registerAction("email", {
          required: t("common.required_field"),
        })}
        error={!!errors?.email}
        helperText={errors?.email?.message}
        margin="normal"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("order.fields.email")}
        name="email"
      />

      <Divider textAlign="left">
        <Chip label={t("order.fields.name") + " *"} size="small" />
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
        label={t("order.fields.name")}
        name="name"
      />

      <Divider textAlign="left">
        <Chip label={t("order.fields.phone") + " *"} size="small" />
      </Divider>
      <Controller
        name="phone"
        control={control}
        defaultValue=""
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <NumericFormatPhone
            {...field}
            label={t("order.fields.phone")}
            error={!!errors?.phone}
            helperText={errors?.phone?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("order.fields.type") + " *"} size="small" />
      </Divider>
      <Controller
        name="type"
        control={control}
        defaultValue={null}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            select
            fullWidth
            label={t("order.fields.type")}
            error={!!errors.type}
            helperText={errors.type?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem key={"null"} value={""}>
              {t(`common.noSelect`)}
            </MenuItem>
            {Object.values(EOrderType).map((badge: EOrderType) => (
              <MenuItem key={badge} value={badge}>
                {t(`order.type.${badge}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("order.fields.notes")} size="small" />
      </Divider>
      <TextField
        {...registerAction("notes")}
        error={!!errors?.notes}
        helperText={errors?.notes?.message}
        margin="normal"
        fullWidth
        multiline
        rows={4}
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("order.fields.notes")}
        name="notes"
      />
    </Box>
  );
};
