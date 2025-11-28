"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ProtectProvider from "@/src/providers/protect-provider";

export default function PortfolioList() {
  const { dataGridProps } = useDataGrid();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "number", width: 50 },
    { field: "title", headerName: "Назва", flex: 1 },
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
      minWidth: 150,
    },
  ];

  return (
    <ProtectProvider keyProvider="portfolio-list">
      <List>
        <DataGrid {...(dataGridProps as any)} columns={columns} autoHeight />
      </List>
    </ProtectProvider>
  );
}
