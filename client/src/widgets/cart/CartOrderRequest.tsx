"use client";

import type { TExchangeRates } from "@/src/features/global-params/types/exchange-rate.type";
import { EOrderType } from "@/src/features/order";
import { sendRequestApi } from "@/src/features/order/api/sendRequest.api";
import { utmStorage } from "@/src/libs/utm-storage";
import { ECurrency } from "@/src/shared/types/currency.enum";
import NumericFormatPhone from "@/src/shared/ui/number-input/NumericFormatPhone";
import { orderConsultationSchema } from "@/src/validators/order.schema";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField,
} from "@mui/material";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { URL_BASE } from "@/src/configs/routes.config";
import { useCartStore } from "@/src/features/cart/store/useCartStore";
import type { ELocale } from "@/src/i18n/routing";

type FormValues = {
  email: string;
  name: string;
  phone: string;
};

type SubmitStatus = "idle" | "success" | "error";

type Props = {
  locale: ELocale;
  exchangeRate: TExchangeRates | null;
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

const getTitle = (title: unknown, locale: ELocale) => {
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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const buildOrderNotes = (
  items: ReturnType<typeof useCartStore.getState>["items"],
  locale: ELocale,
  exchangeRate: TExchangeRates | null,
  baseUrl: string,
) => {
  const lines: string[] = [];

  lines.push("Заявка на оформлення замовлення з кошика");
  lines.push(`Кількість товарів: ${items.length}`);
  lines.push("");

  items.forEach((item, index) => {
    const title = getTitle(item.data.title, locale);
    const pricePerItem = item.data.discountPrice ?? item.data.price;
    const lineTotal = pricePerItem * item.quantity;
    const productUrl = `${baseUrl}/${locale}/products/${item.data.tag}`;
    const safeTitle = escapeHtml(title);
    const safeUrl = escapeHtml(productUrl);
    const titleWithLink = baseUrl
      ? `<a href="${safeUrl}">${safeTitle}</a>`
      : safeTitle;

    lines.push(`${index + 1}. ${titleWithLink}`);
    lines.push(`   Кількість: ${item.quantity}`);
    lines.push(
      `   Ціна/шт: ${formatPrice(pricePerItem, item.data.currency, locale)}`,
    );
    lines.push(
      `   Сума: ${formatPrice(lineTotal, item.data.currency, locale)}`,
    );
    lines.push("");
  });

  if (items.length > 0) {
    const totalUahCents = exchangeRate
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

    if (totalUahCents !== null) {
      lines.push(
        `Разом (грн): ${formatPrice(totalUahCents, ECurrency.UAH, locale)}`,
      );
    }
  }

  return lines.join("\n");
};

export default function CartOrderRequest({ locale, exchangeRate }: Props) {
  const pathname = usePathname();
  const tCommon = useTranslations("common");
  const tValidation = useTranslations("validation");
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "", name: "", phone: "" },
    resolver: joiResolver(orderConsultationSchema(tValidation)),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const isEmpty = items.length === 0;

  const onSubmit = async (data: FormValues) => {
    if (isEmpty) {
      setSubmitStatus("error");
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = URL_BASE;
      const notes = buildOrderNotes(items, locale, exchangeRate, baseUrl);

      await sendRequestApi({
        ...data,
        phone: "380" + data.phone,
        type: EOrderType.ORDER,
        notes,
        pageUrl: pathname,
        utmTags: utmStorage.get(),
      });

      clear();
      setSubmitStatus("success");
    } catch (error) {
      console.error("Failed to send order request:", error);
      setSubmitStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
          gap={2}
        >
          <CheckCircle size={64} color="#4caf50" strokeWidth={1.5} />
          <DialogContentText
            fontSize={20}
            textAlign="center"
            fontWeight={700}
            color="text.primary"
          >
            {tCommon("cartOrderRequest.success.title")}
          </DialogContentText>
          <DialogContentText fontSize={16} textAlign="center">
            {tCommon("cartOrderRequest.success.message")}
          </DialogContentText>
        </Box>
      </DialogContent>
    );
  }

  if (submitStatus === "error") {
    return (
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={4}
          gap={2}
        >
          <AlertCircle size={64} color="#f44336" strokeWidth={1.5} />
          <DialogContentText
            fontSize={20}
            textAlign="center"
            fontWeight={700}
            color="text.primary"
          >
            {tCommon("cartOrderRequest.error.title")}
          </DialogContentText>
          <DialogContentText fontSize={16} textAlign="center">
            {tCommon("cartOrderRequest.error.message")}
          </DialogContentText>
        </Box>
      </DialogContent>
    );
  }

  return (
    <>
      <DialogContent>
        <DialogContentText
          fontSize={16}
          textAlign="center"
          fontWeight={700}
          color="var(--color-text-g2)"
          mb={1}
        >
          {tCommon("cartOrderRequest.title")}
        </DialogContentText>
        <DialogContentText
          fontSize={16}
          textAlign="center"
          mb={2}
          fontStyle="italic"
          color="var(--color-text-g3)"
        >
          {tCommon("cartOrderRequest.text")}
        </DialogContentText>

        {isEmpty && (
          <DialogContentText
            fontSize={14}
            textAlign="center"
            color="error"
            mb={2}
          >
            {tCommon("cartOrderRequest.empty")}
          </DialogContentText>
        )}

        <Stack
          id="cart-order-request-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={tCommon("cartOrderRequest.fields.email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`${tCommon("cartOrderRequest.fields.name")} *`}
                error={!!errors?.name}
                helperText={errors?.name?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <NumericFormatPhone
                {...field}
                label={`${tCommon("cartOrderRequest.fields.phone")} *`}
                error={!!errors?.phone}
                helperText={errors?.phone?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Button
          type="submit"
          variant="contained"
          form="cart-order-request-form"
          startIcon={<Send />}
          loading={isLoading}
          disabled={isEmpty}
        >
          {tCommon("cartOrderRequest.button.send")}
        </Button>
      </DialogActions>
    </>
  );
}
