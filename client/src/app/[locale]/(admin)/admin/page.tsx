"use client";

import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import ProtectProvider from "@/src/providers/protect-provider";

export default function DashboardPage() {
  const t = useTranslations("refine.dashboard");

  return (
    <ProtectProvider keyProvider="dashboard">
      <div style={{ padding: 20 }}>
        <Typography variant="h4">{t("title")}</Typography>
      </div>
    </ProtectProvider>
  );
}
