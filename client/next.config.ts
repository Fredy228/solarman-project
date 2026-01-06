import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}` as unknown as
  //         | "http"
  //         | "https"
  //       ,
  //       hostname: `${process.env.NEXT_PUBLIC_SERVER_HOST}`,
  //       port: "",
  //       pathname: "/api/static/**",
  //     },
  //   ],
  // },
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
};

export default withNextIntl(nextConfig);
