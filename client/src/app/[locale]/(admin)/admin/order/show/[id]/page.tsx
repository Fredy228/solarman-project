"use client";

import { Chip, Stack, Typography } from "@mui/material";
import { useOne } from "@refinedev/core";
import { DateField, Show } from "@refinedev/mui";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { EOrderType } from "@/src/features/order/types/order-type.enum";
import { IOrder } from "@/src/features/order/types/order.type";

export default function OrderShow() {
  const { id } = useParams<{ id: string }>();
  const {
    query: { data, isLoading },
  } = useOne<IOrder>({
    resource: "order",
    id,
  });
  const t = useTranslations("refine");

  const record = data?.data;

  const getTypeColor = (type: EOrderType | null | undefined) => {
    switch (type) {
      case EOrderType.CONSULTATION:
        return "info";
      case EOrderType.ORDER:
        return "success";
      case EOrderType.QUIZ:
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("order.fields.email")}:
          </Typography>
          <Typography variant="body2">{record?.email || "—"}</Typography>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("order.fields.name")}:
          </Typography>
          <Typography variant="body2">{record?.name}</Typography>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("order.fields.phone")}:
          </Typography>
          <Typography variant="body2">
            {record?.phone
              ? "+" +
                Number(record.phone).toLocaleString("uk-UA", {
                  useGrouping: true,
                })
              : "—"}
          </Typography>
        </Stack>

        <Stack direction="column" gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("order.fields.notes")}:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
            }}
          >
            {record?.notes || "—"}
          </Typography>
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Язык:
          </Typography>
          <Chip
            label={record?.lang?.toUpperCase()}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("order.fields.type")}:
          </Typography>
          {record?.type ? (
            <Chip
              label={t(`order.type.${record.type}`)}
              color={getTypeColor(record.type)}
              variant="filled"
              size="small"
            />
          ) : (
            <Typography variant="body2">—</Typography>
          )}
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Дата создания:
          </Typography>
          <DateField value={record?.createdAt} format="DD.MM.YYYY HH:mm:ss" />
        </Stack>

        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Дата обновления:
          </Typography>
          <DateField value={record?.updatedAt} format="DD.MM.YYYY HH:mm:ss" />
        </Stack>
      </Stack>
    </Show>
  );
}
