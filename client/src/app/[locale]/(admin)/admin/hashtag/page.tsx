"use client";

import { Stack } from "@mui/material";
import { DataGrid, getGridStringOperators, GridColDef } from "@mui/x-data-grid";
import { DeleteButton, EditButton, List, useDataGrid } from "@refinedev/mui";
import { useTranslations } from "next-intl";

import { STATIC_HASHTAGS } from "@/src/features/hashtag/list-static-hashtag-tag";
import ProtectProvider from "@/src/providers/protect-provider";

export default function HashtagList() {
  const { dataGridProps } = useDataGrid();
  const t = useTranslations("refine");

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t("hashtag.fields.name"),
      flex: 1,
      minWidth: 250,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "tag",
      headerName: t("hashtag.fields.tag"),
      flex: 1,
      minWidth: 250,
      filterable: false,
    },
    {
      field: "actions",
      headerName: t("actions.actions"),
      renderCell: function render({ row }) {
        if (Object.values(STATIC_HASHTAGS).includes(row.tag)) {
          return null;
        }
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
    <ProtectProvider keyProvider="hashtag-list">
      <List>
        <DataGrid {...(dataGridProps as any)} columns={columns} autoHeight />
      </List>
    </ProtectProvider>
  );
}
