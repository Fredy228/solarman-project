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
  TextField,
  Typography,
} from "@mui/material";
import { useNotification } from "@refinedev/core";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ADMIN_AUTH_ROUTES } from "@/src/configs/routes.config";
import { authApi } from "@/src/features/auth";
import { useRouter } from "@/src/i18n/navigation";

type ResetPasswordForm = {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const t = useTranslations("refine");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: notify } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emailFromQuery = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: { email: emailFromQuery },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    try {
      await authApi.resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });
      notify?.({
        type: "success",
        message: t("reset-password.success"),
      });
      router.push(ADMIN_AUTH_ROUTES.login);
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
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" mb={1} fontWeight="bold">
            {t("reset-password.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {t("reset-password.subtitle")}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            autoComplete="off"
          >
            <TextField
              {...register("email", {
                required: t("common.required_field"),
              })}
              label={t("pages.login.fields.email")}
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              {...register("code", {
                required: t("common.required_field"),
                minLength: {
                  value: 6,
                  message: t("reset-password.invalidCode"),
                },
                maxLength: {
                  value: 6,
                  message: t("reset-password.invalidCode"),
                },
                pattern: {
                  value: /^\d{6}$/,
                  message: t("reset-password.invalidCode"),
                },
              })}
              label={t("reset-password.fields.code")}
              type="text"
              inputMode="numeric"
              error={!!errors.code}
              helperText={errors.code?.message}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              {...register("newPassword", {
                required: t("common.required_field"),
                minLength: { value: 8, message: "Мінімум 8 символів" },
                validate: {
                  uppercase: (v) =>
                    /[A-Z]/.test(v) || "Необхідна велика літера",
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
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  autoComplete: "new-password",
                  style: {
                    WebkitTextSecurity: showPassword ? "none" : "disc",
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
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("reset-password.submit")
              )}
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={() => router.push(ADMIN_AUTH_ROUTES.forgotPassword)}
            >
              {t("reset-password.backToForgot")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
