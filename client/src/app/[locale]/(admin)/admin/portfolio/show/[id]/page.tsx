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
import { DateField, Show, TagField } from "@refinedev/mui";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { IPortfolio } from "@/src/features/portfolio";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import MuiBlockNoteViewer from "@/src/shared/ui/editor/BlockNoteRenderer";

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

export default function PortfolioShow() {
  const { id } = useParams<{ id: string }>();
  const {
    query: { data, isLoading },
  } = useOne<IPortfolio>({
    resource: "portfolio",
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

  return (
    <Show isLoading={isLoading}>
      <Stack gap={3}>
        {/* Cover */}
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.cover")}:
          </Typography>
          {record?.cover && typeof record.cover === "string" && (
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
          <FieldRow label={t("portfolio.fields.title")}>
            <Typography variant="body1">
              {record?.title?.[locale as keyof LocalizedContent]}
            </Typography>
          </FieldRow>

          <FieldRow label={t("portfolio.fields.tag")}>
            <TagField value={record?.tag} />
          </FieldRow>

          <FieldRow label={t("portfolio.fields.status")}>
            <Chip
              label={
                record?.status ? t(`portfolio.status.${record.status}`) : "—"
              }
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

          <FieldRow label={t("portfolio.fields.date")}>
            <DateField value={record?.date} format="DD.MM.YYYY" />
          </FieldRow>
        </Stack>

        {/* Hashtags */}
        {record?.hashtags && record.hashtags.length > 0 && (
          <>
            <Divider />
            <Stack gap={1.5}>
              <Typography variant="body1" fontWeight="bold">
                {t("portfolio.fields.hashtags")}:
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {record.hashtags.map((hashtag) => (
                  <TagField
                    key={hashtag.id}
                    value={hashtag.name[locale as keyof LocalizedContent]}
                  />
                ))}
              </Stack>
            </Stack>
          </>
        )}

        {/* Images */}
        {record?.images && record.images.length > 0 && (
          <>
            <Divider />
            <Stack gap={1}>
              <Typography variant="body1" fontWeight="bold">
                {t("portfolio.fields.images")}:
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: 2,
                }}
              >
                {record.images.map((image: string | File, index: number) =>
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

        {/* Description */}
        <Divider />
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.description")}:
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
