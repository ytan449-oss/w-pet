import type { Metadata } from "next";
import { pageDescriptions } from "@/config/seo";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export function pageMetadata(locale: Locale, title: string, path = "", description?: string): Metadata {
  const summary = description ?? pageDescriptions[path]?.[locale];
  if (!summary) throw new Error(`Missing page description: ${locale}/${path}`);
  return {
    title: `${title} | W Pet`,
    description: summary,
    alternates: {
      canonical: localePath(locale, path),
      languages: {
        "en-NZ": localePath("en", path),
        "zh-CN": localePath("zh", path),
        "x-default": localePath("en", path),
      },
    },
    openGraph: {
      title: `${title} | W Pet`,
      description: summary,
      siteName: "W Pet",
      locale: locale === "en" ? "en_NZ" : "zh_CN",
      type: "website",
      url: localePath(locale, path),
    },
    // Preview must stay out of search results until real products/policies exist.
    robots: { index: false, follow: false },
  };
}
