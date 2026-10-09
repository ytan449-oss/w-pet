import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import "@/app/globals.css";

export const metadata: Metadata = { metadataBase: new URL(siteConfig.url) };

export default function EntryLayout({ children }: { children: ReactNode }) {
  return <html lang="en-NZ"><body><SiteShell locale="en">{children}</SiteShell></body></html>;
}
