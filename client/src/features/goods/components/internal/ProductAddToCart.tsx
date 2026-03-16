"use client";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";

import { useCartAnimation } from "@/src/features/cart/context/CartAnimationContext";
import { useCartStore } from "@/src/features/cart/store/useCartStore";
import type { ELocale } from "@/src/i18n/routing";
import type { ECurrency } from "@/src/shared/types/currency.enum";

type ProductAddToCartProps = {
  locale: ELocale;
  product: {
    id: string;
    title: string;
    price: number;
    discountPrice?: number | null;
    currency: ECurrency;
    cover: string;
    tag: string;
  };
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
};

export default function ProductAddToCart({
  product,
  locale,
  size = "small",
  fullWidth = false,
}: ProductAddToCartProps) {
  const t = useTranslations("refine");
  const addItem = useCartStore((state) => state.addItem);
  const { triggerFly } = useCartAnimation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const itemToStore = useMemo(
    () => ({
      id: product.id,
      title: {
        [locale]: product.title,
      },
      price: product.price,
      discountPrice: product.discountPrice ?? null,
      currency: product.currency,
      cover: product.cover,
      tag: product.tag,
    }),
    [product, locale],
  );

  return (
    <Button
      ref={buttonRef}
      variant="outlined"
      size={size}
      startIcon={<ShoppingCart fontSize="small" />}
      fullWidth={fullWidth}
      onClick={() => {
        addItem(itemToStore);
        if (buttonRef.current) triggerFly(buttonRef.current);
      }}
      sx={{
        textTransform: "none",
        color: "secondary.main",
        borderColor: "secondary.main",
        transition: "all 0.2s ease",
        px: size === "small" ? 2.5 : undefined,
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
  );
}
