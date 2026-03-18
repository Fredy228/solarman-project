"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useNotification } from "@refinedev/core";
import { isAxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { ADMIN_AUTH_ROUTES } from "@/src/configs/routes.config";
import { authApi } from "@/src/features/auth";
import { useRouter } from "@/src/i18n/navigation";

type ForgotPasswordForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const t = useTranslations("refine");
  const router = useRouter();
  const { open: notify } = useNotification();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      notify?.({
        type: "success",
        message: t("forgot-password.codeSent"),
      });
      router.push(
        `${ADMIN_AUTH_ROUTES.resetPassword}?email=${encodeURIComponent(data.email)}`,
      );
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
            {t("forgot-password.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {t("forgot-password.subtitle")}
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("forgot-password.invalidEmail"),
                },
              })}
              label={t("pages.login.fields.email")}
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              autoFocus
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
                t("forgot-password.submit")
              )}
            </Button>

            <Button
              variant="text"
              size="small"
              onClick={() => router.push(ADMIN_AUTH_ROUTES.login)}
            >
              {t("forgot-password.backToLogin")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
