"use client";

import { Stack } from "@mui/material";
import {
  DataGrid,
  getGridSingleSelectOperators,
  GridColDef,
} from "@mui/x-data-grid";
import { useGetIdentity } from "@refinedev/core";
import { DeleteButton, EditButton, List, useDataGrid } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { TUserAuth } from "@/src/features/user";
import { EUserRole } from "@/src/features/user/types/user-role";
import ProtectProvider from "@/src/providers/protect-provider";
import {
  DataGridMultiFilter,
  type MultiFilterFieldConfig,
  type MultiFilterLabels,
  type MultiFilterOperatorOption,
} from "@/src/shared/ui/data-grid/multi-filter";

export default function UserList() {
  const { dataGridProps, filters, setFilters } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");
  const { data: identity } = useGetIdentity<TUserAuth>();

  const filteredRows = useMemo(() => {
    const rows =
      (dataGridProps as unknown as { rows: { id: string }[] }).rows ?? [];
    return rows.filter((row) => row.id !== identity?.id);
  }, [dataGridProps, identity?.id]);

  const filterOperators = useMemo(
    () => ({
      contains: t("filters.operators.contains"),
      equals: t("filters.operators.equals"),
      gte: t("filters.operators.gte"),
      lte: t("filters.operators.lte"),
    }),
    [t],
  );

  const filterFields = useMemo<MultiFilterFieldConfig[]>(() => {
    const { contains, equals, gte, lte } = filterOperators;
    const selectOperators: MultiFilterOperatorOption[] = [
      { value: "eq", label: equals },
    ];
    const dateOperators: MultiFilterOperatorOption[] = [
      { value: "gte", label: gte },
      { value: "lte", label: lte },
    ];

    return [
      {
        field: "email",
        label: t("user.fields.email"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("user.fields.email"),
      },
      {
        field: "name",
        label: t("user.fields.name"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("user.fields.name"),
      },
      {
        field: "phone",
        label: t("user.fields.phone"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("user.fields.phone"),
      },
      {
        field: "role",
        label: t("user.fields.role"),
        type: "select",
        operators: selectOperators,
        options: Object.values(EUserRole).map((role) => ({
          value: role,
          label: t(`user.role.${role}`),
        })),
      },
      {
        field: "isBlocked",
        label: t("user.fields.isBlocked"),
        type: "select",
        operators: selectOperators,
        options: [
          { value: "true", label: t("common.yes") },
          { value: "false", label: t("common.no") },
        ],
      },
      {
        field: "createdAt",
        label: t("user.fields.createdAt"),
        type: "date",
        operators: dateOperators,
      },
      {
        field: "updatedAt",
        label: t("user.fields.updatedAt"),
        type: "date",
        operators: dateOperators,
      },
    ];
  }, [filterOperators, t]);

  const filterLabels = useMemo<MultiFilterLabels>(
    () => ({
      title: t("filters.title"),
      add: t("filters.add"),
      apply: t("filters.apply"),
      reset: t("filters.reset"),
      empty: t("filters.empty"),
      fieldLabel: t("filters.field"),
      operatorLabel: t("filters.operator"),
    }),
    [t],
  );

  const columns: GridColDef[] = [
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
      width: 150,
      sortable: false,
      filterable: false,
    },
    {
      field: "email",
      headerName: t("user.fields.email"),
      flex: 1,
      minWidth: 200,
      filterable: false,
      sortable: true,
    },
    {
      field: "name",
      headerName: t("user.fields.name"),
      flex: 1,
      minWidth: 150,
      filterable: false,
      sortable: true,
    },
    {
      field: "phone",
      headerName: t("user.fields.phone"),
      flex: 1,
      minWidth: 150,
      filterable: false,
      sortable: true,
    },
    {
      field: "role",
      headerName: t("user.fields.role"),
      width: 150,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EUserRole).map((role) => ({
        value: role,
        label: t(`user.role.${role}`),
      })),
      valueFormatter: (value: string) =>
        value ? t(`user.role.${value as EUserRole}`) : "",
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
    },
    {
      field: "isBlocked",
      headerName: t("user.fields.isBlocked"),
      width: 130,
      align: "center",
      headerAlign: "center",
      type: "boolean",
      filterable: false,
      sortable: true,
    },
    {
      field: "createdAt",
      headerName: t("user.fields.createdAt"),
      width: 180,
      align: "center",
      headerAlign: "center",
      type: "dateTime",
      valueFormatter: (value: string) =>
        value ? new Date(value).toLocaleString("ru-RU") : "",
      filterable: false,
      sortable: true,
    },
    {
      field: "updatedAt",
      headerName: t("user.fields.updatedAt"),
      width: 180,
      align: "center",
      headerAlign: "center",
      type: "dateTime",
      valueFormatter: (value: string) =>
        value ? new Date(value).toLocaleString("ru-RU") : "",
      filterable: false,
      sortable: true,
    },
  ];

  return (
    <ProtectProvider keyProvider="user-list">
      <List>
        <Stack spacing={2}>
          <DataGridMultiFilter
            fields={filterFields}
            filters={filters}
            labels={filterLabels}
            onApply={(nextFilters) => setFilters(nextFilters)}
            isLoading={
              (dataGridProps as unknown as { loading: boolean }).loading
            }
          />
          <DataGrid
            {...(dataGridProps as unknown as Record<string, unknown>)}
            rows={filteredRows}
            filterModel={{ items: [] }}
            columns={columns}
            autoHeight
            disableColumnFilter
          />
        </Stack>
      </List>
    </ProtectProvider>
  );
}
