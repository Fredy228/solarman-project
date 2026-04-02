import React from "react";
import { Authenticated } from "@refinedev/core";
import { ADMIN_AUTH_ROUTES } from "../configs/routes.config";
import { Typography } from "@mui/material";
import { useLocale } from "next-intl";
import { buildLocalizedPath } from "../shared/utils/localized-path";

export default function ProtectProvider({
  children,
  keyProvider,
}: {
  children: React.ReactNode;
  keyProvider: string;
}) {
  const locale = useLocale();

  return (
    <Authenticated
      key={keyProvider}
      redirectOnFail={buildLocalizedPath(locale, ADMIN_AUTH_ROUTES.login)}
      loading={<Typography>Loading...</Typography>}
    >
      {children}
    </Authenticated>
  );
}
