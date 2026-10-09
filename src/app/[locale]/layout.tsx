import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import { requireLocale } from "@/lib/i18n";
import { locales } from "@/types/catalog";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "W Pet | An original New Zealand pet brand",
  description: siteConfig.description,
};

export const dynamicParams = false;
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params);
  return <html lang={locale === "zh" ? "zh-CN" : "en-NZ"}><body><SiteShell locale={locale}>{children}</SiteShell></body></html>;
}
