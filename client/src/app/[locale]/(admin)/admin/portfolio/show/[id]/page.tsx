"use client";

import { useOne } from "@refinedev/core";
import { useParams } from "next/navigation";
import { DateField, Show, TagField } from "@refinedev/mui";
import { Box, Card, CardMedia, Stack, Typography } from "@mui/material";

import { IPortfolio } from "@/src/features/portfolio";

export default function PortfolioShow() {
  const { id } = useParams<{ id: string }>();
  const {
    query: { data, isLoading },
  } = useOne<IPortfolio>({
    resource: "portfolio",
    id,
  });

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="body1" fontWeight="bold">
            Назва:
          </Typography>
          <Typography variant="body1">{record?.title}</Typography>
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
          <DateField value={record?.date} />
        </Stack>
        <Stack gap={1}>
          <Typography variant="body1" fontWeight="bold">
            Опис:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {record?.description}
          </Typography>
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
                alt={record.title}
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
