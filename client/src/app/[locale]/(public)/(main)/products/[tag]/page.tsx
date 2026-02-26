import { Box, Container, Typography } from "@mui/material";

type Props = {
  params: { locale: string; tag: string };
};

export default function ProductPage({ params }: Props) {
  const { tag } = params;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "var(--color-text-g2)",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Product page placeholder
        </Typography>

        <Typography variant="body1" mb={2}>
          Tag: <strong>{tag}</strong>
        </Typography>

        <Typography variant="body2" color="text.secondary">
          TODO: Implement product detail view.
        </Typography>
      </Box>
    </Container>
  );
}
