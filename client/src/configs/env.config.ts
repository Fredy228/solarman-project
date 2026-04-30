const envConfig = {
  SERVER_PROTOCOL: process.env.NEXT_PUBLIC_SERVER_PROTOCOL,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,

  // Google Tag Manager — Container ID (GTM-XXXXXXX)
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",

  // Meta Pixel — Pixel ID
  META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",

  // Google Search Console — verification token
  GSC_VERIFICATION: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "",
};

export default envConfig;
