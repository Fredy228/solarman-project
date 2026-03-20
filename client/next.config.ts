import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // allowedDevOrigins: ["192.168.1.102", "192.168.1.104"],
  /* config options here */
  images: {
    // remotePatterns: [
    //   {
    //     protocol: `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}` as unknown as
    //       | "http"
    //       | "https"
    //     ,
    //     hostname: `${process.env.NEXT_PUBLIC_SERVER_HOST}`,
    //     port: "",
    //     pathname: "/api/static/**",
    //   },
    // ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      // issuer: /\.[jt]sx?$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://server:${process.env.PORT_SERVER}/api/:path*`,
      },
    ];
  },
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
};

export default withNextIntl(nextConfig);
