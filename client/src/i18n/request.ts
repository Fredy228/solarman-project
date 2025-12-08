import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { hasLocale } from "next-intl";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  console.log(`Requested locale: ${requested}, resolved locale: ${locale}`);

  return {
    locale,
    messages: {
      common: (await import(`./messages/${locale}/common.json`)).default,
      home: (await import(`./messages/${locale}/home.json`)).default,
      refine: (await import(`./messages/${locale}/refine.json`)).default,
    },
  };
});
