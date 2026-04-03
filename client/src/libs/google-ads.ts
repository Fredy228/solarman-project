import envConfig from "@/src/configs/env.config";
import { sendGTMEvent } from "@next/third-parties/google";

export const REQUEST_PRICE_GTM_EVENT = "request_price_success";

type GoogleAdsConversionOptions = {
  formType?: string;
};

export function reportGoogleAdsRequestConversion(
  options: GoogleAdsConversionOptions = {},
): void {
  if (typeof window === "undefined" || !envConfig.GTM_ID) return;

  sendGTMEvent({
    event: REQUEST_PRICE_GTM_EVENT,
    form_type: options.formType ?? "consultation",
    page_path: window.location.pathname,
    page_url: window.location.href,
  });
}
