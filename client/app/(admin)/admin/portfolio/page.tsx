"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
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
            src={row.cover}
            alt={row.title}
            sx={{
              width: 80,
              height: 56,
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : null;
      },
      align: "center",
      headerAlign: "center",
      width: 100,
    },
    { field: "title", headerName: "Назва", flex: 1, minWidth: 250 },
    { field: "date", headerName: "Дата завершення", width: 100 },
    {
      field: "actions",
      headerName: "Дії",
      renderCell: function render({ row }) {
        return (
          <>
            <EditButton hideText recordItemId={row.id} />
            <ShowButton hideText recordItemId={row.id} />
            <DeleteButton hideText recordItemId={row.id} />
          </>
        );
      },
      align: "center",
      headerAlign: "center",
      width: 150,
    },
  ];

  return (
    <ProtectProvider keyProvider="portfolio-list">
      <List>
        <DataGrid
          {...(dataGridProps as any)}
          columns={columns}
          autoHeight
          rowHeight={72}
        />
      </List>
    </ProtectProvider>
  );
}
