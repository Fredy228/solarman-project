"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCartStore } from "@/src/features/cart/store/useCartStore";
import type { TExchangeRates } from "@/src/features/global-params/types/exchange-rate.type";
import type { ELocale } from "@/src/i18n/routing";
import { ECurrency } from "@/src/shared/types/currency.enum";
import { buildLocalizedPath } from "@/src/shared/utils/localized-path";
import CartOrderRequest from "@/src/widgets/cart/CartOrderRequest";

type Props = {
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

const formatPrice = (
  valueInCents: number,
  currency: ECurrency,
  locale: ELocale,
) => {
  const price = valueInCents / 100;
  const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
  return `${formatted} ${currency}`;
};

const getRateToUah = (
  currency: ECurrency,
  rates: TExchangeRates | null,
): number | null => {
  if (!rates) return null;
  if (currency === ECurrency.UAH) return 1;

  if (currency === ECurrency.USD) {
    return rates[ECurrency.UAH] ?? null;
  }

  if (currency === ECurrency.EUR) {
    const uahRate = rates[ECurrency.UAH];
    const eurRate = rates[ECurrency.EUR];
    if (!uahRate || !eurRate) return null;
    return uahRate / eurRate;
  }

  return null;
};

const convertToUahCents = (
  valueInCents: number,
  currency: ECurrency,
  rates: TExchangeRates | null,
): number | null => {
  const rate = getRateToUah(currency, rates);
  if (!rate) return null;
  return Math.round(valueInCents * rate);
};

export default function CartClient({ locale, exchangeRate }: Props) {
  const t = useTranslations("cart");
  const tCommon = useTranslations("common");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const total = getTotalPrice();

  const totalInUahCents =
    exchangeRate !== null
      ? items.reduce((sum, item) => {
          const pricePerItem = item.data.discountPrice ?? item.data.price;
          const lineTotal = pricePerItem * item.quantity;
          const converted = convertToUahCents(
            lineTotal,
            item.data.currency,
            exchangeRate,
          );
          return sum + (converted ?? lineTotal);
        }, 0)
      : null;

  const totalCurrency =
    totalInUahCents !== null
      ? ECurrency.UAH
      : (items[0]?.data.currency ?? ECurrency.USD);

  const totalForDisplay = totalInUahCents ?? total;

  const getTitle = (title: unknown) => {
    if (typeof title === "string") return title;
    if (title && typeof title === "object" && !Array.isArray(title)) {
      const record = title as Record<string, unknown>;
      const localized = record[locale];
      if (typeof localized === "string") return localized;
      const firstString = Object.values(record).find(
        (value) => typeof value === "string",
      );
      return typeof firstString === "string" ? firstString : "";
    }
    return "";
  };

  const isEmpty = items.length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, mt: 5 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <ShoppingCartIcon />
        <Typography variant="h5" fontWeight={700}>
          {t("title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("itemsCount", { count: items.length })}
        </Typography>
      </Stack>

      {isEmpty ? (
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" mb={2}>
            {t("empty")}
          </Typography>
          <Button
            component={Link}
            href={buildLocalizedPath(locale, "/products")}
            variant="contained"
          >
            {t("goToShop")}
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          <Stack spacing={2}>
            {items.map((item) => {
              const pricePerItem = item.data.discountPrice ?? item.data.price;
              const lineTotal = pricePerItem * item.quantity;

              return (
                <Paper
                  key={item.id}
                  sx={{
                    p: { xs: 2, md: 3 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "140px 1fr 140px" },
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "background.default",
                      mx: "auto",
                    }}
                  >
                    <Image
                      src={normalizeCoverUrl(item.data.cover)}
                      alt={getTitle(item.data.title) || "product"}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </Box>

                  <Stack spacing={1} sx={{ width: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component={Link}
                      href={buildLocalizedPath(
                        locale,
                        `/products/${item.data.tag}`,
                      )}
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        "&:hover": { color: "var(--color-primary)" },
                      }}
                    >
                      {getTitle(item.data.title)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("price")}:{" "}
                      {formatPrice(pricePerItem, item.data.currency, locale)}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => decrement(item.id)}
                        aria-label="decrement"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        width={32}
                        textAlign="center"
                        fontWeight={600}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => increment(item.id)}
                        aria-label="increment"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Button
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={() => removeItem(item.id)}
                        sx={{ ml: 1, textTransform: "none" }}
                      >
                        {t("remove")}
                      </Button>
                    </Stack>
                  </Stack>

                  <Box textAlign={{ xs: "left", sm: "right" }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("sum")}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {formatPrice(lineTotal, item.data.currency, locale)}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          <Divider />

          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "initial", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                {t("total")}
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                {formatPrice(totalForDisplay, totalCurrency, locale)}
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "column", md: "row" }}
              spacing={1}
              flex={1}
              sx={{
                justifyContent: { xs: "center", sm: "flex-end" },
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href={buildLocalizedPath(locale, "/products")}
                sx={{
                  textTransform: "none",
                  width: { xs: "100%", sm: "100%", md: "auto" },
                }}
              >
                {t("continueShopping")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsOrderOpen(true)}
                sx={{
                  textTransform: "none",
                  width: { xs: "100%", sm: "100%", md: "auto" },
                }}
              >
                {t("checkout")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      )}
      <Dialog
        open={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 1,
          }}
        >
          {tCommon("cartOrderRequest.title")}
          <IconButton onClick={() => setIsOrderOpen(false)} aria-label="close">
            <X />
          </IconButton>
        </DialogTitle>
        <CartOrderRequest locale={locale} exchangeRate={exchangeRate} />
      </Dialog>
    </Container>
  );
}
