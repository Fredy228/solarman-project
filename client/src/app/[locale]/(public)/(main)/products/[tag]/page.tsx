import ShoppingCart from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import { getGoodsByTag } from "@/src/features/goods/api/goods-detail.api";
import GoodsGallery from "@/src/features/goods/components/GoodsGallery";
import type { IGoodsLocalized } from "@/src/features/goods/types/goods.interface";
import { ECurrency } from "@/src/shared/types/currency.enum";
import MuiBlockNoteViewer from "@/src/shared/ui/editor/BlockNoteRenderer";

import type { ELocale } from "@/src/i18n/routing";

type Props = {
  params: Promise<{ locale: ELocale; tag: string }>;
};

const formatPrice = (
  priceInCents: number,
  currency: ECurrency,
  locale: ELocale,
  rates: Record<string, number> | null,
) => {
  const useRates = Boolean(rates);
  const targetCurrency = useRates ? currency : ECurrency.USD;
  const rateValue = useRates && rates ? (rates[currency] ?? 1) : 1;
  const priceCents = useRates
    ? Math.round(priceInCents * rateValue)
    : priceInCents;
  const price = priceCents / 100;

  const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return `${formatted} ${targetCurrency}`;
};

const specsLabelMap: Record<string, string> = {
  power: "goods.fields.specs.power",
  phase: "goods.fields.specs.phase",
  capacity: "goods.fields.specs.capacity",
  voltage: "goods.fields.specs.voltage",
  material: "goods.fields.specs.material",
  type: "goods.fields.specs.type",
  country: "goods.fields.country",
  brand: "goods.fields.brand",
};

const getTypeTranslationPrefix = (category: string): string | null => {
  if (category === "PANEL") return "goods.specs.panelType";
  if (category === "INVERTOR") return "goods.specs.invertorType";
  if (category === "BATTERY") return "goods.specs.batteryType";
  if (category === "FASTENER") return "goods.specs.fastenerType";
  return null;
};

const getMaterialTranslationPrefix = (category: string): string | null => {
  if (category === "FASTENER") return "goods.specs.fastenerMaterial";
  return null;
};

const BADGE_COLORS: Record<string, { bgcolor: string; color: string }> = {
  SALE: { bgcolor: "error.main", color: "error.contrastText" },
  LOW_STOCK: { bgcolor: "warning.main", color: "warning.contrastText" },
  PRICE_INCREASE_PLANNED: {
    bgcolor: "info.main",
    color: "info.contrastText",
  },
};

const normalizeImages = (goods: IGoodsLocalized) => {
  const base = goods.images ?? [];
  const cover = goods.cover ? [goods.cover] : [];
  const all = [...cover, ...base];
  const seen = new Set<string>();
  return all.filter((src) => {
    const key = src || "";
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default async function ProductPage({ params }: Props) {
  const { tag, locale } = await params;
  const t = await getTranslations({ locale, namespace: "refine" });

  const data = await getGoodsByTag(tag);
  if (!data) {
    notFound();
  }

  const exchangeRate = await getExchangeRate();

  // Import country localization utility
  const { getCountryName } = await import("@/src/shared/utils/country-locale");
  const descriptionContent = data?.description
    ? JSON.parse(data.description)
    : null;

  const price = formatPrice(
    data.price,
    data.currency,
    locale,
    exchangeRate?.value ?? null,
  );
  const discountPrice = data.discountPrice
    ? formatPrice(
        data.discountPrice,
        data.currency,
        locale,
        exchangeRate?.value ?? null,
      )
    : null;

  // Combine specs with country and brand
  const additionalFields: Record<string, string> = {};
  if (data.country) {
    additionalFields.country = data.country;
  }
  if (data.brand?.name) {
    additionalFields.brand = data.brand.name;
  }

  const specsEntries = Object.entries({
    ...additionalFields,
    ...(data.specs ?? {}),
  }).filter(([, value]) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    return String(value).length > 0;
  });

  const images = normalizeImages(data);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, mt: 5 }}>
      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GoodsGallery key={tag} images={images} title={data.title} />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            color: "var(--color-text-g2)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              component={"h1"}
              fontWeight={700}
              gutterBottom
              fontSize={{
                xs: "16px",
                md: "18px",
                lg: "20px",
              }}
            >
              {data.title}
            </Typography>
            {data.badge && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "12px",
                  bgcolor: BADGE_COLORS[data.badge]?.bgcolor ?? "primary.main",
                  color:
                    BADGE_COLORS[data.badge]?.color ?? "primary.contrastText",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.2,
                }}
              >
                {t(`goods.badge.${data.badge}`)}
              </Box>
            )}
          </Box>

          <Box>
            {discountPrice ? (
              <Stack spacing={0.5} alignItems="flex-start">
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {price}
                </Typography>
                <Typography variant="h5" color="error" fontWeight={700}>
                  {discountPrice}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h5" color="primary" fontWeight={700}>
                {price}
              </Typography>
            )}
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ShoppingCart fontSize="small" />}
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
              color: "secondary.main",
              borderColor: "secondary.main",
              transition: "all 0.2s ease",
              px: 2.5,
              minHeight: 40,
              "&:hover": {
                bgcolor: "secondary.main",
                color: "secondary.contrastText",
                borderColor: "secondary.main",
              },
            }}
          >
            {t("buttons.add")}
          </Button>

          {specsEntries.length > 0 && (
            <Box>
              <Stack spacing={1.25}>
                {specsEntries.map(([key, value]) => {
                  const labelKey = specsLabelMap[key] ?? key;
                  const label = labelKey.startsWith("goods.")
                    ? t(labelKey as `goods.${string}`)
                    : key;

                  let valueLabel: string;
                  if (key === "country") {
                    valueLabel = getCountryName(String(value), locale);
                  } else if (key === "brand") {
                    valueLabel = String(value);
                  } else if (key === "type") {
                    const prefix = getTypeTranslationPrefix(data.category);
                    valueLabel = prefix
                      ? t(`${prefix}.${value}` as `goods.specs.${string}`)
                      : String(value);
                  } else if (key === "material") {
                    const prefix = getMaterialTranslationPrefix(data.category);
                    valueLabel = prefix
                      ? t(`${prefix}.${value}` as `goods.specs.${string}`)
                      : String(value);
                  } else {
                    const rawValue = Array.isArray(value)
                      ? value.join(", ")
                      : String(value);

                    // Add measurement units for numeric fields
                    const unitKeyMap: Record<string, string> = {
                      power: "goods.measurements.kilowatts",
                      capacity: "goods.measurements.ampereHour",
                      voltage: "goods.measurements.volt",
                      phase: "goods.measurements.phase",
                    };

                    const unitKey = unitKeyMap[key];
                    valueLabel = unitKey
                      ? `${rawValue} ${t(unitKey as `goods.measurements.${string}`)}`
                      : rawValue;
                  }

                  return (
                    <Box
                      key={key}
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {valueLabel}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{
          bgcolor: "background.paper",
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          {t("goods.fields.description")}
        </Typography>
        <MuiBlockNoteViewer content={descriptionContent} />
      </Box>
    </Container>
  );
}
