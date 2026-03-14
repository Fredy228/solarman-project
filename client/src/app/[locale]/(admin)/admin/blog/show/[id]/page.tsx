"use client";

import { Card, CardMedia, Stack, Typography } from "@mui/material";
import { useOne } from "@refinedev/core";
import { DateField, Show, TagField } from "@refinedev/mui";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { IBlog } from "@/src/features/blog";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";
import MuiBlockNoteViewer from "@/src/shared/ui/editor/BlockNoteRenderer";

export default function BlogShow() {
  const { id } = useParams<{ id: string }>();
  const {
    query: { data, isLoading },
  } = useOne<IBlog>({
    resource: "blog",
    id,
  });
  const locale = useLocale();
  const t = useTranslations("refine");

  const record = data?.data;

  const textContent = useMemo(() => {
    const json = record?.text?.[locale as keyof LocalizedContent];
    if (!json) return null;
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [record?.text, locale]);

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.title")}:
          </Typography>
          <Typography variant="body1">
            {record?.title[locale as keyof LocalizedContent]}
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.cover")}:
          </Typography>
          {record?.cover && typeof record.cover === "string" && (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                sx={{ height: "auto", maxHeight: 400, objectFit: "contain" }}
                image={record.cover}
                alt={record.title[locale as keyof LocalizedContent]}
              />
            </Card>
          )}
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.tag")}:
          </Typography>
          <TagField value={record?.tag} />
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.description")}:
          </Typography>
          <Typography variant="body1">
            {record?.description?.[locale as keyof LocalizedContent]}
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.text")}:
          </Typography>
          {record?.text && <MuiBlockNoteViewer content={textContent} />}
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.createdAt")}:
          </Typography>
          <DateField value={record?.createdAt} format="DD.MM.YYYY" />
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("blog.fields.updatedAt")}:
          </Typography>
          <DateField value={record?.updatedAt} format="DD.MM.YYYY" />
        </Stack>
      </Stack>
    </Show>
  );
}
