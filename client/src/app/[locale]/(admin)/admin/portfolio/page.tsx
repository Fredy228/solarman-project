"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import {
  DataGrid,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { Box, Chip, Stack } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { useNotification, useUpdate } from "@refinedev/core";
import dayjs from "dayjs";

import ProtectProvider from "@/src/providers/protect-provider";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import { EPortfolioType } from "@/src/features/portfolio/types/portfolio-type.enum";
import { EProductStatus } from "@/src/shared/types/product-status.enum";
import { productStatusConfig } from "@/src/shared/configs/product-status.config";
import { portfolioTypeConfig } from "@/src/shared/configs/portfolio-type.config";

export default function PortfolioList() {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });
  const t = useTranslations("refine");
  const locale = useLocale();
  const { mutate: updatePortfolio } = useUpdate();
  const { open } = useNotification();

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
      headerName: t("portfolio.fields.cover"),
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
      headerName: t("portfolio.fields.title"),
      flex: 1,
      minWidth: 250,
      valueGetter: (value) => value[locale as keyof LocalizedContent],
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "type",
      headerName: t("portfolio.fields.type"),
      width: 170,
      align: "center",
      headerAlign: "center",
      filterOperators: getGridSingleSelectOperators().filter(
        (operator) => operator.value === "is",
      ),
      type: "singleSelect",
      valueOptions: Object.values(EPortfolioType).map((type) => ({
        value: type,
        label: t(`portfolio.type.${type}`),
      })),
      valueFormatter: (value: string) => t(`portfolio.type.${value}`),
      renderCell: (params) => {
        const config = portfolioTypeConfig[params.value as EPortfolioType];
        if (!config) {
          return params.value;
        }
        return (
          <Chip
            label={t(`portfolio.type.${params.value}`)}
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
    <ProtectProvider keyProvider="portfolio-list">
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
