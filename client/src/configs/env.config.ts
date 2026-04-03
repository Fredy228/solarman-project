const envConfig = {
  SERVER_PROTOCOL: process.env.NEXT_PUBLIC_SERVER_PROTOCOL,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,

  // Google Tag Manager — Container ID (GTM-XXXXXXX)
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",

  // Google Ads — conversion send_to value (AW-XXXXXXXXXX/label)
  GOOGLE_ADS_REQUEST_SEND_TO:
    process.env.NEXT_PUBLIC_GOOGLE_ADS_REQUEST_SEND_TO || "",

  // Google Search Console — verification token
  GSC_VERIFICATION: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
};

export default envConfig;
