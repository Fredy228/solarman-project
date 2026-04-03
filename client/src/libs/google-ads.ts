import envConfig from "@/src/configs/env.config";

type GoogleAdsConversionOptions = {
  url?: string;
};

type GoogleAdsWindow = Window & {
  dataLayer?: object[];
  gtag?: (
    command: "event",
    action: string,
    params?: Record<string, unknown>,
  ) => void;
};

export function reportGoogleAdsRequestConversion(
  options: GoogleAdsConversionOptions = {},
): void {
  if (typeof window === "undefined") return;

  const googleWindow = window as GoogleAdsWindow;
  const { url } = options;
  const sendTo = envConfig.GOOGLE_ADS_REQUEST_SEND_TO;

  if (!sendTo) {
    if (url) {
      googleWindow.location.assign(url);
    }
    return;
  }

  googleWindow.dataLayer = googleWindow.dataLayer || [];

  if (typeof googleWindow.gtag !== "function") {
    googleWindow.gtag = (...args) => {
      googleWindow.dataLayer?.push(args);
    };
  }

  googleWindow.gtag("event", "conversion", {
    send_to: sendTo,
    event_callback: () => {
      if (url) {
        googleWindow.location.assign(url);
      }
    },
  });
}
