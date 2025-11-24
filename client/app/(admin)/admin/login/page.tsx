"use client";

import { Typography } from "@mui/material";
import { AuthPage } from "@refinedev/mui";

export default function Login() {
  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={false}
      rememberMe={false}
      title={
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Адмінка SolarMan
        </Typography>
      }
    />
  );
}
