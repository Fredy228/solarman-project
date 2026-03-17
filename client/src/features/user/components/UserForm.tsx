"use client";

import {
  Box,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { type FC } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import NumericFormatPhone from "@/src/shared/ui/number-input/NumericFormatPhone";
import { EUserRole } from "../types/user-role";
import type { IUserForm } from "../types/user.interface";

type UserFormProps = {
  control: Control<IUserForm>;
  errors: FieldErrors<IUserForm>;
  registerAction: UseFormRegister<IUserForm>;
};

export const UserForm: FC<UserFormProps> = ({
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
        <Chip label={t("user.fields.name") + " *"} size="small" />
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
        label={t("user.fields.name")}
        name="name"
      />

      <Divider textAlign="left">
        <Chip label={t("user.fields.email") + " *"} size="small" />
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
        label={t("user.fields.email")}
        name="email"
      />

      <Divider textAlign="left">
        <Chip label={t("user.fields.phone")} size="small" />
      </Divider>
      <Controller
        name="phone"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <NumericFormatPhone
            {...field}
            value={field.value ?? ""}
            label={t("user.fields.phone")}
            error={!!errors?.phone}
            helperText={errors?.phone?.message}
            fullWidth
          />
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("user.fields.password")} size="small" />
      </Divider>
      <TextField
        {...registerAction("password")}
        error={!!errors?.password}
        helperText={errors?.password?.message}
        margin="normal"
        fullWidth
        type="password"
        slotProps={{ inputLabel: { shrink: true } }}
        label={t("user.fields.password")}
        name="password"
      />

      <Divider textAlign="left">
        <Chip label={t("user.fields.role") + " *"} size="small" />
      </Divider>
      <Controller
        name="role"
        control={control}
        defaultValue={null}
        rules={{ required: t("common.required_field") }}
        render={({ field }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            select
            fullWidth
            label={t("user.fields.role")}
            error={!!errors.role}
            helperText={errors.role?.message}
            slotProps={{
              inputLabel: { shrink: true },
              select: { displayEmpty: true },
            }}
          >
            <MenuItem key={"null"} value={""}>
              {t("common.noSelect")}
            </MenuItem>
            {Object.values(EUserRole).map((role: EUserRole) => (
              <MenuItem key={role} value={role}>
                {t(`user.role.${role}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Divider textAlign="left">
        <Chip label={t("user.fields.isBlocked")} size="small" />
      </Divider>
      <Controller
        name="isBlocked"
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={t("user.fields.isBlocked")}
          />
        )}
      />
    </Box>
  );
};
