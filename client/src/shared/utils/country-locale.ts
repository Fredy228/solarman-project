import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import ukLocale from "i18n-iso-countries/langs/uk.json";

// Register locales once
countries.registerLocale(enLocale);
countries.registerLocale(ruLocale);
countries.registerLocale(ukLocale);

/**
 * Get localized country name by ISO code
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "US", "UA", "DE")
 * @param locale - Locale code (e.g., "uk", "ru", "en")
 * @returns Localized country name or original code if not found
 */
export function getCountryName(countryCode: string, locale: string): string {
  const normalizedCode = countryCode.toUpperCase();
  const countryName = countries.getName(normalizedCode, locale);
  return countryName || countryCode;
}

/**
 * Get all countries as array of {code, name} objects for a specific locale
 * @param locale - Locale code (e.g., "uk", "ru", "en")
 * @returns Array of country objects
 */
export function getAllCountries(locale: string): Array<{ code: string; name: string }> {
  const countryList = countries.getNames(locale);
  return Object.entries(countryList).map(([code, name]) => ({
    code,
    name,
  }));
}
