import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8080", pathname: "/portfolio-api/uploads/**", search: "" },
    ],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
