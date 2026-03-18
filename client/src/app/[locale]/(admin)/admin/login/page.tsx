"use client";

import { Typography } from "@mui/material";
import { AuthPage } from "@refinedev/mui";
import { useLocale } from "next-intl";

import { ADMIN_AUTH_ROUTES } from "@/src/configs/routes.config";

export default function Login() {
  const locale = useLocale();

  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={
        <a
          href={`/${locale}${ADMIN_AUTH_ROUTES.forgotPassword}`}
          style={{ fontSize: "0.85rem" }}
        >
          Забули пароль?
        </a>
      }
      rememberMe={false}
      title={
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Адмінка SolarMan
        </Typography>
      }
    />
  );
}
