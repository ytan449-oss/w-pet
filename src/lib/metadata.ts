import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localePath } from "@/lib/routing";
import type { Locale } from "@/types/catalog";

export function pageMetadata(locale: Locale, title: string, path = "", description?: string): Metadata {
  return {
    title: `${title} | W Pet`,
    description: description ?? (locale === "zh" ? "W Pet，新西兰原创宠物品牌。探索 Aotearoa Bloom 花卉系列。" : siteConfig.description),
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
      siteName: "W Pet",
      locale: locale === "en" ? "en_NZ" : "zh_CN",
      type: "website",
      url: localePath(locale, path),
    },
    // Preview must stay out of search results until real products/policies exist.
    robots: { index: false, follow: false },
  };
}
