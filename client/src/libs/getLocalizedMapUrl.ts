import { ELocale } from "../i18n/routing";

export const getLocalizedMapUrl = (url: string, lang: ELocale): string => {
  const targetParams = lang === ELocale.UK ? "!1suk!2sua" : "!1sru!2sru";

  const pbRegex = /!1s[a-zA-Z]{2}!2s[a-zA-Z]{2}/g;

  if (pbRegex.test(url)) {
    return url.replace(pbRegex, targetParams);
  }

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("hl", lang);
    return urlObj.toString();
  } catch (e) {
    console.error(e);
    return `${url}&hl=${lang}`;
  }
};
