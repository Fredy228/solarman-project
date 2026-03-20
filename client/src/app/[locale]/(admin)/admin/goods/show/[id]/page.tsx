"use client";

import {
  Box,
  Card,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useOne } from "@refinedev/core";
import { Show, TagField } from "@refinedev/mui";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { IGoods } from "@/src/features/goods/types/goods.interface";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import MuiBlockNoteViewer from "@/src/shared/ui/editor/BlockNoteRenderer";
import { getCountryName } from "@/src/shared/utils/country-locale";

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
      <Typography variant="body1" fontWeight="bold" minWidth={160}>
        {label}:
      </Typography>
      <Box>{children}</Box>
    </Stack>
  );
}

export default function GoodsShow() {
  const { id } = useParams<{ id: string }>();
  const {
    query: { data, isLoading },
  } = useOne<IGoods>({
    resource: "goods",
    id,
  });
  const locale = useLocale();
  const t = useTranslations("refine");

  const record = data?.data;

  const descriptionContent = useMemo(() => {
    const json = record?.description?.[locale as keyof LocalizedContent];
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [record?.description, locale]);

  const specs = record?.specs as
    | Record<string, string | number>
    | null
    | undefined;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        {/* Cover */}
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("goods.fields.cover")}:
          </Typography>
          {record?.cover && (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                sx={{ height: "auto", maxHeight: 400, objectFit: "contain" }}
                image={record.cover}
                alt={record.title?.[locale as keyof LocalizedContent] ?? ""}
              />
            </Card>
          )}
        </Stack>

        <Divider />

        {/* Main fields */}
        <Stack gap={2}>
          <FieldRow label={t("goods.fields.title")}>
            <Typography variant="body1">
              {record?.title?.[locale as keyof LocalizedContent]}
            </Typography>
          </FieldRow>

          <FieldRow label={t("goods.fields.tag")}>
            <TagField value={record?.tag} />
          </FieldRow>

          <FieldRow label={t("goods.fields.status")}>
            <Chip
              label={record?.status ? t(`goods.status.${record.status}`) : "—"}
              size="small"
              color={
                record?.status === "PUBLISHED"
                  ? "success"
                  : record?.status === "ARCHIVED"
                    ? "default"
                    : "warning"
              }
              variant="outlined"
            />
          </FieldRow>

          <FieldRow label={t("goods.fields.category")}>
            <Typography variant="body1">
              {record?.category ? t(`goods.category.${record.category}`) : "—"}
            </Typography>
          </FieldRow>

          <FieldRow label={t("goods.fields.price")}>
            <Typography variant="body1">
              {record?.price != null
                ? `${record.price} ${record.currency ? t(`goods.currency.${record.currency}`) : ""}`
                : "—"}
            </Typography>
          </FieldRow>

          {record?.discountPrice != null && (
            <FieldRow label={t("goods.fields.discountPrice")}>
              <Typography variant="body1" color="error">
                {record.discountPrice}{" "}
                {record.currency ? t(`goods.currency.${record.currency}`) : ""}
              </Typography>
            </FieldRow>
          )}

          {record?.badge && (
            <FieldRow label={t("goods.fields.badge")}>
              <Chip
                label={t(`goods.badge.${record.badge}`)}
                size="small"
                color="warning"
                variant="outlined"
              />
            </FieldRow>
          )}

          {record?.brand && (
            <FieldRow label={t("goods.fields.brand")}>
              <Typography variant="body1">{record.brand.name}</Typography>
            </FieldRow>
          )}

          {record?.country && (
            <FieldRow label={t("goods.fields.country")}>
              <Typography variant="body1">
                {getCountryName(record.country, locale)}
              </Typography>
            </FieldRow>
          )}
        </Stack>

        {/* Specs */}
        {specs && Object.keys(specs).length > 0 && (
          <>
            <Divider />
            <Stack gap={2}>
              <Typography variant="h6">
                {t("goods.fields.specs.type").replace(/:.+/, "")} —{" "}
                {t(`goods.category.${record?.category}`)}
              </Typography>
              {Object.entries(specs).map(([key, value]) => {
                const unitKeyMap: Record<string, string> = {
                  power: "goods.measurements.kilowatts",
                  capacity: "goods.measurements.ampereHour",
                  voltage: "goods.measurements.volt",
                  phase: "goods.measurements.phase",
                };
                const unitKey = unitKeyMap[key];
                let displayValue = String(value);
                if (key === "type") {
                  const cat = record?.category;
                  if (cat === "PANEL")
                    displayValue = t(`goods.specs.panelType.${value}`);
                  else if (cat === "INVERTOR")
                    displayValue = t(`goods.specs.invertorType.${value}`);
                  else if (cat === "BATTERY")
                    displayValue = t(`goods.specs.batteryType.${value}`);
                  else if (cat === "FASTENER")
                    displayValue = t(`goods.specs.fastenerType.${value}`);
                } else if (key === "material") {
                  displayValue = t(`goods.specs.fastenerMaterial.${value}`);
                } else if (unitKey) {
                  displayValue = `${value} ${t(unitKey)}`;
                }
                return (
                  <FieldRow
                    key={key}
                    label={t(
                      `goods.fields.specs.${key}` as Parameters<typeof t>[0],
                    )}
                  >
                    <Typography variant="body1">{displayValue}</Typography>
                  </FieldRow>
                );
              })}
            </Stack>
          </>
        )}

        {/* Images */}
        {record?.images && record.images.length > 0 && (
          <>
            <Divider />
            <Stack gap={1}>
              <Typography variant="body1" fontWeight="bold">
                {t("goods.fields.images")}:
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 2,
                }}
              >
                {record.images.map((image, index) =>
                  typeof image === "string" ? (
                    <Card key={index}>
                      <CardMedia
                        component="img"
                        sx={{ height: 250, objectFit: "contain" }}
                        image={image}
                        alt={`${record.title?.[locale as keyof LocalizedContent] ?? ""} - ${index + 1}`}
                      />
                    </Card>
                  ) : null,
                )}
              </Box>
            </Stack>
          </>
        )}

        {/* Instructions */}
        {record?.instructions && record.instructions.length > 0 && (
          <>
            <Divider />
            <Stack gap={1}>
              <Typography variant="body1" fontWeight="bold">
                {t("goods.fields.instructions")}:
              </Typography>
              <Stack gap={1}>
                {record.instructions.map((file, index) => (
                  <Typography
                    key={index}
                    component="a"
                    href={file.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    color="primary"
                    sx={{ textDecoration: "underline", width: "fit-content" }}
                  >
                    {file.fileName}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </>
        )}

        {/* Description */}
        <Divider />
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("goods.fields.description")}:
          </Typography>
          {descriptionContent ? (
            <MuiBlockNoteViewer content={descriptionContent} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          )}
        </Stack>
      </Stack>
    </Show>
  );
}
