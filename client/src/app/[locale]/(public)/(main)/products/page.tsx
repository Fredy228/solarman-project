import { redirect } from "@/src/i18n/navigation";
import { ELocale } from "@/src/i18n/routing";

type Props = {
  params: Promise<{ locale: ELocale }>;
};

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/products/solar-panels", locale });
}
