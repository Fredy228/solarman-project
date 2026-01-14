import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const basePath = `./messages/${locale}`;

  return {
    locale,
    messages: {
      common: (await import(`${basePath}/common.json`)).default,
      header: (await import(`${basePath}/header.json`)).default,
      refine: (await import(`${basePath}/refine.json`)).default,
      validation: (await import(`${basePath}/validation.json`)).default,
      home: (await import(`${basePath}/home.json`)).default,
      portfolio: (await import(`${basePath}/portfolio.json`)).default,
      about: (await import(`${basePath}/about.json`)).default,
    },
  };
});
