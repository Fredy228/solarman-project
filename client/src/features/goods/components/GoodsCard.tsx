import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

import type { TExchangeRates } from "@/src/features/global-params/types/exchange-rate.type";
import { EBadgeType } from "@/src/features/goods/types/goods-badge-type.enum";
import type { TGoodsListItem } from "@/src/features/goods/types/goods.interface";
import type { ELocale } from "@/src/i18n/routing";
import { ECurrency } from "@/src/shared/types/currency.enum";

type Props = {
  item: TGoodsListItem;
  locale: ELocale;
  exchangeRate: TExchangeRates | null;
};

const normalizeCoverUrl = (cover: string) => {
  if (
    cover.startsWith("http://") ||
    cover.startsWith("https://") ||
    cover.startsWith("/")
  ) {
    return cover;
  }

  return `/${cover}`;
};

const convertFromUsdCents = (
  priceInCents: number,
  currency: ECurrency,
  rates: TExchangeRates | null,
) => {
  if (!rates) return priceInCents;

  switch (currency) {
    case ECurrency.EUR:
      return Math.round(priceInCents * rates[ECurrency.EUR]);
    case ECurrency.UAH:
      return Math.round(priceInCents * rates[ECurrency.UAH]);
    default:
      return priceInCents;
  }
};

const formatPrice = (
  priceInCents: number,
  currency: ECurrency,
  locale: ELocale,
  rates: TExchangeRates | null,
) => {
  const useRates = Boolean(rates);
  const targetCurrency = useRates ? currency : ECurrency.USD;

  const priceCents = useRates
    ? convertFromUsdCents(priceInCents, currency, rates)
    : priceInCents;

  const price = priceCents / 100;

  const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return `${formatted} ${targetCurrency}`;
};

const BADGE_COLORS: Record<EBadgeType, { bgcolor: string; color: string }> = {
  [EBadgeType.SALE]: { bgcolor: "error.main", color: "error.contrastText" },
  [EBadgeType.LOW_STOCK]: {
    bgcolor: "warning.main",
    color: "warning.contrastText",
  },
  [EBadgeType.PRICE_INCREASE_PLANNED]: {
    bgcolor: "info.main",
    color: "info.contrastText",
  },
};

export default function GoodsCard({ item, locale, exchangeRate }: Props) {
  const t = useTranslations("refine");
  const formattedPrice = formatPrice(
    item.price,
    item.currency,
    locale,
    exchangeRate,
  );
  const formattedDiscountPrice = item.discountPrice
    ? formatPrice(item.discountPrice, item.currency, locale, exchangeRate)
    : null;
  const badgeLabel = item.badge ? t(`goods.badge.${item.badge}`) : null;
  const badgeStyle = item.badge ? BADGE_COLORS[item.badge] : null;

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "var(--border-radius-main)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "@media (hover: hover) and (pointer: fine)": {
          "&:hover .goods-card-title": { color: "primary.main" },
        },
        "&:active .goods-card-title": { color: "primary.main" },
      }}
    >
      <Link
        href={`/products/${item.tag}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          height: "100%",
        }}
      >
        <Box sx={{ width: "100%", aspectRatio: "3 / 4", position: "relative" }}>
          <Image
            src={normalizeCoverUrl(item.cover)}
            alt={item.title[locale]}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
          />

          {item.badge && badgeStyle && badgeLabel && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                px: 1.25,
                py: 0.5,
                borderRadius: "12px",
                bgcolor: badgeStyle.bgcolor,
                color: badgeStyle.color,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.2,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
              }}
            >
              {badgeLabel}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            p: 1.5,
            color: "var(--color-text-g2)",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <Typography
            className="goods-card-title"
            fontWeight={600}
            mb={2}
            color="inherit"
            fontSize={{
              xs: "14px",
              md: "14px",
              lg: "14px",
              xl: "16px",
            }}
            sx={{
              transition: "color 0.2s ease",
            }}
          >
            {item.title[locale]}
          </Typography>

          <Box sx={{ mt: "auto" }}>
            {formattedDiscountPrice ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "baseline",
                }}
              >
                <Typography
                  fontSize={{
                    xs: "13px",
                    md: "13px",
                    lg: "13px",
                    xl: "15px",
                  }}
                  sx={{
                    textDecoration: "line-through",
                  }}
                >
                  {formattedPrice}
                </Typography>
                <Typography
                  fontSize={{
                    xs: "16px",
                    md: "16px",
                    lg: "16px",
                    xl: "18px",
                  }}
                  color="error"
                  fontWeight={700}
                >
                  {formattedDiscountPrice}
                </Typography>
              </Box>
            ) : (
              <Typography
                color="primary.main"
                fontWeight={700}
                fontSize={{
                  xs: "16px",
                  md: "16px",
                  lg: "16px",
                  xl: "18px",
                }}
              >
                {formattedPrice}
              </Typography>
            )}
          </Box>
        </Box>
      </Link>

      <Box sx={{ px: 1.5, pb: 1.5, pt: 0, mt: "auto" }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<ShoppingCart fontSize="small" />}
          sx={{
            textTransform: "none",
            color: "secondary.main",
            borderColor: "secondary.main",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              borderColor: "secondary.main",
            },
          }}
        >
          {t("buttons.add")}
        </Button>
      </Box>
    </Paper>
  );
}
