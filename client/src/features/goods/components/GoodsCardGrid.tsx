import { Box, Typography } from "@mui/material";

import type { TExchangeRates } from "@/src/features/global-params/types/exchange-rate.type";
import type { TGoodsListItem } from "@/src/features/goods/types/goods.interface";
import type { ELocale } from "@/src/i18n/routing";
import GoodsCard from "./GoodsCard";

type Props = {
  items: TGoodsListItem[];
  locale: ELocale;
  emptyText: string;
  exchangeRate: TExchangeRates | null;
};

export default function GoodsCardGrid({
  items,
  locale,
  emptyText,
  exchangeRate,
}: Props) {
  if (items.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          px: 2,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">{emptyText}</Typography>
      </Box>
    );
  }

  return (
    <Box className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-4">
      {items.map((item) => (
        <GoodsCard
          key={item.id}
          item={item}
          locale={locale}
          exchangeRate={exchangeRate}
        />
      ))}
    </Box>
  );
}
