import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import GoogleIcon from "@mui/icons-material/Google";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type { IReview } from "../types/review.interface";
import Section from "@/src/shared/ui/sections/Section";
import SectionTitle from "@/src/shared/ui/title/SectionTitle";

type Props = {
  reviews: IReview[];
};

export default function ReviewsSection({ reviews }: Props) {
  const t = useTranslations("home");
  const visibleReviews = reviews.slice(0, 6);

  if (visibleReviews.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container maxWidth="xl">
        <Box
          className="relative overflow-hidden"
          sx={{
            borderRadius: { xs: "24px", md: "32px" },
            px: { xs: 2.5, md: 4.5 },
            py: { xs: 3, md: 4.5 },
            background:
              "linear-gradient(135deg, #12396f 0%, #1c5ca7 54%, #f09a38 160%)",
            boxShadow: "0 20px 60px rgba(22, 73, 138, 0.18)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "auto -8% -28% auto",
              width: { xs: 180, md: 320 },
              height: { xs: 180, md: 320 },
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              filter: "blur(6px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: { xs: "-40px auto auto -30px", md: "-70px auto auto -40px" },
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              borderRadius: "999px",
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
            spacing={2}
            mb={4}
            className="relative"
          >
            <Box maxWidth="760px">
              <Chip
                icon={<GoogleIcon />}
                label={t("reviews.badge")}
                sx={{
                  mb: 2,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />
              <SectionTitle component="h2" color="white" className="max-w-3xl">
                {t("reviews.title")}
              </SectionTitle>
              <Typography
                component="p"
                variant="subtitle1"
                color="rgba(255,255,255,0.82)"
                className="whitespace-pre-line"
              >
                {t("reviews.subtitle")}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                px: 2,
                py: 1,
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "white",
              }}
            >
              <StarRoundedIcon sx={{ color: "#ffd166" }} />
              <Typography fontWeight={700}>Google Reviews</Typography>
            </Stack>
          </Stack>

          <Box className="relative flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
            {visibleReviews.map((review, index) => {
              const authorInitial = review.author_name.trim().charAt(0) || "S";
              const content = (
                <Paper
                  elevation={0}
                  className="h-full snap-start"
                  sx={{
                    width: { xs: 296, sm: 330, md: 360 },
                    minHeight: 320,
                    p: 2.5,
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    backgroundColor: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                    mb={2}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={review.profile_photo_url || undefined}
                        alt={review.author_name}
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "var(--color-secondary)",
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {authorInitial.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          component="p"
                          fontWeight={700}
                          color="var(--color-text-g2)"
                        >
                          {review.author_name}
                        </Typography>
                        <Typography
                          component="p"
                          variant="caption"
                          color="var(--color-text-g4)"
                        >
                          {review.relative_time_description}
                        </Typography>
                      </Box>
                    </Stack>
                    <FormatQuoteRoundedIcon
                      sx={{ color: "var(--color-primary)", fontSize: 34 }}
                    />
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <Rating
                      value={review.rating}
                      precision={0.5}
                      readOnly
                      icon={<StarRoundedIcon fontSize="inherit" />}
                      emptyIcon={<StarRoundedIcon fontSize="inherit" />}
                      sx={{
                        color: "var(--color-primary)",
                        "& .MuiRating-iconEmpty": {
                          color: "rgba(252, 115, 0, 0.22)",
                        },
                      }}
                    />
                    <Typography
                      component="span"
                      fontWeight={700}
                      color="var(--color-text-g2)"
                    >
                      {review.rating.toFixed(1)}
                    </Typography>
                  </Stack>

                  <Typography
                    component="p"
                    color="var(--color-text-g3)"
                    sx={{
                      whiteSpace: "pre-line",
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 7,
                    }}
                  >
                    {review.text}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2.5}
                    pt={2}
                    sx={{ borderTop: "1px solid rgba(2, 36, 77, 0.1)" }}
                  >
                    {review.translated ? (
                      <Chip
                        label={t("reviews.translated")}
                        size="small"
                        sx={{
                          bgcolor: "rgba(22, 73, 138, 0.08)",
                          color: "var(--color-secondary)",
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Box />
                    )}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                      color="var(--color-text-g4)"
                    >
                      <GoogleIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" fontWeight={700}>
                        Google Maps
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              );

              if (!review.author_url) {
                return <Box key={`${review.author_name}-${index}`}>{content}</Box>;
              }

              return (
                <Link
                  key={`${review.author_name}-${index}`}
                  href={review.author_url}
                  target="_blank"
                  rel="noreferrer"
                  underline="none"
                  color="inherit"
                  className="block"
                >
                  {content}
                </Link>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Section>
  );
}
