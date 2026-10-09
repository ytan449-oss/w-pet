import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  experimental: { globalNotFound: true },
};

export default function config(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) return {
    ...nextConfig,
    output: undefined,
    async rewrites() { return [{ source: "/api/:path*", destination: "http://127.0.0.1:8787/api/:path*" }]; },
  };
  return nextConfig;
}
