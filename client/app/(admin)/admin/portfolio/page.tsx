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
  getGridStringOperators,
  GridColDef,
} from "@mui/x-data-grid";
import { Box, Stack } from "@mui/material";
import ProtectProvider from "@/src/providers/protect-provider";

export default function PortfolioList() {
  const { dataGridProps } = useDataGrid();

  const columns: GridColDef[] = [
    {
      field: "cover",
      headerName: "Головна фотографія",
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
      headerName: "Назва",
      flex: 1,
      minWidth: 250,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === "contains",
      ),
    },
    {
      field: "date",
      headerName: "Дата завершення",
      type: "date",
      width: 150,
      align: "center",
      valueGetter: (value) => value && new Date(value),
      filterOperators: getGridDateOperators().filter((operator) =>
        ["is", "onOrAfter", "onOrBefore"].includes(operator.value),
      ),
    },
    {
      field: "actions",
      headerName: "Дії",
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
        />
      </List>
    </ProtectProvider>
  );
}
