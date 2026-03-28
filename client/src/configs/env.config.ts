const envConfig = {
  SERVER_PROTOCOL: process.env.NEXT_PUBLIC_SERVER_PROTOCOL,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,

  // Google Analytics 4 — Measurement ID (G-XXXXXXXXXX)
  GA_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",

  // Google Tag Manager — Container ID (GTM-XXXXXXX)
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",

  // Google Ads — Conversion ID (AW-XXXXXXXXXX)
  GTAG_ADS_ID: process.env.NEXT_PUBLIC_GTAG_ADS_ID || "",

  // Google Search Console — verification token
  GSC_VERIFICATION: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
};

export default envConfig;
