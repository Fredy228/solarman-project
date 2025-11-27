import React from "react";
import { Authenticated } from "@refinedev/core";
import { ADMIN_AUTH_ROUTES } from "../configs/routes.config";
import { Typography } from "@mui/material";

export default function ProtectProvider({
  children,
  keyProvider,
}: {
  children: React.ReactNode;
  keyProvider: string;
}) {
  return (
    <Authenticated
      key={keyProvider}
      redirectOnFail={ADMIN_AUTH_ROUTES.login}
      loading={<Typography>Loading...</Typography>}
    >
      {children}
    </Authenticated>
  );
}
