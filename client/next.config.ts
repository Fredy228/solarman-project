import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: `${process.env.NEXT_PUBLIC_SERVER_PROTOCOL}` as unknown as
  //         | "http"
  //         | "https",
  //       hostname: `${process.env.NEXT_PUBLIC_SERVER_HOST}`,
  //       port: "",
  //       pathname: "/api/static/**",
  //     },
  //   ],
  // },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://server:${process.env.PORT_SERVER}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
