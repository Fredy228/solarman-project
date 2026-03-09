import { getExchangeRate } from "@/src/features/global-params/api/get-exchange-rate.api";
import type { ELocale } from "@/src/i18n/routing";
import CartClient from "./CartClient";

type Props = {
  params: Promise<{ locale: ELocale }>;
};

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  const exchangeRate = await getExchangeRate();

  return (
    <CartClient locale={locale} exchangeRate={exchangeRate?.value ?? null} />
  );
}
