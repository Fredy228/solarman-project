"use client";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useGetIdentity, useNotification } from "@refinedev/core";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { authApi } from "@/src/features/auth";
import { TUserAuth, userApi } from "@/src/features/user";
import ProtectProvider from "@/src/providers/protect-provider";
import NumericFormatPhone from "@/src/shared/ui/number-input/NumericFormatPhone";

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type EditProfileForm = {
  name: string;
  email: string;
  phone: string;
};

function ProfileContent() {
  const t = useTranslations("refine");
  const { open: notify } = useNotification();
  const { data: identity, refetch: refetchIdentity } =
    useGetIdentity<TUserAuth>();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (identity) {
      reset({
        name: identity.name ?? "",
        email: identity.email ?? "",
        phone: identity.phone ? identity.phone.replace(/^380/, "") : "",
      });
    }
  }, [identity, reset]);

  const onSubmit = async (data: EditProfileForm) => {
    if (!identity?.id) return;
    setLoading(true);
    try {
      const payload: Partial<EditProfileForm> = {};
      if (data.name) payload.name = data.name;
      if (data.email) payload.email = data.email;
      const phoneDigits = data.phone.replace(/\D/g, "");
      if (phoneDigits) payload.phone = "380" + phoneDigits.slice(-9);
      await userApi.updateProfile(identity.id, payload);
      await authApi.refresh();
      await refetchIdentity();
      notify?.({
        type: "success",
        message: t("edit-profile.success"),
      });
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : t("notifications.error");
      notify?.({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <TextField
            {...register("name", { required: t("common.required_field") })}
            label={t("user.fields.name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            {...register("email", {
              required: t("common.required_field"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("edit-profile.errors.invalidEmail"),
              },
            })}
            label={t("user.fields.email")}
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NumericFormatPhone
                {...field}
                value={field.value ?? ""}
                label={t("user.fields.phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !isDirty}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {t("buttons.save")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function ChangePasswordContent() {
  const t = useTranslations("refine");
  const { open: notify } = useNotification();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      notify?.({
        type: "success",
        message: t("change-password.success"),
      });
      reset();
    } catch (error) {
      const message =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : t("notifications.error");
      notify?.({
        type: "error",
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          autoComplete="off"
        >
          <TextField
            {...register("currentPassword", {
              required: t("common.required_field"),
            })}
            label={t("change-password.fields.currentPassword")}
            type="text"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrent((v) => !v)}
                      edge="end"
                    >
                      {showCurrent ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                autoComplete: "new-password",
                style: {
                  WebkitTextSecurity: showCurrent ? "none" : "disc",
                } as React.CSSProperties,
              },
            }}
          />

          <TextField
            {...register("newPassword", {
              required: t("common.required_field"),
              minLength: {
                value: 8,
                message: "Мінімум 8 символів",
              },
              validate: {
                uppercase: (v) => /[A-Z]/.test(v) || "Необхідна велика літера",
                number: (v) => /[0-9]/.test(v) || "Необхідна цифра",
                special: (v) =>
                  /[\W_]/.test(v) || "Необхідний спеціальний символ",
              },
            })}
            label={t("change-password.fields.newPassword")}
            type="text"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNew((v) => !v)}
                      edge="end"
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                autoComplete: "new-password",
                style: {
                  WebkitTextSecurity: showNew ? "none" : "disc",
                } as React.CSSProperties,
              },
            }}
          />

          <TextField
            {...register("confirmPassword", {
              required: t("common.required_field"),
              validate: (v) =>
                v === newPassword ||
                t("change-password.errors.passwordsMismatch"),
            })}
            label={t("change-password.fields.confirmPassword")}
            type="text"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
              htmlInput: {
                autoComplete: "new-password",
                style: {
                  WebkitTextSecurity: showConfirm ? "none" : "disc",
                } as React.CSSProperties,
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {t("buttons.save")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function AccountSettingsContent() {
  const t = useTranslations("refine");
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" mb={3}>
        {t("edit-profile.pageTitle")}
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3 }}
        variant="fullWidth"
      >
        <Tab label={t("edit-profile.title")} />
        <Tab label={t("change-password.title")} />
      </Tabs>

      {tab === 0 && <ProfileContent />}
      {tab === 1 && <ChangePasswordContent />}
    </Box>
  );
}

export default function ChangePasswordPage() {
  return (
    <ProtectProvider keyProvider="change-password">
      <AccountSettingsContent />
    </ProtectProvider>
  );
}
