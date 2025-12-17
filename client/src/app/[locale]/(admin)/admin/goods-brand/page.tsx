"use client";

import { DeleteButton, EditButton, List, useDataGrid } from "@refinedev/mui";
import { DataGrid, getGridStringOperators, GridColDef } from "@mui/x-data-grid";
import { Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import ProtectProvider from "@/src/providers/protect-provider";

export default function PortfolioList() {
  const { dataGridProps } = useDataGrid();
  const t = useTranslations("refine");

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("goods-brand.fields.name"),
      flex: 1,
      minWidth: 250,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "actions",
      headerName: t("actions.actions"),
      renderCell: function render({ row }) {
        return (
          <Stack
            direction="row"
            spacing={0}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <EditButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </Stack>
        );
      },
      align: "center",
      headerAlign: "center",
      width: 120,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <ProtectProvider keyProvider="goods-brand-list">
      <List>
        <DataGrid {...(dataGridProps as any)} columns={columns} autoHeight />
      </List>
    </ProtectProvider>
  );
}
