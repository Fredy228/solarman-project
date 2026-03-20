"use client";

import { Stack } from "@mui/material";
import {
  DataGrid,
  getGridSingleSelectOperators,
  GridColDef,
} from "@mui/x-data-grid";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { PagesMap } from "@/src/features/order/data/pages-map";
import { EOrderType } from "@/src/features/order/types/order-type.enum";
import { ELocale } from "@/src/i18n/routing";
import ProtectProvider from "@/src/providers/protect-provider";
import {
  DataGridMultiFilter,
  type MultiFilterFieldConfig,
  type MultiFilterLabels,
  type MultiFilterOperatorOption,
} from "@/src/shared/ui/data-grid/multi-filter";

export default function OrderList() {
  const { dataGridProps, filters, setFilters } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");

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
        label: t("order.fields.email"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("order.fields.email"),
      },
      {
        field: "name",
        label: t("order.fields.name"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("order.fields.name"),
      },
      {
        field: "phone",
        label: t("order.fields.phone"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("order.fields.phone"),
      },
      {
        field: "notes",
        label: t("order.fields.notes"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("order.fields.notes"),
      },
      {
        field: "lang",
        label: t("order.fields.lang"),
        type: "select",
        operators: selectOperators,
        options: Object.values(ELocale).map((lang) => ({
          value: lang.toUpperCase(),
          label: lang.toUpperCase(),
        })),
      },
      {
        field: "type",
        label: t("order.fields.type"),
        type: "select",
        operators: selectOperators,
        options: Object.values(EOrderType).map((type) => ({
          value: type,
          label: t(`order.type.${type}`),
        })),
      },
      {
        field: "createdAt",
        label: t("order.fields.createdAt"),
        type: "date",
        operators: dateOperators,
      },
      {
        field: "updatedAt",
        label: t("order.fields.updatedAt"),
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
            <ShowButton hideText recordItemId={row.id} />
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
      headerName: t("order.fields.email"),
      flex: 1,
      minWidth: 200,
      filterable: false,
      sortable: true,
    },
    {
      field: "name",
      headerName: t("order.fields.name"),
      flex: 1,
      minWidth: 150,
      filterable: false,
      sortable: true,
    },
    {
      field: "phone",
      headerName: t("order.fields.phone"),
      flex: 1,
      minWidth: 150,
      filterable: false,
      sortable: true,
      valueFormatter: (value: string) =>
        value
          ? "+" + Number(value).toLocaleString("uk-UA", { useGrouping: true })
          : "",
    },
    {
      field: "notes",
      headerName: t("order.fields.notes"),
      flex: 1,
      minWidth: 200,
      filterable: false,
      sortable: false,
    },
    {
      field: "lang",
      headerName: t("order.fields.lang"),
      width: 100,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(ELocale).map((lang) => ({
        value: lang,
        label: lang.toUpperCase(),
      })),
      valueFormatter: (value: string) => value?.toUpperCase(),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
    },
    {
      field: "type",
      headerName: t("order.fields.type"),
      width: 170,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EOrderType).map((type) => ({
        value: type,
        label: t(`order.type.${type}`),
      })),
      valueFormatter: (value: string) => value && t(`order.type.${value}`),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
    },
    {
      field: "pageId",
      headerName: t("order.fields.pageId"),
      width: 170,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueFormatter: (value: number) => value && PagesMap.get(value),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
    },
    {
      field: "createdAt",
      headerName: t("order.fields.createdAt"),
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
      headerName: t("order.fields.updatedAt"),
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
    <ProtectProvider keyProvider="order-list">
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
