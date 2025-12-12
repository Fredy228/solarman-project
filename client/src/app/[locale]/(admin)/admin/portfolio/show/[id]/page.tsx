"use client";

import { useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { DateField, Show, TagField } from "@refinedev/mui";
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";

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

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Назва:
          </Typography>
          <Typography variant="body1">
            {record?.title[locale as keyof LocalizedContent]}
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Тег:
          </Typography>
          <TagField value={record?.tag} />
        </Stack>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Дата завершення:
          </Typography>
          <DateField value={record?.date} format="DD.MM.YYYY" />
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            Опис:
          </Typography>
          {record?.description && (
            <BlockNoteView description={record.description} locale={locale} />
          )}
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            Головна фотографія:
          </Typography>
          {record?.cover && typeof record.cover === "string" && (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                sx={{ height: "auto", maxHeight: 400, objectFit: "contain" }}
                image={"/" + record.cover}
                alt={record.title[locale as keyof LocalizedContent]}
              />
            </Card>
          )}
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            Фотографії:
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
                      image={"/" + image}
                      alt={`${record?.title || ""} - ${index}`}
                    />
                  </Card>
                );
              }
              return null;
            })}
          </Box>
        </Stack>
      </Stack>
    </Show>
  );
}
