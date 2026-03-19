import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Suspense, use } from "react";

import { routing } from "@/src/i18n/routing";
import MuiProvider from "@/src/providers/mui-provider";
import { UtmCaptureProvider } from "@/src/providers/utm-capture-provider";
import { notFound } from "next/navigation";

export { metadata } from "@/src/app/layout";

export default function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = use(params);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider>
      <MuiProvider locale={locale}>
        <Suspense fallback={null}>
          <UtmCaptureProvider />
        </Suspense>
        {children}
      </MuiProvider>
    </NextIntlClientProvider>
  );
}
