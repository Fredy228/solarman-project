import { defineRouting } from "next-intl/routing";

export enum ELocale {
  UK = "uk",
  RU = "ru",
}

export const routing = defineRouting({
  locales: [ELocale.UK, ELocale.RU],
  defaultLocale: ELocale.UK,
  localePrefix: "always",
});
