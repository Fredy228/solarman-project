"use client";

import { Box, Chip, Stack } from "@mui/material";
import {
  DataGrid,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { useNotification, useUpdate } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import {
  DataGridMultiFilter,
  type MultiFilterFieldConfig,
  type MultiFilterLabels,
  type MultiFilterOperatorOption,
} from "@/src/shared/ui/data-grid/multi-filter";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { revalidateCache } from "@/src/libs/revalidateCache";
import ProtectProvider from "@/src/providers/protect-provider";
import { productStatusConfig } from "@/src/shared/configs/product-status.config";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EProductStatus } from "@/src/shared/types/product-status.enum";

export default function PortfolioList() {
  const { dataGridProps, filters, setFilters } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");
  const locale = useLocale();
  const { mutate: updatePortfolio } = useUpdate();
  const { open } = useNotification();

  const filterOperators = useMemo(
    () => ({
      contains: t("filters.operators.contains"),
      equals: t("filters.operators.equals"),
      gte: t("filters.operators.gte"),
      lte: t("filters.operators.lte"),
    }),
    [t],
  );

  const dateParser = useCallback(
    (value: string | number | boolean | null | undefined) => {
      if (!value) return undefined;
      const d = new Date(String(value));
      if (Number.isNaN(d.getTime())) return undefined;
      return d.toISOString();
    },
    [],
  );

  const filterFields = useMemo<MultiFilterFieldConfig[]>(() => {
    const { contains, equals, gte, lte } = filterOperators;
    const selectOps: MultiFilterOperatorOption[] = [
      { value: "eq", label: equals },
    ];
    const dateOps: MultiFilterOperatorOption[] = [
      { value: "eq", label: equals },
      { value: "gte", label: gte },
      { value: "lte", label: lte },
    ];

    return [
      {
        field: "title",
        label: t("portfolio.fields.title"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("portfolio.fields.title"),
      },
      {
        field: "date",
        label: t("portfolio.fields.date"),
        type: "date",
        operators: dateOps,
        valueParser: dateParser,
      },
      {
        field: "status",
        label: t("portfolio.fields.status"),
        type: "select",
        operators: selectOps,
        options: Object.values(EProductStatus).map((status) => ({
          value: status,
          label: t(`portfolio.status.${status}`),
        })),
      },
    ];
  }, [filterOperators, t, dateParser]);

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

  const handleProcessRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel,
  ) => {
    if (newRow.status !== oldRow.status) {
      try {
        await new Promise((resolve, reject) => {
          updatePortfolio(
            {
              resource: "portfolio",
              id: newRow.id,
              values: {
                status: newRow.status,
              },
            },
            {
              onSuccess: () => resolve(true),
              onError: (error) => reject(error),
            },
          );
        });

        await revalidateCache([
          CACHE_TAGS.portfolioId(newRow.tag),
          CACHE_TAGS.portfolioList,
          CACHE_TAGS.hashtags,
        ]);

        return newRow;
      } catch (error) {
        console.error("Failed to update status:", error);
        return oldRow;
      }
    }

    return newRow;
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.error("Error updating row:", error);
    open?.({
      type: "error",
      message: t("notifications.editError"),
    });
  };

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
      field: "cover",
      headerName: t("portfolio.fields.cover"),
      renderCell: function render({ row }) {
        return row.cover ? (
          <Box
            component="img"
            src={row.cover}
            alt={row.title}
            sx={{
              width: 170,
              height: 120,
              padding: "10px 0",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : null;
      },
      align: "center",
      headerAlign: "center",
      width: 180,
      sortable: false,
      filterable: false,
    },
    {
      field: "title",
      headerName: t("portfolio.fields.title"),
      flex: 1,
      minWidth: 250,
      valueGetter: (value) => value[locale as keyof LocalizedContent],
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "date",
      headerName: t("portfolio.fields.date"),
      type: "date",
      width: 150,
      align: "center",
      valueFormatter: (value) => value && dayjs(value).format("DD.MM.YYYY"),
      valueGetter: (value) => value && new Date(value),
      filterOperators: getGridDateOperators().filter((operator) =>
        ["is", "onOrAfter", "onOrBefore"].includes(operator.value),
      ),
    },
    {
      field: "status",
      headerName: t("portfolio.fields.status"),
      width: 170,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EProductStatus).map((status) => ({
        value: status,
        label: t(`portfolio.status.${status}`),
      })),
      valueFormatter: (value: string) => t(`portfolio.status.${value}`),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
      renderCell: (params) => {
        const config = productStatusConfig[params.value as EProductStatus];

        if (!config) {
          return params.value;
        }

        return (
          <Chip
            label={t(`portfolio.status.${params.value}`)}
            color={config.color}
            icon={config.icon}
            variant="filled"
            size="small"
            sx={{ minWidth: "100px", justifyContent: "flex-start" }}
          />
        );
      },
    },
  ];

  return (
    <ProtectProvider keyProvider="portfolio-list">
      <List>
        <Stack spacing={2}>
          <DataGridMultiFilter
            fields={filterFields}
            filters={filters}
            labels={filterLabels}
            onApply={(nextFilters) => setFilters(nextFilters)}
            isLoading={(dataGridProps as any).loading}
          />
          <DataGrid
            {...(dataGridProps as any)}
            filterModel={{ items: [] }}
            columns={columns}
            autoHeight
            rowHeight={120}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
        </Stack>
      </List>
    </ProtectProvider>
  );
}
