"use client";

import { Typography } from "@mui/material";

import ProtectProvider from "@/src/providers/protect-provider";

export default function DashboardPage() {
  return (
    <ProtectProvider keyProvider="dashboard">
      <div style={{ padding: 20 }}>
        <Typography variant="h4">Добро пожаловать в Админку</Typography>
      </div>
    </ProtectProvider>
  );
}
