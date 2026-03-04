import { Box, Container, Divider, Skeleton, Stack } from "@mui/material";

export default function ProductLoading() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, mt: 5 }}>
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Gallery Skeleton */}
        <Box sx={{ width: "100%" }}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              mt: 1.5,
              display: "flex",
              gap: 1,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                sx={{
                  width: 72,
                  aspectRatio: "1 / 1",
                  borderRadius: 1,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Info Skeleton */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Title */}
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="rectangular" width={100} height={24} />

          {/* Price */}
          <Skeleton variant="text" width={120} height={40} />

          {/* Button */}
          <Skeleton variant="rectangular" width={150} height={40} />

          {/* Specs */}
          <Box>
            <Stack spacing={1.25}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "110px 1fr",
                      sm: "160px 1fr",
                    },
                    gap: 1.5,
                    alignItems: "start",
                  }}
                >
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="60%" />
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Description Skeleton */}
      <Box
        sx={{
          bgcolor: "background.paper",
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Skeleton variant="text" width={200} height={36} sx={{ mb: 2 }} />
        <Stack spacing={1}>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="95%" />
          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="85%" />
          <Skeleton variant="text" width="80%" />
        </Stack>
      </Box>
    </Container>
  );
}
