import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { siteOrigin } from "@/lib/site-origin";
import "@/app/globals.css";

export const metadata: Metadata = { metadataBase: new URL(siteOrigin()) };

export default function EntryLayout({ children }: { children: ReactNode }) {
  return <html lang="en-NZ"><body><SiteShell locale="en">{children}</SiteShell></body></html>;
}
