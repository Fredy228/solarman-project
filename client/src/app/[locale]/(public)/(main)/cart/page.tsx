import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import type { ELocale } from "@/src/i18n/routing";
import { buildMetadata } from "@/src/shared/utils/seo";
import type { Metadata } from "next";
import CartClient from "./CartClient";

type Props = {
  params: Promise<{ locale: ELocale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/cart",
    titles: {
      uk: "Кошик",
      ru: "Корзина",
    },
    descriptions: {
      uk: "Ваш кошик — SolarMan. Оформте замовлення на обладнання для сонячних електростанцій.",
      ru: "Ваша корзина — SolarMan. Оформите заказ на оборудование для солнечных электростанций.",
    },
  });
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  const exchangeRate = await getExchangeRate();

  return (
    <CartClient locale={locale} exchangeRate={exchangeRate?.value ?? null} />
  );
}
