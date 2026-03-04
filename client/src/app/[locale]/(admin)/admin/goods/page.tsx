"use client";

import { PUBLIC_ROUTES } from "@/src/configs/routes.config";
import { Link } from "@/src/i18n/navigation";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Chip, IconButton, Stack } from "@mui/material";
import {
  DataGrid,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { useNotification, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List, useDataGrid } from "@refinedev/mui";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { EBadgeType } from "@/src/features/goods/types/goods-badge-type.enum";
import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import { revalidateCache } from "@/src/libs/revalidateCache";
import ProtectProvider from "@/src/providers/protect-provider";
import { goodsBadgeConfig } from "@/src/shared/configs/goods-badge.config";
import { goodsCategoryConfig } from "@/src/shared/configs/goods-category.config";
import { productStatusConfig } from "@/src/shared/configs/product-status.config";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import {
  DataGridMultiFilter,
  type MultiFilterFieldConfig,
  type MultiFilterLabels,
  type MultiFilterOperatorOption,
} from "@/src/shared/ui/data-grid/multi-filter";

export default function GoodsList() {
  const { dataGridProps, filters, setFilters } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");
  const locale = useLocale();
  const { mutate: updateGoods } = useUpdate();
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

  const priceParser = useCallback(
    (value: string | number | boolean | null | undefined) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }
      const numericValue = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(numericValue)) {
        return undefined;
      }
      return Math.round(numericValue * 100);
    },
    [],
  );

  const filterFields = useMemo<MultiFilterFieldConfig[]>(() => {
    const { contains, equals, gte, lte } = filterOperators;
    const selectOperators: MultiFilterOperatorOption[] = [
      { value: "eq", label: equals },
    ];
    const numericOperators: MultiFilterOperatorOption[] = [
      { value: "gte", label: gte },
      { value: "lte", label: lte },
    ];

    return [
      {
        field: "title",
        label: t("goods.fields.title"),
        type: "text",
        operators: [{ value: "contains", label: contains }],
        placeholder: t("goods.fields.title"),
      },
      {
        field: "category",
        label: t("goods.fields.category"),
        type: "select",
        operators: selectOperators,
        options: Object.values(EGoodsCategory).map((category) => ({
          value: category,
          label: t(`goods.category.${category}`),
        })),
      },
      {
        field: "badge",
        label: t("goods.fields.badge"),
        type: "select",
        operators: selectOperators,
        options: Object.values(EBadgeType).map((badge) => ({
          value: badge,
          label: t(`goods.badge.${badge}`),
        })),
      },
      {
        field: "status",
        label: t("goods.fields.status"),
        type: "select",
        operators: selectOperators,
        options: Object.values(EProductStatus).map((status) => ({
          value: status,
          label: t(`goods.status.${status}`),
        })),
      },
      {
        field: "price",
        label: t("goods.fields.price"),
        type: "number",
        operators: numericOperators,
        placeholder: t("goods.fields.price"),
        valueParser: priceParser,
      },
      {
        field: "discountPrice",
        label: t("goods.fields.discountPrice"),
        type: "number",
        operators: numericOperators,
        placeholder: t("goods.fields.discountPrice"),
        valueParser: priceParser,
      },
    ];
  }, [filterOperators, priceParser, t]);

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
          updateGoods(
            {
              resource: "goods",
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
          CACHE_TAGS.goodsList,
          CACHE_TAGS.goodsFilters,
          CACHE_TAGS.goodsId(newRow.tag),
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
            <Link
              href={PUBLIC_ROUTES.productsItem(row.tag)}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              style={{ display: "inline-flex" }}
            >
              <IconButton size="small" aria-label={t("actions.show")}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Link>
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
      headerName: t("goods.fields.cover"),
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
      headerName: t("goods.fields.title"),
      flex: 1,
      minWidth: 250,
      valueGetter: (value) => value[locale as keyof LocalizedContent],
      filterable: false,
      sortable: false,
    },
    {
      field: "category",
      headerName: t("goods.fields.category"),
      width: 170,
      align: "center",
      headerAlign: "center",
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
      type: "singleSelect",
      valueOptions: Object.values(EGoodsCategory).map((category) => ({
        value: category,
        label: t(`goods.category.${category}`),
      })),
      valueFormatter: (value: string) => t(`goods.category.${value}`),
      renderCell: (params) => {
        const config = goodsCategoryConfig[params.value as EGoodsCategory];
        if (!config) {
          return params.value;
        }
        return (
          <Chip
            label={t(`goods.category.${params.value}`)}
            color={config.color}
            icon={config.icon}
            variant="filled"
            size="small"
            sx={{ minWidth: "100px", justifyContent: "flex-start" }}
          />
        );
      },
    },
    {
      field: "price",
      headerName: t("goods.fields.price"),
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (value: number) => value / 100,
      valueFormatter: (value: number) => `${value} $`,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "discountPrice",
      headerName: t("goods.fields.discountPrice"),
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (value: number) => (value ? value / 100 : null),
      valueFormatter: (value: number) => (value ? `${value} $` : null),
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "badge",
      headerName: t("goods.fields.badge"),
      width: 170,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EBadgeType).map((badge) => ({
        value: badge,
        label: t(`goods.badge.${badge}`),
      })),
      valueFormatter: (value: string) => value && t(`goods.badge.${value}`),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
      renderCell: (params) => {
        const config = goodsBadgeConfig[params.value as EBadgeType];
        if (!config) {
          return params.value;
        }
        return (
          <Chip
            label={t(`goods.badge.${params.value}`)}
            color={config.color}
            icon={config.icon}
            variant="filled"
            size="small"
            sx={{ minWidth: "100px", justifyContent: "flex-start" }}
          />
        );
      },
    },
    {
      field: "status",
      headerName: t("goods.fields.status"),
      width: 170,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EProductStatus).map((status) => ({
        value: status,
        label: t(`goods.status.${status}`),
      })),
      valueFormatter: (value: string) => t(`goods.status.${value}`),
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
            label={t(`goods.status.${params.value}`)}
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
    <ProtectProvider keyProvider="goods-list">
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
            disableColumnFilter
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
          />
        </Stack>
      </List>
    </ProtectProvider>
  );
}
