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
import { useState } from "react";
import { useForm } from "react-hook-form";

import { authApi } from "@/src/features/auth";
import ProtectProvider from "@/src/providers/protect-provider";

type ChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

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
    <Box sx={{ maxWidth: 480, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" mb={3}>
        {t("change-password.title")}
      </Typography>

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
    </Box>
  );
}

export default function ChangePasswordPage() {
  return (
    <ProtectProvider keyProvider="change-password">
      <ChangePasswordContent />
    </ProtectProvider>
  );
}
