"use client";

import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";

type Props = {
  activeIndex: number;
  total: number;
  label: string;
  sx?: SxProps<Theme>;
};

export default function QuizProgress({ activeIndex, total, label, sx }: Props) {
  return (
    <Stack
      alignItems="center"
      spacing={1.5}
      minWidth={{ xs: 0, md: 360 }}
      sx={sx}
    >
      <Typography
        component="p"
        sx={{
          color: "var(--color-text-g1)",
          fontSize: { xs: 16, md: 20 },
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index <= activeIndex;

          return (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              sx={{ color: isActive ? "var(--color-primary)" : "#c9ced6" }}
            >
              <Box
                sx={{
                  width: { xs: 34, md: 40 },
                  height: { xs: 34, md: 40 },
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: { xs: 14, md: 16 },
                  color: isActive ? "#fff" : "var(--color-text-g3)",
                  bgcolor: isActive ? "var(--color-primary)" : "#f7f8fb",
                  border: isActive ? "none" : "2px solid #c9ced6",
                }}
              >
                {index + 1}
              </Box>
              {index < total - 1 && (
                <Box
                  sx={{
                    width: { xs: 24, sm: 42, md: 48 },
                    height: 6,
                    bgcolor:
                      index < activeIndex ? "var(--color-primary)" : "#c9ced6",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
