"use client";

import { Box, Chip, Stack } from "@mui/material";
import {
  DataGrid,
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
import { useLocale, useTranslations } from "next-intl";

import { EBadgeType } from "@/src/features/goods/types/goods-badge-type.enum";
import { EGoodsCategory } from "@/src/features/goods/types/goods-category.enum";
import ProtectProvider from "@/src/providers/protect-provider";
import { goodsBadgeConfig } from "@/src/shared/configs/goods-badge.config";
import { goodsCategoryConfig } from "@/src/shared/configs/goods-category.config";
import { productStatusConfig } from "@/src/shared/configs/product-status.config";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EProductStatus } from "@/src/shared/types/product-status.enum";

export default function GoodsList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");
  const locale = useLocale();
  const { mutate: updateGoods } = useUpdate();
  const { open } = useNotification();

  const handleProcessRowUpdate = async (
    newRow: GridRowModel,
    oldRow: GridRowModel
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
            }
          );
        });

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
      field: "cover",
      headerName: t("goods.fields.cover"),
      renderCell: function render({ row }) {
        return row.cover ? (
          <Box
            component="img"
            src={"/" + row.cover}
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
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains"
      ),
    },
    {
      field: "category",
      headerName: t("goods.fields.category"),
      width: 170,
      align: "center",
      headerAlign: "center",
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is"
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
        (operator) => operator.value === "contains"
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
        (operator) => operator.value === "contains"
      ),
    },
    {
      field: "badge",
      headerName: t("goods.fields.badge"),
      width: 170,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: Object.values(EBadgeType).map((badge) => ({
        value: badge,
        label: t(`goods.badge.${badge}`),
      })),
      valueFormatter: (value: string) => value && t(`goods.badge.${value}`),
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is"
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
        (operator) => operator.value === "is"
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
  ];

  return (
    <ProtectProvider keyProvider="goods-list">
      <List>
        <DataGrid
          {...(dataGridProps as any)}
          columns={columns}
          autoHeight
          rowHeight={120}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </List>
    </ProtectProvider>
  );
}
