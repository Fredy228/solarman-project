"use client";

import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { useOne } from "@refinedev/core";
import { DateField, Show, TagField } from "@refinedev/mui";
import { useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { IPortfolio } from "@/src/features/portfolio";
import { LocalizedContent } from "@/src/shared/types/localized-content.type";

const BlockNoteView = dynamic(
  () => import("@/src/widgets/refine/BlockNoteView"),
  {
    ssr: false,
    loading: () => <p>Загрузка описания...</p>,
  },
);

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

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.title")}:
          </Typography>
          <Typography variant="body1">
            {record?.title[locale as keyof LocalizedContent]}
          </Typography>
        </Stack>
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
                alt={record.title[locale as keyof LocalizedContent]}
              />
            </Card>
          )}
        </Stack>
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
            {record?.images?.map((image: string | File, index: number) => {
              if (typeof image === "string") {
                return (
                  <Card key={index}>
                    <CardMedia
                      component="img"
                      sx={{ height: 250, objectFit: "contain" }}
                      image={image}
                      alt={`${record?.title || ""} - ${index}`}
                    />
                  </Card>
                );
              }
              return null;
            })}
          </Box>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.tag")}:
          </Typography>
          <TagField value={record?.tag} />
        </Stack>
        <Stack direction="column" gap={2}>
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.hashtags")}:
          </Typography>
          <Stack
            gap={1}
            flexWrap={"wrap"}
            direction="row"
            justifyItems={"flex-start"}
          >
            {record?.hashtags?.map((hashtag) => (
              <TagField
                key={hashtag.id}
                value={hashtag.name[locale as keyof LocalizedContent]}
                sx={{}}
              />
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.date")}:
          </Typography>
          <DateField value={record?.date} format="DD.MM.YYYY" />
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            {t("portfolio.fields.description")}:
          </Typography>
          {record?.description && (
            <BlockNoteView description={record.description} locale={locale} />
          )}
        </Stack>
      </Stack>
    </Show>
  );
}
