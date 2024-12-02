import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frqdeijtcguxcozmpucc.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/service_pictures/**",
      },
    ],
  },
};

export default nextConfig;
