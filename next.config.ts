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
  if (process.env.WPET_BUILD_TARGET === "vercel" || process.env.VERCEL === "1") return {
    ...nextConfig,
    output: undefined,
    // The Node route is omitted from Worker static exports, included in native Next builds.
    pageExtensions: ["vercel.ts", "tsx", "ts"],
  };
  if (phase === PHASE_DEVELOPMENT_SERVER) return {
    ...nextConfig,
    output: undefined,
    async rewrites() { return [{ source: "/api/:path*", destination: "http://127.0.0.1:8787/api/:path*" }]; },
  };
  return nextConfig;
}
