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
      contacts: (await import(`${basePath}/contacts.json`)).default,
      projects: (await import(`${basePath}/projects.json`)).default,
      servicesHome: (await import(`${basePath}/services/home.json`)).default,
      servicesEnterprise: (await import(`${basePath}/services/enterprise.json`))
        .default,
      servicesBackupPower: (
        await import(`${basePath}/services/backup-power.json`)
      ).default,
      servicesCrediting: (await import(`${basePath}/services/crediting.json`))
        .default,
      servicesIncome: (await import(`${basePath}/services/income.json`))
        .default,
    },
  };
});
