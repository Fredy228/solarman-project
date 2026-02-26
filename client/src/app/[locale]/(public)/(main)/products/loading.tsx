import { Box, Container, Skeleton } from "@mui/material";

export default function ProductsLoading() {
  return (
    <Box>
      <Container maxWidth="xl">
        <Box height={70} />

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 1.5,
            mb: 3,
          }}
        >
          <Skeleton variant="rounded" height={40} />
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            <Skeleton variant="rounded" height={40} />
            <Skeleton variant="rounded" height={40} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          <Box sx={{ width: 300, display: { xs: "none", lg: "block" } }}>
            <Skeleton variant="rounded" height={420} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={260} />
              ))}
            </Box>

            <Box mt={3} className="flex justify-center">
              <Skeleton variant="rounded" width={220} height={36} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
