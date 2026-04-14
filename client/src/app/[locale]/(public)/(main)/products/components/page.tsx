import type { Metadata } from "next";

import { ELocale } from "@/src/i18n/routing";
import {
  buildMetadata,
  hasMeaningfulSearchParams,
} from "@/src/shared/utils/seo";
import ProductsCatalog, { type ProductsSearchParams } from "../ProductsCatalog";
import { PRODUCT_CATEGORY_SEO } from "../products-seo";

const SEO = PRODUCT_CATEGORY_SEO.components;

type Props = {
  params: Promise<{ locale: ELocale }>;
  searchParams: Promise<ProductsSearchParams>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;

  return buildMetadata({
    locale,
    path: SEO.path,
    titles: SEO.titles,
    descriptions: SEO.descriptions,
    keywords: SEO.keywords,
    noIndex: hasMeaningfulSearchParams(searchParamsResolved),
  });
}

export default async function ComponentsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const searchParamsResolved = await searchParams;

  return (
    <ProductsCatalog
      locale={locale}
      searchParams={searchParamsResolved}
      seo={SEO}
      fixedCategory={SEO.category}
    />
  );
}
